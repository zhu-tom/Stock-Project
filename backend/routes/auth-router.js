const express = require('express');
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const e = require('express');

const router = express.Router();

const ROUNDS = 10;

const authBodyParser = (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).send("Missing fields in request body");
    } else {
        next();
    }
}

router.post("/signup", authBodyParser, (req, res) => {
    const { username, password } = req.body;

    User.findOne({username}, (err, result) => {
        if (err) {
            res.status(500).send("Error querying user collection");
        } else if (result) {
            res.status(403).send("Username taken");
        } else {
            bcrypt.hash(password, ROUNDS, (err, pass) => {
                if (err) {
                    res.status(500).send("Password could not be hashed");
                } else {
                    new User({
                        username,
                        password: pass,
                        data: [{datetime: Date.now(), value: 0}]
                    }).save((err, doc) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send("Failed to save to database");
                        } else {
                            req.session.loggedin = true;
                            req.session.username = doc.username;
                            req.session.type = doc.type;
                            res.sendStatus(200);
                        }
                    });
                }
            });
        }
    });
});

router.post("/login", authBodyParser, (req, res) => {
    const { username, password } = req.body;

    User.findOne({username}, (err, doc) => {
        if (err) {
            res.status(500).send("Failed to query database");
        } else if (!doc) {
            res.status(404).send("Username not found");
        } else {
            bcrypt.compare(password, doc.password, (err, same) => {
                if (err) {
                    res.status(500).send("Failed to compare passwords");
                } else if (!same) {
                    res.status(401).send("Wrong password");
                } else {
                    req.session.loggedin = true;
                    req.session.username = doc.username;
                    req.session.type = doc.type;
                    console.log(req.session);
                    res.sendStatus(200);
                }
            });
        }
    });
});

router.post("/logout", (req, res) => {
    if (req.session.loggedin) {
        req.session.loggedin = false;
        res.status(200).send("Logged out successfully");
    } else {
        res.status(200).send("Already logged out");
    }
});

module.exports = router;