const express = require("express");
const Watchlist = require("../models/WatchlistModel");

const watchlistRouter = express.Router();

const getWatchlists = (req, res) => {
    req.user.findWatchlists((err, docs) => {
        if (err) {
            res.status(500).send("Failed to query");
        } else {
            Promise.all(docs.map(doc => {
                return doc.execPopulate("stocks");
            })).then(results => {
                res.status(200).send(results); 
            }).catch(() => {
                res.status(500).send("Failed to query");
            });
        }
    });
}

watchlistRouter.get("/", getWatchlists);

watchlistRouter.param("id", (req, res, next) => {
    req.user.findWatchlists().findOne({_id: req.params.id}).exec((err, doc) => {
        if (err) {
            res.status(500).send("Failed to query");
        } else if (doc) {
            req.watchlist = doc;
            next();
        } else {
            res.status(404).send("Watchlist Not Found");
        }
    });
});

watchlistRouter.delete("/:id/symbol/:symbol", (req, res, next) => {
    req.watchlist.stocks.pull(req.params.symbol);
    req.watchlist.save((err, doc) => {
        console.log(doc);
        if (err) {
            res.status(500).send("Failed to save");
        } else {
            next();
        }
    });
}, getWatchlists);

watchlistRouter.delete("/:id", (req, res, next) => {
    Watchlist.findOneAndDelete({_id: req.watchlist._id}, (err, doc) => {
        if (err) {
            res.status(500).send("Failed to delete");
        } else {
            next();
        }
    });
}, getWatchlists);

watchlistRouter.post("/", (req, res, next) => {
    if (req.body.name) {
        new Watchlist({
            name: req.body.name,
            creator: req.user._id,
        }).save((err) => {
            if (err) {
                res.status(500).send("Failed to save");
            } else {
                next();
            }
        });
    } else {
        res.status(400).send("Invalid Post Body: Requires 'name'");
    }
}, getWatchlists);

watchlistRouter.put("/", (req, res) => {
    const { lists, id } = req.body;
    if (lists && id) {
        req.user.findWatchlists().where("_id").in(lists).exec((err, docs) => {
            if (err) {
                res.status(500).send("Failed to query");
            } else {
                Promise.all(docs.map(doc => {
                    const index = doc.stocks.find(val => val === id);
                    if (index) {
                        doc.stocks.pull(id);
                    } else {
                        doc.stocks.push(id);
                    }
                    return doc.save();
                })).then(() => {
                    res.sendStatus(200);
                }).catch((e) => {
                    res.status(500).send("Failed to add");
                });
            }
        });
    } else {
        res.status(400).send("Missing body");
    }
});

module.exports = watchlistRouter;