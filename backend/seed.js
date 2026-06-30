require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Department = require('./models/Department');
const Programme = require('./models/Programme');
const Block = require('./models/Block');
const Room = require('./models/Room');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tms_test';

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // 1. Create Departments
    const departmentsToCreate = [
      { name: 'General Department', shortName: 'GEN', description: 'General administration and support staff' },
      { name: 'Computer Science & Engineering', shortName: 'CSE', description: 'Department of CSE' },
      { name: 'Electronics & Communication Engineering', shortName: 'ECE', description: 'Department of ECE' },
      { name: 'Mechanical Engineering', shortName: 'MECH', description: 'Department of Mechanical Engineering' }
    ];

    const depts = {};
    for (const deptData of departmentsToCreate) {
      let dept = await Department.findOne({ shortName: deptData.shortName });
      if (!dept) {
        dept = await Department.create(deptData);
        console.log(`Created Department: ${dept.name}`);
      } else {
        console.log(`Department already exists: ${dept.name}`);
      }
      depts[deptData.shortName] = dept;
    }

    // 2. Create Programmes
    const programmesToCreate = [
      { name: 'B.Tech Computer Science & Engineering', shortName: 'BTCSE', department: depts['CSE']._id, description: 'B.Tech CSE Programme' },
      { name: 'B.Tech Electronics & Communication', shortName: 'BTECE', department: depts['ECE']._id, description: 'B.Tech ECE Programme' },
      { name: 'B.Tech Mechanical Engineering', shortName: 'BTMECH', department: depts['MECH']._id, description: 'B.Tech MECH Programme' }
    ];

    const progs = {};
    for (const progData of programmesToCreate) {
      let prog = await Programme.findOne({ shortName: progData.shortName });
      if (!prog) {
        prog = await Programme.create(progData);
        console.log(`Created Programme: ${prog.name}`);
      } else {
        console.log(`Programme already exists: ${prog.name}`);
      }
      progs[progData.shortName] = prog;
    }

    // 3. Create Blocks
    const blocksToCreate = [
      { name: 'Ramanujan Block', department: depts['CSE']._id, programme: progs['BTCSE']._id, description: 'CSE Department Building' },
      { name: 'Edison Block', department: depts['ECE']._id, programme: progs['BTECE']._id, description: 'ECE Department Building' },
      { name: 'Newton Block', department: depts['MECH']._id, programme: progs['BTMECH']._id, description: 'Mechanical Department Building' }
    ];

    const blocks = {};
    for (const blockData of blocksToCreate) {
      let block = await Block.findOne({ name: blockData.name, department: blockData.department });
      if (!block) {
        block = await Block.create(blockData);
        console.log(`Created Block: ${block.name}`);
      } else {
        console.log(`Block already exists: ${block.name}`);
      }
      blocks[blockData.name] = block;
    }

    // 4. Create Rooms
    const roomsToCreate = [
      { roomNumber: '101', department: depts['CSE']._id, programme: progs['BTCSE']._id, block: blocks['Ramanujan Block']._id, floor: 1, capacity: 60, description: 'CSE Classroom 1' },
      { roomNumber: '102', department: depts['CSE']._id, programme: progs['BTCSE']._id, block: blocks['Ramanujan Block']._id, floor: 1, capacity: 60, description: 'CSE Computer Lab' },
      { roomNumber: '201', department: depts['ECE']._id, programme: progs['BTECE']._id, block: blocks['Edison Block']._id, floor: 2, capacity: 60, description: 'ECE Classroom 1' },
      { roomNumber: '202', department: depts['ECE']._id, programme: progs['BTECE']._id, block: blocks['Edison Block']._id, floor: 2, capacity: 60, description: 'ECE DSP Lab' },
      { roomNumber: '301', department: depts['MECH']._id, programme: progs['BTMECH']._id, block: blocks['Newton Block']._id, floor: 3, capacity: 60, description: 'MECH Classroom 1' },
      { roomNumber: '302', department: depts['MECH']._id, programme: progs['BTMECH']._id, block: blocks['Newton Block']._id, floor: 3, capacity: 60, description: 'MECH Workshop' }
    ];

    for (const roomData of roomsToCreate) {
      let room = await Room.findOne({ roomNumber: roomData.roomNumber, block: roomData.block });
      if (!room) {
        room = await Room.create(roomData);
        console.log(`Created Room: ${room.roomNumber} in ${blocks['Ramanujan Block'].name}`);
      } else {
        console.log(`Room ${room.roomNumber} already exists in its block`);
      }
    }

    // 5. Create Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const superAdminHashedPassword = await bcrypt.hash('SuperAdmin@123', 10);

    const usersToCreate = [
      {
        username: 'admin',
        email: 'admin@tms.com',
        phone: '1234567890',
        password: hashedPassword,
        role: 'SuperAdmin',
        department: depts['GEN']._id
      },
      {
        username: 'superadmin',
        email: 'superadmin@example.com',
        phone: '0000000000',
        password: superAdminHashedPassword,
        role: 'SuperAdmin',
        department: depts['GEN']._id
      },
      {
        username: 'staff_net',
        email: 'networking@tms.com',
        phone: '1234567891',
        password: hashedPassword,
        role: 'Networking Staff',
        department: depts['GEN']._id
      },
      {
        username: 'staff_elec',
        email: 'electrician@tms.com',
        phone: '1234567892',
        password: hashedPassword,
        role: 'Electrician',
        department: depts['GEN']._id
      },
      {
        username: 'staff_plum',
        email: 'plumber@tms.com',
        phone: '1234567893',
        password: hashedPassword,
        role: 'Plumber',
        department: depts['GEN']._id
      },
      {
        username: 'user1',
        email: 'user1@tms.com',
        phone: '1234567894',
        password: hashedPassword,
        role: 'User',
        department: depts['GEN']._id
      }
    ];

    for (const userData of usersToCreate) {
      const exists = await User.findOne({ email: userData.email });
      if (!exists) {
        await User.create(userData);
        console.log(`Created user: ${userData.username} (${userData.role})`);
      } else {
        exists.department = userData.department;
        await exists.save();
        console.log(`Updated user: ${userData.username}`);
      }
    }

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedData();
