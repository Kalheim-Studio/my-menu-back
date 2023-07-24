import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        siret: { type: String, required: true},
        address: { type: String, required: true },
        postalCode: { type: String, required: true },
        city: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        menu: [{ 
            name: { type: String, required: true },
            appetizers: [String],
            mainCourses: [String],
            desserts: [String],
            price: { type: Number, required: true },
        }],
        plat: [{ 
            name: { type: String, required: true },
            description: { type: String, required: true },
            image: String,
            price: { type: Number, required: true },
            ingredients: { type: Array, default: [] },
            allergens: { type: Array, default: [] },
            type: String,
            Menu: String,
        }],
        table: [{
            identifier: { type: String, required: true },
            openend: { type: Boolean, default: false },
            help: { type: Boolean, default: false },
        }],
        validated: { type: String, required: true },
        Banner: String,
        backgColor: String,
    },
    { collection: "Restaurant" }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export { Restaurant };
