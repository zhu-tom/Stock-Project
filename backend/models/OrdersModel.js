const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: ["buy", "sell", "withdraw", "deposit"],
        required: true,
    },
    symbol: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: false,
    },
    amount: {
        type: Number,
        required: true,
        min: 1,
    },
    fulfilled: {
        type: Number,
        required: false,
        default: 0,
    },
    done: {
        type: Boolean,
        required: true,
        default: false,
    },
    datetime: {
        type: Date,
        required: true,
        default: Date.now
    },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;