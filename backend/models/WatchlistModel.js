const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
    },
    stocks: {
        type: [{
            type: mongoose.Types.ObjectId,
            ref: "Stock",
            required: true,
        }],
        required: true,
        default: [],
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    }
});

const Watchlist = mongoose.model("Watchlist", watchlistSchema);

module.exports = Watchlist;