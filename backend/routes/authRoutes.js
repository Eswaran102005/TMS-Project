const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const Department = require('../models/Department');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authMiddleware, authController.getProfile);

router.get('/seed-db', async (req, res) => {
  try {
    let dept = await Department.findOne({ shortName: 'GEN' });
    if (!dept) {
      dept = await Department.create({ name: 'General Department', shortName: 'GEN' });
    }

    const hashedPassword = await bcrypt.hash('password123', 10);
    const superAdminHashedPassword = await bcrypt.hash('SuperAdmin@123', 10);

    const usersToCreate = [
      {
        username: 'admin',
        email: 'admin@tms.com',
        phone: '1234567890',
        password: hashedPassword,
        role: 'SuperAdmin',
        department: dept._id
      },
      {
        username: 'superadmin',
        email: 'superadmin@example.com',
        phone: '0000000000',
        password: superAdminHashedPassword,
        role: 'SuperAdmin',
        department: dept._id
      },
      {
        username: 'staff_net',
        email: 'networking@tms.com',
        phone: '1234567891',
        password: hashedPassword,
        role: 'Networking Staff',
        department: dept._id
      },
      {
        username: 'staff_elec',
        email: 'electrician@tms.com',
        phone: '1234567892',
        password: hashedPassword,
        role: 'Electrician',
        department: dept._id
      },
      {
        username: 'staff_plum',
        email: 'plumber@tms.com',
        phone: '1234567893',
        password: hashedPassword,
        role: 'Plumber',
        department: dept._id
      },
      {
        username: 'user1',
        email: 'user1@tms.com',
        phone: '1234567894',
        password: hashedPassword,
        role: 'User',
        department: dept._id
      }
    ];

    const results = [];
    for (const userData of usersToCreate) {
      const exists = await User.findOne({ email: userData.email });
      if (!exists) {
        await User.create(userData);
        results.push(`Created user: ${userData.username}`);
      } else {
        exists.password = userData.password;
        await exists.save();
        results.push(`Updated password for user: ${userData.username}`);
      }
    }

    res.json({ message: 'Seeding completed successfully', details: results });
  } catch (error) {
    res.status(500).json({ message: 'Seeding failed', error: error.message });
  }
});

module.exports = router;
