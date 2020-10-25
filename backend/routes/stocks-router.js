const express = require('express');

const router = express.Router();

let data = require('../stock_data.json');
let users = require('../stock_users.json');

const { route } = require('./user-router');

const marketQueryParser = (req, res, next) => {
    if (!req.query.q) {
        req.query.q = "*";
    }
    if (!req.query.limit) {
        req.query.limit = 10;
    }
    next();
}

router.get("/", marketQueryParser, (req, res) => {
    let result = data.filter(val => val.name.toLowerCase().includes(req.query.q.toLowerCase()) || val.symbol.includes(req.query.q.toUpperCase()));
    console.log(result);
    res.send(result.slice(0, req.query.limit));
});

router.get("/market/:market", (req, res) => {

});

router.param("symbol", (req, res, next) => {
    const result = data.find(val => val.symbol === req.params.symbol);
    if (result) {
        req.symbol = result;
        next();
    } else {
        res.sendStatus(404);
    }
});

const tradeRouter = express.Router();

router.use("/symbol/:symbol", tradeRouter);

tradeRouter.get("/", (req, res) => {
    res.send(req.symbol);
});

const tradeBodyParser = (req, res, next) => {
    if (req.body.symbol && req.body.amount && req.body.price) {
        next();
    } else {
        res.status(400).send("Bad Request Body");
    }
}

const addOrder = (type, {symbol, amount, price, id}, stock) => {
    stock.orders = [...stock.orders, ]
}

const closeOrder = (order, stock) => {
    const u = users.find(user => user.username === order.username);
    const index = u.orders.findIndex(ord => ord.id == order.id);
    u.history.push(u.orders.splice(index, 1));

    stock.history.push({date: new Date().toISOString().valueOf(), value: order.price});
}

const decreaseOrder = (order, stock) => {
    const u = users.find(user => user.username === order.username);
    u.orders.find(ord => ord.id == order.id).fulfilled += order.amount;

    stock.history.push({date: new Date().toISOString().valueOf(), value: order.price});
}

tradeRouter.post("/buy", tradeBodyParser, (req, res) => {
    let {amount, price} = req.body;
    if (req.symbol.orders) {
        while (amount > 0) {
            const foundOrder = req.symbol.orders.find(order => {
                return (type === 'sell') && order.price <= price;
            });
            if (!foundOrder) break;
            if (foundOrder.amount <= amount) {
                amount -= foundOrder.amount;
                closeOrder(foundOrder, req.symbol);
            } else {
                foundOrder.amount -= amount;
                decreaseOrder({amount, price}, req.symbol);
                break;
            }
        }
    }
    addOrder("buy", req.body, req.symbol);
});

tradeRouter.post("/sell", tradeBodyParser, (req, res) => {
    addOrder("sell", req.body, req.symbol);
});

module.exports = router;