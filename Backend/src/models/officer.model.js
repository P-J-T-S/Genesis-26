import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const officerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            index: true,
            minlength: [2, "Name must be at least 2 characters"],
        },

        ward_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ward",
            default: null, // Nullable for admin/supervisor
        },

        login_id: {
            type: String,
            required: [true, "Login ID is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },

        password_hash: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
        },

        is_active: {
            type: Boolean,
            default: true,
        },

        refreshToken: {
            type: String,
        },
    },
    { timestamps: true }
);

// Hash Password
officerSchema.pre("save", async function () {
    if (!this.isModified("password_hash")) return;
    this.password_hash = await bcrypt.hash(this.password_hash, 10);
});

// Instance methods related to model
officerSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password_hash);
};

officerSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            login_id: this.login_id,
            name: this.name,
            ward_id: this.ward_id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

officerSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const Officer = mongoose.model("Officer", officerSchema);