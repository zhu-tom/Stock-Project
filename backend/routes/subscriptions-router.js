const express = require('express');
const Stock = require('../models/StockModel');
const Subscription = require('../models/SubscriptionModel');

const subscriptionsRouter = express.Router();

const sendSubs = (req, res) => {
    req.user.findSubscriptions((err, docs) => {
        if (err) {
            res.status(500).send("Failed to query");
        } else {
            res.status(200).send(docs);
        }
    });
}

subscriptionsRouter.get("/", sendSubs);

subscriptionsRouter.param("id", (req, res, next) => {
    req.user.findSubscriptions().findOne({_id: req.params.id}).exec((err, doc) => {
        if (err) {
            res.status(500).send("Failed to query")
        } else if (doc) {
            req.sub = doc;
            next();
        } else {
            res.status(404).send("Subscription not found")
        }
    });
});

subscriptionsRouter.get("/:id", (req, res) => {
    res.status(200).send(req.sub);
})

subscriptionsRouter.post("/:id/active", (req, res) => {
    req.sub.active = !req.sub.active;
    req.sub.save((err, doc) => {
        if (err) {
            res.status(500).send("Failed to update");
        } else {
            res.status(200).send(doc);
        }
    });
});

subscriptionsRouter.delete("/:id", (req, res, next) => {
    Subscription.findByIdAndDelete(req.sub._id, (err) => {
        if (err) {
            res.status(500).send("Failed to delete");
        } else {
            next();
        }
    });
}, sendSubs);

subscriptionsRouter.put("/:id", (req, res) => {
    const prevPrice = req.sub.max / (1 + req.body.event);
    req.sub.event = req.body.event;
    req.sub.min = prevPrice * (1 - req.body.event); 
    req.sub.max = prevPrice * (1 + req.body.event); 

    req.sub.save((err, doc) => {
        if (err) {
            res.status(500).send("Failed to save");
        } else {
            res.status(200).send(doc);
        }
    });
});

subscriptionsRouter.post("/", (req, res) => {
    const {symbol, event} = req.body;
    if (symbol && event) {
        Stock.findOne({symbol}, (e, d) => {
            if (e) {
                console.log(e);
                res.status(500).send("Failed to query");
            } else if (d) {
                new Subscription({
                    creator: req.user._id,
                    symbol: d.symbol,
                    event: req.body.event,
                    min: d.price * (1 - (req.body.event / 100)),
                    max: d.price * (1 + (req.body.event / 100))
                }).save((err, doc) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send("Failed to save");
                    } else {
                        res.status(200).send(doc);
                    }
                });
            } else {
                res.status(404).send("Stock not found");
            }
        });
    } else {
        res.status(400).send("Missing body fields in request");
    }
});

module.exports = subscriptionsRouter;