const mongoose = require("mongoose");

const subSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    symbol: {
        type: String,
        required: true,
    },
    event: {
        type: Number,
        min: 0,
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
        required: true,
    },
});

const Subscription = mongoose.model("Subscription", subSchema);

module.exports = Subscription;