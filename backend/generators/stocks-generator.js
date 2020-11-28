const mongoose = require("mongoose");
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const Stock = require("../models/StockModel");
const stockData = require("../stock_data.json");

const populateUsers = () => {
    return new Promise(resolve => {
        bcrypt.hash("admin", 10, (_, encrypted) => {
            new User({
                username: "admin",
                password: encrypted,
                type: "admin"
            }).save(() => {
                resolve();
            });
        });
    }) ;
}

const populateStocks = () => {
    return stockData.map(({symbol, name, market}) => {
        return new Stock({
            symbol,
            name,
            market,
        }).save();
    });
}

mongoose.connect("mongodb://localhost/stockbroker", {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	mongoose.connection.db.dropDatabase(function(err){
		if(err){
			console.log("Error dropping database:");
			console.log(err);
			return;
		}
        console.log("Dropped database. Starting re-creation.");
		
		Promise.all([populateUsers(), ...populateStocks()]).then(() => {
            console.log("Done populating collections");
            db.close();
            process.exit();
        });
	});
});