import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        identifier: { type: String, required: true },
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["Owner", "Manager", "Waiter"], required: true },
        restaurantId: { type: String, required: true },
    },
    { collection: "User" }
);

const User = mongoose.model("User", userSchema);

export { User };
