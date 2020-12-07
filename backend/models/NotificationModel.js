const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    read: {
        type: Boolean,
        default: false,
        required: true,
    },
    datetime: {
        type: Date,
        default: Date.now,
        required: true,
    },
    type: {
        type: String,
        enum: ["trade", "sub"],
        required: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    },
    subscription: {
        type: mongoose.Types.ObjectId,
        required: () => {
            return this.type === "sub";
        },
        ref: "Subscription"
    },
    trade: {
        type: {
            amount: Number,
            price: Number,
            order: {
                type: mongoose.Types.ObjectId,
                ref: "Order",
                required: true,
            },
        },
        required: () => {
            return this.type == "trade";
        },
    },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;