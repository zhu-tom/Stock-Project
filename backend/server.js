require('dotenv').config();

const path = require("path");
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI(process.env.API_KEY);
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: process.env.MONGO_URI || 'mongodb://localhost/stockbroker',
    collection: 'sessions'
});
const express = require("express");
const stocksRouter = require('./routes/stocks-router');
const {router: userRouter} = require('./routes/user-router');
const meRouter = require('./routes/me-router');
const authRouter = require('./routes/auth-router');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'secret',
}));
app.use(express.static(path.join(__dirname, "../frontend/build")));
 
const apiRouter = express.Router();

apiRouter.get('/ping', (req, res) => {
    req.session.loggedin = true;
    req.session.username = 'admin';
    req.session.type = 'admin';
    res.send(JSON.stringify({message: req.session.loggedin}));
});

apiRouter.use("/stocks", stocksRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/me", meRouter);
apiRouter.get("/news", (req, res) => {
    let { page, pageSize } = req.query;
    if (!page) page = 1;
    if (!pageSize) pageSize = 20;
    newsapi.v2.topHeadlines({
        category: "business",
        language: "en",
        country: 'us',
        page,
        pageSize
    }).then(val => {
        res.status(200).send(val);
    }).catch(err => {
        res.status(500).send("Failed to get news from API");
    });
});

app.use('/api', apiRouter);

app.use('/auth', authRouter);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "build/index.html"));
});

const uri = process.env.MONGO_URI || 'mongodb://localhost/stockbroker';

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once("open", () => {
    console.log("Connected to mongodb");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("listening on port " + PORT);
});