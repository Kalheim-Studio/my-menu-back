import mongoose from "mongoose";
import menuSchema from "./Schema/Menu";
import itemSchema from "./Schema/Item";
import tableSchema from "./Schema/Table";

const restaurantSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        postalCode: { type: String, required: true },
        city: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        menu: [{ type: menuSchema }],
        plat: [{ type: itemSchema }],
        table: [{ type: tableSchema }],
        validated: { type: String, required: true },
        Banner: Buffer,
        backgColor: String,
    },
    { collection: "Restaurant" }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export { Restaurant };
