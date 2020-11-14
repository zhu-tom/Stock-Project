const express = require('express');
const User = require('../models/UserModel');
const router = express.Router();
const {uidRouter} = require('./user-router');

router.use("/", (req, res, next) => {
    console.log(req.session);
    if (req.session.loggedin && req.session.username) {
        User.findOne({username: req.session.username}, (err, doc) => {
            if (err) {
                res.status(500).send("Failed to query");
            } else if (!doc) {
                res.status(404).send("Current user not found");
            } else {
                req.user = doc;
                next();
            }
        });
    } else {
        req.session.loggedin = false;
        res.status(401).send("Not logged in");
    }
});

router.use("/", uidRouter);

module.exports = router;