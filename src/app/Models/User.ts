import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: "Restaurater" },
        idRestaurant: { type: String, required: true },
        validated: { type: Boolean, default: false },
    },
    { collection: "User" }
);

export default mongoose.model("User", userSchema);
