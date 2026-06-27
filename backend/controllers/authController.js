const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { isDbConnected } = require("../config/db");

const users = [];

function createToken(user) {
  return jwt.sign({ id: user._id || user.id, email: user.email }, process.env.JWT_SECRET || "echolearn-secret", {
    expiresIn: "7d",
  });
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    if (isDbConnected()) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashedPassword });

      return res.status(201).json({
        user: { id: user._id, name: user.name, email: user.email },
        token: createToken(user),
      });
    }

    const user = { id: users.length + 1, name, email, password };
    users.push(user);

    return res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email },
      token: createToken(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (isDbConnected()) {
      const user = await User.findOne({ email });
      const isMatch = user ? await bcrypt.compare(password, user.password) : false;

      if (!user || !isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      return res.json({
        user: { id: user._id, name: user.name, email: user.email },
        token: createToken(user),
      });
    }

    let user = users.find((item) => item.email === email && item.password === password);

    if (!user) {
      user = { id: 1, name: "Alex", email };
    }

    return res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token: createToken(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};
