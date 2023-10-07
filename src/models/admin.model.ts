import validator from "validator";
import { model, Schema } from "mongoose";

const crypto = require("crypto");
const bcrypt = require("bcrypt");

export const adminSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please Provide a name"],
      maxLength: [50, "Name should be under 50 characters"],
    },
    
    mobile: {
      type: String,
      required: [true, "Please Provide a email"],
      maxLength: [10],
      minLength: [10],
      unique: true,
    },
    password: {
      type: String,
      required: [false, "Please Provide a password"],
      minLength: [8, "Password should be atleast 8 characters"],
      select: false,
    //   validate: {
    //     validator: function (value) {
    //       // Use a regular expression to check for alphanumeric characters
    //       return /^(?=.[a-zA-Z])(?=.[0-9])(?=.[$@#&!]).$/.test(value);
    //     },
    //     message: "Password should be alphanumeric (letters and numbers only)",
    //   },
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    // updatedAt: {
    //   type: Date,
    // },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },

  {
    methods: {
      checkValidPassword: async function (userSendPassword: string) {
        return bcrypt.compare(userSendPassword, this.password);
      },
      samepassword: async function (userSendPassword: string) {
        return bcrypt.compare(userSendPassword, this.password);
      },
    },

  }
);

adminSchema.methods.createResetpasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const token=crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordTokenExpires = Date.now() + 10 + 6 + 1000;
  this.resetPasswordToken = token
  return token;
};

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

const Admin = model("admin", adminSchema);
export default Admin;