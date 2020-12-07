const express = require('express');
const Order = require('../models/OrdersModel');
const Stock = require('../models/StockModel');
const User = require('../models/UserModel');
const notificationsRouter = require('./notifications-router');
const subscriptionsRouter = require('./subscriptions-router');
const watchlistRouter = require('./watchlist-router');
const bcrypt = require('bcrypt');

const router = express.Router();
const uidRouter = express.Router();

router.use("/:uid", uidRouter);

uidRouter.get("/", (req, res) => {
    res.send(req.user);
});

const cashBodyParser = (req, res, next) => {
    const { amount, password } = req.body;
    if (amount && password) {
        bcrypt.compare(password, req.user.password, (err, same) => {
            if (err) {
                res.status(500).send("Failed to compare passwords");
            } else if (same) {
                next();
            } else {
                res.status(401).send("Wrong password");
            }
        });

    } else {
        res.status(400).send("Bad Request: missing fields");
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

uidRouter.use("/notifications", notificationsRouter);

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

const sendOrders = (req, res) => {
    req.user.findOrders((err, docs) => {
        if (err) {
            res.status(500).send("Failed to query");
        } else {
            res.status(200).send(docs);
        }
    });
};

uidRouter.get("/orders", sendOrders);

uidRouter.put("/orders/:orderId", (req, res, next) => {
    req.order.done = true;
    req.order.save(err => {
        if (err) {
            res.status(500).send("Error updating db");
        } else {
            next()
        }
    });
}, sendOrders);

uidRouter.param("orderId", (req, res, next) => {
    Order.findById(req.params.orderId, (err, doc) => {
        if (err) {
            res.status(500).send("Error querying db");
        } else if (doc) {
            req.order = doc;
            next();
        } else {
            res.status(404).send("Order not found");
        }
    });
});

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