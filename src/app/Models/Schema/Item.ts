import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: Buffer },
    price: { type: Number, require },
    ingredient: { type: Array, default: [] },
    allergen: { type: Array, default: [] },
    type: String,
    Menu: String,
});

export default itemSchema;
