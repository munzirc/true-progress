import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

//Login
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", severity: "error" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production"  ? "None" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { _id, __v, password: pass, ...rest } = user._doc;

    res
      .status(200)
      .json({ user: rest, message: "Login successful", severity: "success" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message || "Internal Server Error",
      severity: "error",
    });
  }
};

//register
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists)
      return res
        .status(400)
        .json({ message: "User already exists!!", severity: "error" });

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
    });
    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production"  ? "None" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { _id, __v, password: pass, ...rest } = user._doc;

    res.status(201).json({
      user: rest,
      message: "Registered successfully",
      severity: "success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Internal Server Error",
      severity: "error",
    });
  }
};

//logout
const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production"  ? "None" : "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "Logged out successfully", severity: "success" });
};

const authCheck = async (req, res) => {
  const token = req.cookies.token;

  if (!token) return res.sendStatus(401);

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(401);
  }
};

export default {
  signin,
  signup,
  logout,
  authCheck,
};
