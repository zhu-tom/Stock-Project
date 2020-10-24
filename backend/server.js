const path = require("path");
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/tokens',
    collection: 'sessions'
});
const express = require("express");
const stocksRouter = require('./routes/stocks-router');
const userRouter = require('./routes/user-router');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
    store
}));
app.use(express.static(path.join(__dirname, "../frontend/build")));
 
const apiRouter = express.Router();

apiRouter.get('/ping', (req, res) => {
    console.log(req.session.loggedin);
    res.send(JSON.stringify({message: req.session.loggedin}));
});

apiRouter.use("/stocks", stocksRouter);
apiRouter.use("/users", userRouter);

app.use('/api', apiRouter);

app.get("/login", (req, res) => {
    console.log(req.session.loggedin);
    req.session.loggedin = true;
    res.sendStatus(200);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "build/index.html"));
});

app.listen(8080, () => {
    console.log("listening on port 8080");
});