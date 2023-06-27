import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        restaurantId: { type: String, required: true },
        table: {type: String, required: true},
        menus: [{
            name: {type: String, require: true},
            orderMenuId: {type: String, require: true},
            menuContent: {
                appetizer: {type: String, required: true},
                mainCourse:  {type: String, required: true},
                dessert:  {type: String, required: true}
            },
            price: Number,
            isAsked: Boolean
        }],
        cardItems: [{
            name: {type: String, require: true},
            orderItemId: {type: String, require: true},
            price: Number,
            isAsked: Boolean
        }]
    },
    { collection: "Order" }
);

const Order = mongoose.model("User", orderSchema);

export { Order };
