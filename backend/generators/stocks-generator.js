const mongoose = require("mongoose");
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const Stock = require("../models/StockModel");
const stockData = require("../stock_data.json");
const { use } = require("../routes/me-router");

const users = [
    {
        username: "admin",
        password: "admin",
    },
    {
        username: "user",
        password: "user",
    }
]

const populateUsers = () => {
    return users.map(({username, password}) => {
        return new Promise(resolve => {
            bcrypt.hash(password, 10, (_, encrypted) => {
                new User({
                    username: username,
                    password: encrypted,
                    type: username === "admin" && "basic"
                }).save(() => {
                    resolve();
                });
            });
        });
    })
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
		
		Promise.all([...populateUsers(), ...populateStocks()]).then(() => {
            console.log("Done populating collections");
            db.close();
            process.exit();
        });
	});
});