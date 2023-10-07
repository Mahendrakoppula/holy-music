import Admin from "@/models/admin.model";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const secretKey = "secretkey";

export const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await Admin.find();
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAdminById = async (req: Request, res: Response) => {
  try {
    const admin = await Admin.findById({ _id: req.params.id });
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteAdminById = async (req: Request, res: Response) => {
  try {
    const admin = await Admin.deleteOne({ _id: req.params.user_id });
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const Admin_signUp = async (req: Request, res: Response) => {
  const { name,  mobile, password } = req.body;
  if (!name) {
    return res.status(400).json("First Name is required");
  }
  if (!mobile) {
    return res.status(400).json("Mobile Number is required");
  }
  if (!password) {
    return res.status(400).json("Password is required");
  }
  if (password.length < 8) {
    return res.status(400).json("Password should be at least 8 characters");
  } else {
    try {
      const admin = await Admin.create({
        name,
        mobile,
        password,
      });
      return res.status(200).json("success");
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

export const Admin_signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { mobile, password } = req.body;
  if (!mobile) {
    return res.status(400).json("Mobile Number is required");
  }
  if (!password) {
    return res.status(400).json("Password is required");
  }
  const admin = await Admin.findOne({ mobile }).select("+password");
  console.log({ admin });
  if (!admin) {
    return next(new Error("Mobile Number and password not matched "));
  }
  const isCorrectPassword = await admin.checkValidPassword(password);
  if (!isCorrectPassword) {
    return next(new Error("Incorrect Password"));
  } else {
    const token = jwt.sign({ admin }, secretKey);
    res.status(200).json({ token, admin });

    // const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
    // res.status(200).json("success")
  }
};

