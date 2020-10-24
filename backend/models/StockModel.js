const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    symbol: String,
    
})
const stockModel = mongoose.model("Stock")