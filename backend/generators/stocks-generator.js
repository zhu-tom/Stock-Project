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
                            trades: 1,
                        }
                    }, { useFindAndModify: false}).exec()),
                    // new Order({
                    //     creator: "none",
                    //     type: "buy"
                    // }).save()
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
                    }).save(() => {
                        resolve();
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
                User.findOne({username: "admin"}, (err, doc) => {
                    doc.portfolio.findOne({amount: 100}, (e, d) => {
                        console.log(d);
                        db.close();
                        process.exit();
                    });
                })
                
            })
        })
	});
});