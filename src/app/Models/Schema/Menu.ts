import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    name: { type: String },
    price: { type: Number },
});

export default menuSchema;
