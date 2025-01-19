import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userschema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    avatar: {
      type: String, // cloudinary url
      required: true,
    },

    coverImage: {
      type: String,
    },

    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

    Passsword: {
      type: String,
      required: [true, "password is required"],
    },

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userschema.pre("save", async function (next) {
  if (!this.isModified("Passsword")) {

  } return next();
  this.Passsword =  bcrypt.hash(this.Passsword, 10);
  next();
});
userschema.methods.isPasswordCorrect = async function (password) {
 return await bcrypt.compare(password, this.Passsword);
};

userschema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id ,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },

    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn : process.env.ACCESS_TOKEN_EXPIRY ,
    }
  );
};
userschema.methods.generatRefreshToken = function () {
  return jwt.sign(
    { id: this._id ,
      
    },

    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn : process.env.REFRESH_TOKEN_EXPIRY ,
    }
  );
};

export const User = mongoose.model("User", userschema);
