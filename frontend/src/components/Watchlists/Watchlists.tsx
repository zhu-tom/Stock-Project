import * as React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Breadcrumb from '../Dashboard/Breadcrumb/Breadcrumb';
import Home from './Home/Home';
import { WatchlistType } from "../../types/StockTypes";
import Watchlist from './Watchlist/Watchlist';
import Axios from 'axios';

const Watchlists = () => {
    const { path } = useRouteMatch();
    const [ watchlists, setWatchlists ] = React.useState<WatchlistType[] | undefined>(undefined);

    React.useEffect(() => {
        Axios.get("/api/users/bbard1/watchlists").then(res => {
            setWatchlists(res.data);
        });
    }, []);
    
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