const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.registerUser = async (req, res, next) => {
  try {
    //console.log(req.body);
    const { username, password, role } = req.body;
    if (!username || !password) {
      res.status(400);
      throw new Error('Username and password are required');
    }

    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, hashed, role || 'user']
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    next(err); // send to errorHandler
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = users[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401);
      throw new Error('Invalid username or password');
    }

    const token = generateToken(user);
    res.json({status: 'success', token: token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    next(err);
  }
};
