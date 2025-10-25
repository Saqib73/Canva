import { User } from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  cookieOptions,
  generateTokenAndCookie,
} from "../utils/generateToken.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";

// Signup
export const signup = async (req, res, next) => {
  try {
    const { name, userName, password, confirmPassword, email, bio, isArtist } =
      req.body;
    if (password.length < 6)
      return new Error("password must have at least 6 characters");
    if (password != confirmPassword) return new Error("Passwords do not match");

    if (bio == "") {
      bio = "New User";
    }

    // const file = req.file;

    // if (!file) return new Error("please upload profile");
    // const result = await uploadFilesToCloudinary([file]);

    // const profile_pic = {
    //   public_id: result[0].public_id,
    //   url: result[0].url,
    // };

    const existing = await User.findOne({ userName });
    console.log(existing);
    if (existing) return next(new ErrorHandler("Username already exists", 400));

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      userName,
      password: hashedPassword,
      email,
      bio,
      // profile_pic,
      isArtist,
    });

    await user.save();
    generateTokenAndCookie(user._id, res, "User Created");
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Login
export const login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });

    const match = await bcrypt.compare(password, user.password);
    if (!user || !match)
      return next(new ErrorHandler("Invalid Credentials", 400));

    generateTokenAndCookie(user._id, res, `Welcome back ${user.name}`);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  return res
    .cookie("jwt", "", { ...cookieOptions, maxAge: 0 })
    .status(200)
    .json({
      success: true,
      message: "Logged out successfulyy!",
    });
};
