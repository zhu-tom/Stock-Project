const express = require('express');
const Order = require('../models/OrdersModel');
const Stock = require('../models/StockModel');
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
                    if (val._id === req.symbol._id) {
                        const newAmt = val.amount - amountDiff; // decrease the amount owned of the stock
                        if (newAmt !== 0) {
                            const sum = (val.amount * val.avgPrice) - (amountDiff * currDoc.price);
                            newPort.push({
                                ...val, 
                                amount: val.amount - order.amount,  
                                avgPrice: sum / newAmt
                            })
                        }
                    } else {
                        newPort.push(val);
                    }
                }

                seller.portfolio = newPort;
        
                const i = req.user.portfolio.findIndex(val => val._id === req.symbol._id); // buyer's stock
                if (i === -1) { // if not found, add to the portfolio
                    req.user.portfolio.push({amount: order.amount, avgPrice: currDoc.price, stock: req.symbol._id});
                } else {
                    let sum = req.user.portfolio[i].avgPrice * req.user.portfolio[i].amount; // old sum for avgPrice
                    sum += currDoc.price * amountDiff; // add newly purchased stock
                    req.user.portfolio[i].amount += amountDiff; // increment amount
                    req.user.portfolio[i].avgPrice = sum / (req.user.portfolio[i].amount); // find new average
                }
                req.user.cash -= (amountDiff) * currDoc.price;
    
                await Promise.all([
                    currDoc.save(), 
                    seller.save(),
                    req.user.save()        
                ]);
            }
            order.fulfilled = order.amount - amount;
            await order.save();
            res.sendStatus(200);
        });
    } else {
        req.symbol.findOrders().find({type: "buy", price: {$gte: price}, done: false}).sort({price: 'desc'}).exec(async (err, docs) => {
            let index = 0;
            while (amount > 0 && index < docs.length) {
                const currDoc = docs[index];
                const remaining = currDoc.amount - currDoc.fulfilled;
                const buyer = await User.findById(currDoc.creator);
                const prevAmount = amount;
                if (amount >= remaining) {
                    currDoc.fulfilled = currDoc.amount;
                    currDoc.done = true;
                    amount -= remaining;
                    index++;
                } else {
                    currDoc.fulfilled += amount;
                    amount = 0;
                    order.done = true;
                }
    
                const amountDiff = (prevAmount - amount);
    
                req.user.cash += (amountDiff) * currDoc.price;
                req.user.portfolio = req.user.portfolio.map(val => {
                    const newAmt = val.amount - amountDiff;
                    const sum = (val.amount * val.avgPrice) - (amountDiff * currDoc.price)
                    return val._id === req.symbol._id ? 
                        {
                            ...val, 
                            amount: val.amount - order.amount,  
                            avgPrice: sum / newAmt
                        } : val;
                });
                req.user.portfolio.pull({amount: {$lte: 0}});
    
                const i = buyer.portfolio.findIndex(val => val._id === req.symbol._id);
                if (i === -1) {
                    buyer.portfolio.push({amount: order.amount, avgPrice: currDoc.price, stock: req.symbol._id});
                } else {
                    let sum = buyer.portfolio[i].avgPrice * buyer.portfolio[i].amount;
                    sum += currDoc.price * amountDiff;
                    buyer.portfolio[i].avgPrice = sum / (buyer.portfolio[i].amount + amountDiff);
                    buyer.portfolio[i].amount += amountDiff;
                }
                buyer.cash -= (amountDiff) * currDoc.price;
    
                await Promise.all([
                    currDoc.save(), 
                    req.user.save(),
                    buyer.save()        
                ]);
            }
            order.fulfilled = order.amount - amount;
            await order.save();
            res.sendStatus(200);
        });
    }
});

module.exports = router;