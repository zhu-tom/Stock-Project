import * as React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Breadcrumb from '../Dashboard/Breadcrumb/Breadcrumb';
import Home from './Home/Home';

const Subscriptions = () => {
    const { path } = useRouteMatch();

    return (
        <>
            <Breadcrumb/>
            <Switch>
                <Route exact path={`${path}/create`}>

                </Route>
                <Route exact path={path}>
                    <Home/>
                </Route>
            </Switch>
        </>
    );
}

export default Subscriptions;