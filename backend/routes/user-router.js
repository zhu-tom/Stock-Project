const express = require('express');
const Order = require('../models/OrdersModel');
const Stock = require('../models/StockModel');
const User = require('../models/UserModel');
const subscriptionsRouter = require('./subscriptions-router');
const watchlistRouter = require('./watchlist-router');

const router = express.Router();
const uidRouter = express.Router();

router.use("/:uid", uidRouter);

uidRouter.get("/", (req, res) => {
    res.send(req.user);
});

const cashBodyParser = (req, res, next) => {
    const { amount } = req.body;
    if (amount) {
        next();
    } else {
        res.status(400).send("Bad Request: No Amount Field");
    }
}

uidRouter.post("/withdraw", cashBodyParser, (req, res) => {
    req.user.cash -= req.body.amount;
    const updateCash = req.user.save();
    const addToOrder = new Order({
        type: "withdraw",
        amount: req.body.amount,
        done: true,
        creator: req.user._id,
    }).save();

    Promise.all([updateCash, addToOrder]).then(docs => {
        res.status(200).send({cash: docs[0].cash});
    }).catch(() => {
        res.status(500).send("Failed to save to db")
    });
});

uidRouter.post("/deposit", cashBodyParser, (req, res) => {
    req.user.cash += req.body.amount;
    const updateCash = req.user.save();
    const addToOrder = new Order({
        type: "deposit",
        amount: req.body.amount,
        done: true,
        creator: req.user._id,
    }).save();

    Promise.all([updateCash, addToOrder]).then(docs => {
        res.status(200).send({cash: docs[0].cash});
    }).catch(() => {
        res.status(500).send("Failed to save to db")
    });
});

uidRouter.get("/portfolio", (req, res) => {
    const { portfolio } = req.user;

    if (req.query.stock) {
        Stock.findOne({symbol: req.query.stock}, (err, doc) => {
            if (err) {
                res.status(500).send("Failed to query db");
            }
            const result = portfolio.find(el => {
                return el.stock.equals(doc._id)
            });
            if (result) {
                res.send(result);
            } else {
                res.status(404).send("Stock Not Found.");
            }
        });
    } else {
        req.user.populate("portfolio.stock", (err, docs) => {
            if (err) {
                res.status(500).send("Failed to populate");
            } else {
                const {portfolio: p, data, cash} = docs;
                res.status(200).send({portfolio: p, data, cash});
            }
        });
    }
});

uidRouter.use("/watchlists", watchlistRouter);

uidRouter.use("/subscriptions", subscriptionsRouter)

uidRouter.get("/history", (req, res) => {
    req.user.findHistory((err, docs) => {
        if (err) {
            res.status(500).send("Failed to query");
        } else {
            res.status(200).send(docs);
        }
    });
});

uidRouter.get("/orders", (req, res) => {
    req.user.findOrders((err, docs) => {
        if (err) {
            res.status(500).send("Failed to query");
        } else {
            console.log(docs);
            res.status(200).send(docs);
        }
    });
})

uidRouter.get("/", (req, res) => {
    const { username, name, avatar } = req.user;
    res.send({
        username,
        name,
        avatar,
    });
})

router.param("uid", (req, res, next) => {
    User.findOne({username: req.params.uid}, (err, doc) => {
        if (err) {
            res.status(500).send("Failed to query");
        } else if (doc) {
            req.user = doc;
            next();
        } else {
            res.status(404).send("User not found.");
        }
    });
});

module.exports = {router, uidRouter};