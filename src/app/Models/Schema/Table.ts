import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    identifier: { type: String, required: true },
    openend: { type: Boolean, default: false },
    help: { type: Boolean, default: false },
});

export default tableSchema;
