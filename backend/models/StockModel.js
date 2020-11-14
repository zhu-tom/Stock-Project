const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    market: {
        type: String,
        required: true,
    },
    daily: {
        type: {
            high: {
                type: Number,
                min: 0,
                required: true,
            },
            low: {
                type: Number,
                min: 0,
                required: true,
            },
            trades: {
                type: Number,
                min: 0,
                required: true,
            }
        },
        required: true,
        default: {
            high: 0,
            low: 0,
            trades: 0,
        }
    },
    current: {
        type: {
            bid: {
                type: Number,
                min: 0,
                default: 0,
                required: true,
            },
            ask: {
                type: Number,
                min: 0,
                default: 0,
                required: true,
            }
        },
        default: {bid: 0, ask: 0},
        required: true,
    },
});

stockSchema.methods.findOrders = function(cb) {
    return this.model("Order").find({symbol: this.symbol, done: false}, cb);
}

stockSchema.methods.findHistory = function(cb) {
    return this.model("Order").find({symbol: this.symbol, done: true}, cb);
}

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;