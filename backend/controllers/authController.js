const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function createToken(user) {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET || "finmate-dev-secret",
    { expiresIn: "7d" },
  );
}

function safeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    accountType: user.accountType,
    profileImage: user.profileImage,
  };
}

async function register(req, res) {
  try {
    const { name, email, password, accountType } = req.body;

    if (!name || !email || !password || password.length < 6) {
      return res.status(400).json({
        message: "Name, valid email and a 6+ character password are required",
      });
    }

    if (await User.findOne({ email })) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      accountType,
      password: hashedPassword,
    });

    res.status(201).json({ token: createToken(user), user: safeUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    const passwordMatches = user
      ? await bcrypt.compare(req.body.password || "", user.password)
      : false;

    if (!user || !passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ token: createToken(user), user: safeUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getCurrentUser(req, res) {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
}

async function updateProfile(req, res) {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: { name: req.body.name, accountType: req.body.accountType } },
    { new: true },
  ).select("-password");

  res.json(user);
}

async function changePassword(req, res) {
  const user = await User.findById(req.user.id);
  const passwordMatches = await bcrypt.compare(
    req.body.currentPassword || "",
    user.password,
  );

  if (!passwordMatches) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  user.password = await bcrypt.hash(req.body.newPassword, 10);
  await user.save();
  res.json({ message: "Password updated" });
}

module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
};
