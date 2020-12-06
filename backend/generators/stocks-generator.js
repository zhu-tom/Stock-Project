const mongoose = require("mongoose");
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const Stock = require("../models/StockModel");
const stockData = require("../stock_data.json");
const Order = require("../models/OrdersModel");

const users = [
    {
        username: "admin",
        password: "admin",
        cash: 10000,
        symbols: ["TWTR", "CPB"]
    },
    {
        username: "user",
        password: "user",
        cash: 10000,
        symbols: ["SPLK", "MITL"]
    }
]

const populateUsers = () => {
    return users.map(({username, password, cash, symbols}) => {
        let portfolio = [];
        let data = {
            value: cash,
            date: Date.now()
        }
        return new Promise(resolve => {
            bcrypt.hash(password, 10, (_, encrypted) => {
                Promise.all([
                    ...symbols.map(symbol => Stock.findOneAndUpdate({symbol}, {
                        price: 100,
                        daily: {
                            high: 100,
                            low: 100,
                            trades: 0,
                        },
                        current: {
                            ask: 20,
                            bid: 0,
                        }
                    }, { useFindAndModify: false}).exec()),
                ]).then((docs) => {
                    for (const doc of docs) {
                        portfolio.push({
                            stock: doc._id,
                            avgPrice: 100,
                            amount: 100,
                        });
                        data.value += 10000;
                    }
                    new User({
                        username,
                        password: encrypted,
                        cash,
                        portfolio,
                        data: [data],
                        type: username === "admin" ? "admin" : "basic"
                    }).save((_, doc) => {
                        Promise.all(symbols.map(symbol => new Order({
                            creator: doc._id,
                            type: "sell",
                            symbol,
                            amount: 20,
                            price: 20,
                        }).save())).then(() => {
                            resolve();
                        })
                    });
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
		Promise.all(populateStocks()).then(() => {
            Promise.all(populateUsers()).then(() => {
                console.log("Done populating collections");
                db.close();
                process.exit();
            });
        });
	});
});