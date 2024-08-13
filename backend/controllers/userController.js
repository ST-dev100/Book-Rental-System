require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createUser,findUserByEmail } = require('../models/userModel');

const signup = async (req, res) => {
  const { email, password, location, phoneNumber } = req.body;
  try {
    const user = await createUser(email, password, location, phoneNumber);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await findUserByEmail(email);

    // Check if the user exists and the password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if the user status is 'inactive' or approved status is 'nonapproved'
    if (user.status === 'inactive' || user.approved === 'nonapproved') {
      return res.status(401).json({ message: 'Invalid status' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set the JWT token in a cookie
    res.cookie('jwt', token, {
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      httpOnly: true, // Prevent XSS attacks
      sameSite: 'None', 
    });  

    // Respond with user role and email 
    res.json({ userRole: user.role, email: user.email });

  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  signup,
  login
};
