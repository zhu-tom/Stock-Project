import * as React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Breadcrumb from '../Dashboard/Breadcrumb/Breadcrumb';
import Home from './Home/Home';
import { WatchlistType } from "../../types/StockTypes";
import Watchlist from './Watchlist/Watchlist';

const watchlists: WatchlistType[] = [
    {
        id: 1,
        name: "My Watchlist",
        stocks: [
            {
                name: "Microsoft",
                symbol: "MSFT",
                price: 100,
                ask: 101,
                daily: 1023,
            },
            {
                name: "Nike",
                symbol: "NKE",
                ask: 20,
                price: 25,
                daily: 4921,
            },
            {
                name: "Goldman Sachs",
                symbol: "GS",
                ask: 53,
                price: 61,
                daily: 2245,
            }
        ]
    },
    {
        id: 2,
        name: "The Other List",
        stocks: [
            {
                name: "Nike",
                symbol: "NKE",
                ask: 20,
                price: 25,
                daily: 932,
            },
            {
                name: "Cisco",
                symbol: "CSCO",
                ask: 84,
                price: 61,
                daily: 321,
            },
            {
                name: "Apple",
                symbol: "APPL",
                ask: 400,
                price: 403,
                daily: 9324
            }
        ]
    }
];

const Watchlists = () => {
    const { path } = useRouteMatch();

    return (
        <>
            <Switch>
                <Route exact path={`${path}/:id`}>
                    <Watchlist watchlists={watchlists}/>
                </Route>
                <Route exact path={path}>
                    <Breadcrumb/>
                    <Home watchlists={watchlists}/>
                </Route>
            </Switch>
        </>
    );
};

export default Watchlists;