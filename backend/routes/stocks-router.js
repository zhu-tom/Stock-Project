const express = require('express');
const Notification = require('../models/NotificationModel');
const Order = require('../models/OrdersModel');
const Stock = require('../models/StockModel');
const Subscription = require('../models/SubscriptionModel');
const User = require('../models/UserModel');

const router = express.Router();

const marketQueryParser = (req, res, next) => {
    if (!req.query.q || !req.query.q.length) {
        req.query.q = /.*/;
    }
    if (!req.query.limit) {
        req.query.limit = 10;
    }
    next();
}

router.get("/", marketQueryParser, (req, res) => {
    Stock.find({$or: [{symbol: {$regex: req.query.q, $options: "i"}}, {name: {$regex: req.query.q, $options: "i"}}]}).limit(req.query.limit).exec((err, docs) => {
        if (err) {
            res.status(500).send("Failed to query");
        } else {
            res.send(docs);
        }
    });
});

router.get("/market/:market", (req, res) => {
    Stock.find({market: req.params.market}, (err, docs) => {
        if (err) {
            res.status(500).send("Failed to query");
        } else {
            res.status(200).send(docs);
        }
    });
});

router.param("symbol", (req, res, next) => {
    const {symbol} = req.params;
    Stock.findOne({symbol}, (err, doc) => {
        if (err) {
            res.status(500).send("Failed to query");
        } else if (doc) {
            req.symbol = doc;
            next();
        } else {
            res.status(404).send("Stock not found");
        }
    });
});

const tradeRouter = express.Router();

router.use("/symbol/:symbol", tradeRouter);

tradeRouter.get("/", (req, res) => {
    res.send(req.symbol);
});

const tradeBodyParser = (req, res, next) => {
    if (req.body.amount && req.body.price && req.body.type) {
        if (req.body.type !== "buy" && req.body.type !== "sell") {
            res.status(400).send("Invalid type");
        } else if (req.session.loggedin) {
            User.findOne({username: req.session.username}, (err, doc) => {
                if (err) {
                    res.status(500).send("Failed to query");
                } else if (doc) {
                    req.user = doc;
                    next();
                } else {
                    res.status(404).send("User not found");
                }
            });
        } else {
            res.status(401).send("Not logged in");
        }
    } else {
        res.status(400).send("Bad Request Body");
    }
}

tradeRouter.post("/orders", tradeBodyParser, (req, res) => {
    let {amount, price, type} = req.body;
    const order = new Order({
        amount,
        price,
        type,
        creator: req.user._id,
        symbol: req.symbol.symbol
    });
    if (type === "buy") {
        if (amount * price > req.user.cash) {
            res.status(403).send("Not enough cash");
        } else {
            req.symbol.findOrders()
                .find({type: "sell", price: {$lte: price}, done: false})
                    .sort({price: 'asc'})
                        .exec(async (err, docs) => {
                let index = 0;
                while (amount > 0 && index < docs.length) {
                    const currDoc = docs[index]; // get the current order
                    const remaining = currDoc.amount - currDoc.fulfilled; // find the amount remaining
                    const seller = await User.findById(currDoc.creator); // find the user that made the order
                    const prevAmount = amount; 
                    if (amount >= remaining) { // more in buy order than amount remaining in sell order
                        // complete the sell order
                        currDoc.fulfilled = currDoc.amount;
                        currDoc.done = true;

                        amount -= remaining; // decrement the amount remaining in buy order
                        index++; // move to next sell order
                    } else { // buy order is not enough to fill sell order
                        currDoc.fulfilled += amount; // increase the amount fulfilled of sell order
                        amount = 0; // decrease amount remaining in buy order to 0
                        order.done = true; 
                    }
        
                    const amountDiff = (prevAmount - amount); // amount traded in this iteration
        
                    seller.cash += (amountDiff) * currDoc.price; // add to cash amount sold * price
                    
                    let newPort = [];

                    for (const val of seller.portfolio) {
                        if (val.stock.equals(req.symbol._id)) {
                            const newAmt = val.amount - amountDiff; // decrease the amount owned of the stock
                            if (newAmt > 0) {
                                const sum = (val.amount * val.avgPrice) - (amountDiff * currDoc.price);
                                newPort.push({
                                    ...val.toJSON(), 
                                    amount: val.amount - order.amount,  
                                    avgPrice: sum / newAmt
                                })
                            }
                        } else {
                            newPort.push(val.toJSON());
                        }
                    }

                    console.log(newPort);

                    seller.portfolio = newPort;

                    seller.data.push({
                        date: Date.now(),
                        value: seller.portfolio.reduce((prev, curr) => {
                            return prev + (curr.amount * curr.avgPrice);
                        }, 0) + seller.cash
                    });
            
                    const i = req.user.portfolio.findIndex(val => val.stock.equals(req.symbol._id)); // buyer's stock
                    if (i === -1) { // if not found, add to the portfolio
                        req.user.portfolio.push({amount: order.amount, avgPrice: currDoc.price, stock: req.symbol._id});
                    } else {
                        let sum = req.user.portfolio[i].avgPrice * req.user.portfolio[i].amount; // old sum for avgPrice
                        sum += currDoc.price * amountDiff; // add newly purchased stock
                        req.user.portfolio[i].amount += amountDiff; // increment amount
                        req.user.portfolio[i].avgPrice = sum / (req.user.portfolio[i].amount); // find new average
                    }
                    req.user.cash -= (amountDiff) * currDoc.price; // decrease cash
        
                    req.symbol.price = currDoc.price;
                    req.symbol.daily.high = Math.max(currDoc.price, req.symbol.daily.high);
                    req.symbol.daily.low = Math.min(currDoc.price, req.symbol.daily.low)
                    req.symbol.daily.trades += 1;
                    req.symbol.trades.push({price: currDoc.price});

                    await Promise.all([
                        currDoc.save(), 
                        seller.save(),
                    ]);
                }
                order.fulfilled = order.amount - amount;

                const ask = await req.symbol.findOrders().find({type: "sell", done: false}).sort({price: 'asc'}).limit(1).exec();
                const bid = await req.symbol.findOrders().find({type: "buy", done: false}).sort({price: 'desc'}).limit(1).exec();

                req.symbol.current.ask = ask && 0;
                req.symbol.current.bid = bid && 0;

                req.user.data.push({
                    date: Date.now(),
                    value: req.user.portfolio.reduce((prev, curr) => {
                        return prev + (curr.amount * curr.avgPrice);
                    }, 0) + req.user.cash
                });

                let toNoti = await Subscription.find({
                    $and: [
                        {active: true},
                        {symbol: req.symbol.symbol},
                        {$or: [
                            {min: {$gte: req.symbol.price}},
                            {max: {$lte: req.symbol.price}}
                        ]}
                    ]
                }).exec();

                toNoti = toNoti.map(doc => new Notification({
                    type: "sub",
                    user: doc.creator,
                    subscription: doc._id,
                }).save());

                await Promise.all([
                    order.save(),
                    req.symbol.save(),
                    req.user.save(),
                    ...toNoti,        
                ]);
                res.sendStatus(200);
            });
        }
        
    } else if (type === "sell") {
        const portStock = req.user.portfolio.some(val => val.stock.equals(req.symbol._id));
        if (!portStock || portStock.amount < amount) {
            res.status(403).send("Not enough stock owned");
        } else {
            // get buy orders at or above the price of sell order
            req.symbol.findOrders()
                .find({type: "buy", price: {$gte: price}, done: false})
                    .sort({price: 'desc'})
                        .exec(async (err, docs) => {
                let index = 0;
                while (amount > 0 && index < docs.length) {
                    const currDoc = docs[index]; // current buy order
                    const remaining = currDoc.amount - currDoc.fulfilled; // amount remaining to fulfill in the buy order
                    const buyer = await User.findById(currDoc.creator); // buyer account
                    const prevAmount = amount;
                    if (amount >= remaining) { // amount to left in sell order is more than remaining about in buy order
                        // complete the buy order
                        currDoc.fulfilled = currDoc.amount;
                        currDoc.done = true;

                        amount -= remaining;
                        index++;
                    } else { // more left in buy order than sell order amount
                        currDoc.fulfilled += amount;
                        amount = 0;
                        order.done = true;
                    }
        
                    const amountDiff = (prevAmount - amount);
        
                    req.user.cash += (amountDiff) * currDoc.price; // give seller cash
                    
                    let newPort = [];

                    for (const val in req.user.portfolio) {
                        if (val.stock.equals(req.symbol._id)) {
                            const newAmt = val.amount - amountDiff;
                            if (newAmt > 0) {
                                const sum = (val.amount * val.avgPrice) - (amountDiff * currDoc.price)
                                newPort.push({
                                    ...val.toJSON(), 
                                    amount: val.amount - order.amount,  
                                    avgPrice: sum / newAmt
                                });
                            }
                        } else {
                            newPort.push(val.toJSON());
                        }
                    }

                    req.user.portfolio = newPort;
        
                    const i = buyer.portfolio.findIndex(val => val.stock.equals(req.symbol._id));
                    if (i === -1) {
                        buyer.portfolio.push({amount: order.amount, avgPrice: currDoc.price, stock: req.symbol._id});
                    } else {
                        let sum = buyer.portfolio[i].avgPrice * buyer.portfolio[i].amount;
                        sum += currDoc.price * amountDiff;
                        buyer.portfolio[i].avgPrice = sum / (buyer.portfolio[i].amount + amountDiff);
                        buyer.portfolio[i].amount += amountDiff;
                    }
                    buyer.cash -= (amountDiff) * currDoc.price;

                    buyer.data.push({
                        date: Date.now(),
                        value: buyer.portfolio.reduce((prev, curr) => {
                            return prev + (curr.amount * curr.avgPrice);
                        }, 0) + buyer.cash
                    });
                    
                    req.symbol.price = currDoc.price;
                    req.symbol.daily.high = Math.max(currDoc.price, req.symbol.daily.high);
                    req.symbol.daily.low = Math.min(currDoc.price, req.symbol.daily.low)
                    req.symbol.daily.trades += 1;
                    req.symbol.trades.push({price: currDoc.price});

                    const noti = new Notification({
                        type: "trade",
                        user: buyer._id,
                        trade: {
                            amount: amountDiff,
                            price: currDoc.price,
                            order: currDoc._id,
                        }
                    });

                    await Promise.all([
                        currDoc.save(), 
                        buyer.save(),
                        noti.save(),      
                    ]);
                }
                order.fulfilled = order.amount - amount;

                const ask = await req.symbol.findOrders().find({type: "sell", done: false}).sort({price: 'asc'}).limit(1).exec();
                const bid = await req.symbol.findOrders().find({type: "buy", done: false}).sort({price: 'desc'}).limit(1).exec();

                req.symbol.current.ask = ask && 0;
                req.symbol.current.bid = bid && 0;

                req.user.data.push({
                    date: Date.now(),
                    value: req.user.portfolio.reduce((prev, curr) => {
                        return prev + (curr.amount * curr.avgPrice);
                    }, 0) + req.user.cash
                });

                let toNoti = await Subscription.find({
                    $and: [
                        {active: true},
                        {symbol: req.symbol.symbol},
                        {$or: [
                            {min: {$gte: req.symbol.price}},
                            {max: {$lte: req.symbol.price}}
                        ]}
                    ]
                }).exec();

                toNoti = toNoti.map(doc => new Notification({
                    type: "sub",
                    user: doc.creator,
                    subscription: doc._id,
                }).save());

                const result = await Promise.all([
                    order.save(),
                    req.symbol.save(),
                    req.user.save(),
                    ...toNoti,
                ]);

                if (order.fulfilled > 0) {
                    await new Notification({
                        type: "trade",
                        user: req.user._id,
                        trade: {
                            amount: order.fulfilled,
                            price: order.price,
                            order: result[0]._id
                        }
                    }).save();
                }
                
                res.sendStatus(200);
            });
        }
        
    } else {
        res.status(400).send("Improper order type");
    }
});

module.exports = router;