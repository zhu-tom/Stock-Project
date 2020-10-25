const { default: axios } = require('axios');
const express = require('express');

const router = express.Router();
const uidRouter = express.Router();

const users = require('../stock_users.json').map(user => {
    return user;
});

const stocks = require('../stock_data.json').map(stock => {
    stock.history.push(
        {
            date: new Date().toISOString(),
            value: stock.price,
        }
    );
    return stock;
});

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
    res.send({cash: req.user.cash});
});

uidRouter.post("/deposit", cashBodyParser, (req, res) => {
    req.user.cash += req.body.amount;
    res.send({cash: req.user.cash});
});

uidRouter.get("/portfolio", (req, res) => {
    const { portfolio } = req.user;

    if (req.query.stock) {
        const result = portfolio.find(el => el.symbol === req.query.stock);
        if (result) {
            res.send(result);
        } else {
            res.status(404).send("Stock Not Found.");
        }
    } else {
        res.send({
            ...req.user,
            portfolio: portfolio.map(el => {
                const { name, price, symbol } = stocks.find(stock => stock.symbol === el.symbol) || stocks[Math.round(Math.random() * (stocks.length - 1))]
                return {
                    ...el,
                    name,
                    price,
                    symbol,
                };
            }),
        });
    }
});

const watchlistRouter = express.Router();

uidRouter.use("/watchlists", watchlistRouter);

watchlistRouter.get("/", (req, res) => {
    let { watchlists } = req.user;

    watchlists = watchlists.map(list => {
        return {
            ...list,
            stocks: list.stocks.map(symbol => 
                stocks.find(el => symbol === el.symbol) || stocks[Math.round(Math.random() * (stocks.length - 1))]
            ),
            }
    });

    res.send(watchlists);
});

watchlistRouter.param("id", (req, res, next) => {
    req.index = req.user.watchlists.findIndex(list => {
        return (list.id === parseInt(req.params.id));
    });
    if (req.index !== -1) {
        req.watchlist = req.user.watchlists[req.index];
        next();
    } else {
        res.status(404).send("Watchlist Not Found");
    }
});

watchlistRouter.delete("/:id/symbol/:symbol", (req, res) => {
    const newList = req.user.watchlists[req.index].stocks.filter(item => item.symbol !== req.params.symbol);
    req.user.watchlists[req.index].stocks = newList.map(symbol => 
        stocks.find(el => symbol === el.symbol) || stocks[Math.round(Math.random() * (stocks.length - 1))]
    );
    res.send(req.user.watchlists);
});

watchlistRouter.delete("/:id", (req, res) => {
    const spliced = req.user.watchlists.splice(index, 1);
    res.send(spliced);
});

watchlistRouter.post("/", (req, res) => {
    if (req.body.name) {
        const newList = {
            id: req.user.watchlists[req.user.watchlists.length - 1].id + 1,
            name: req.body.name,
            stocks: [],
        }
        req.user.watchlists.push(newList);
        res.send(newList);
    } else {
        res.status(400).send("Invalid Post Body: Requires 'name'");
    }
});

watchlistRouter.post("/addStock", (req, res) => {
    let { lists, symbol } = req.body;
    if (lists && symbol) {
        lists = lists.map(str => parseInt(str));

        req.user.watchlists.forEach(list => {
            if (lists.includes(list.id)) {
                
                if (!list.stocks.find(item => item.symbol === symbol)) {
                    list.stocks.push(symbol);
                }
            } else {
                list.stocks = list.stocks.filter(item => item.symbol !== symbol);
            }
        });
        res.sendStatus(200);
    } else {
        res.status(400).send("Missing body");
    }
});

const subscriptionsRouter = express.Router();
uidRouter.use("/subscriptions", subscriptionsRouter)

subscriptionsRouter.get("/", (req, res) => {    
    req.user.subscriptions = req.user.subscriptions.map(sub => {
        const {symbol, name} = stocks.find(el => el.symbol === sub.symbol) || stocks[Math.round(Math.random() * (stocks.length - 1))]
        return {
            ...sub,
            symbol,
            name,
        }
    });
    const { subscriptions } = req.user;

    res.send(subscriptions);
});

subscriptionsRouter.param("id", (req, res, next) => {
    const id = parseInt(req.params.id);
    req.index = req.user.subscriptions.findIndex(sub => sub.id === id);
    req.sub = req.user.subscriptions[req.index];
    if (req.index !== -1) {
        next();
    } else {
        res.status(400).send("Bad Request: Invalid Parameters/Body");
    }
});

subscriptionsRouter.post("/:id/toggle", (req, res) => {
    console.log(req.sub);
    req.sub.active = !req.sub.active;
    res.send(req.sub);
});

subscriptionsRouter.delete("/:id", (req, res) => {
    const spliced = req.user.subscriptions.splice(req.index, 1);
    res.send(spliced);
})

subscriptionsRouter.post("/:id", (req, res) => {
    req.sub.event = req.body.event;
    res.send(req.sub);
});

subscriptionsRouter.post("/add", (req, res) => {
    if (req.body.symbol) {
        const stock = stocks.find(stock => stock.symbol == req.body.symbol);
        if (stock) {
            const newItem = {
                symbol: stock.symbol,
                id: req.user.subscriptions[req.user.subscriptions.length - 1].id + 1,
                active: true,
                event: req.body.event,
            };
            req.user.subscriptions.push(newItem);
            res.send(newItem);
        } else {
            res.status(404).send("Symbol not found");
        }
    } else {
        res.status(400).send("No ID key on body.");
    }
});

uidRouter.get("/history", (req, res) => {
    const { history } = req.user;
    res.send(history);

});

uidRouter.get("/orders", (req, res) => {
    const { orders } = req.user;
    res.send(orders);
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
    const user = users.find(el => el.username === req.params.uid);
    if (user) {
        req.user = user;
        next();
    } else {
        res.status(404).send("User not found.");
    }
});

router.post("/login", (req, res) => {
    
});

module.exports = router;