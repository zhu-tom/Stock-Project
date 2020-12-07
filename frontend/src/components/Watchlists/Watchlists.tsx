import * as React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Breadcrumb from '../Dashboard/Breadcrumb/Breadcrumb';
import Home from './Home/Home';
import { WatchlistType } from "../../types/StockTypes";
import Watchlist from './Watchlist/Watchlist';
import Axios from 'axios';
import { notification } from 'antd';

const Watchlists = () => {
    const { path } = useRouteMatch();
    const [ watchlists, setWatchlists ] = React.useState<WatchlistType[] | undefined>(undefined);

    const getData = React.useCallback(() => {
        Axios.get("/api/me/watchlists").then(res => {
            console.log(res.data);
            setWatchlists(res.data);
        }).catch(err => {
            notification.open({
                message: "Error",
                description: err.response.data
            });
        });
    }, []);

    React.useEffect(() => {
        getData();
        setInterval(() => {
            getData();
        }, 1000 * 60);
    }, [getData]);
    
    return (
        <>
            <Switch>
                <Route exact path={`${path}/:id`}>
                    <Watchlist watchlists={watchlists} setWatchlists={setWatchlists}/>
                </Route>
                <Route exact path={path}>
                    <Breadcrumb/>
                    <Home watchlists={watchlists} setWatchlists={setWatchlists}/>
                </Route>
            </Switch>
        </>
    );
};

export default Watchlists;