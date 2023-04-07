import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, default: "Restaurater" },
        restaurantId: { type: String, required: true },
    },
    { collection: "User" }
);

export default mongoose.model("User", userSchema);
