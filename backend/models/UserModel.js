const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 30,
        match: /[A-Za-z]+/,
		trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["basic", "admin"],
        default: "basic",
        required: true,
    },
    cash: {
        type: Number,
        default: 0,
        min: 0,
        required: true,
    },
    portfolio: {
        type: [{
            amount: Number,
            avgPrice: Number,
            stock: {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: "Stock"
            },
        }],
        default: [],
        required: true,
    },
    data: {
        type: [{
            datetime: Date,
            value: Number,
        }],
        required: true,
    },
});

userSchema.methods.findWatchlists = function(cb) {
    return this.model("Watchlist").find({creator: this._id}, cb);
}

userSchema.methods.findOrders = function(cb) {
    this.model("Order").find({creator: this._id, done: false}, cb);
}

userSchema.methods.findHistory = function(cb) {
    this.model("Order").find({creator: this._id, done: true}, cb);
}

userSchema.methods.findSubscriptions = function(cb) {
    return this.model("Subscription").find({creator: this._id}, cb);
}

const User = mongoose.model("User", userSchema);

module.exports = User;