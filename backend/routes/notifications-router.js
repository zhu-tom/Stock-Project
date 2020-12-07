const express = require("express");
const Notification = require("../models/NotificationModel");
const Order = require("../models/OrdersModel");

const notificationsRouter = express.Router();

const queryParser = (req, _, next) => {
    if (req.query.unreadOnly) {
        req.query.unreadOnly = true;
    }
    next();
}

notificationsRouter.get("/", queryParser, (req, res) => {
    const query = {
        user: req.user._id,
    }
    if (req.query.unreadOnly) {
        query.read = false;
    }
    Notification.find(query).populate("subscription")        
        .exec((err, docs) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error querying db");
        } else {
            Promise.all(docs.map(async doc => {
                doc.trade.order = await Order.findById(doc.trade.order);
                return doc;
            })).then(val => {
                console.log(val);
                res.status(200).send(val);
            })
        }
    });
});

notificationsRouter.put("/:id", (req, res) => {
    req.notification.read = true;
    req.notification.save((err) => {
        if (err) {
            res.status(500).send("Error updating db");
        } else {
            res.sendStatus(200);
        }
    });
});

notificationsRouter.delete("/:id", (req, res) => {
    req.notification.deleteOne((err) => {
        if (err) {
            res.status(500).send("Error deleting from db");
        } else {
            res.sendStatus(200);
        }
    });
})

notificationsRouter.param("id", (req, res, next) => {
    Notification.findById(req.params.id, (err, doc) => {
        if (err) {
            res.status(500).send("Error querying db");
        } else if (doc) {
            req.notification = doc;
            next();
        } else {
            res.status(404).send("Notification not found");
        }
    });
});

module.exports = notificationsRouter;