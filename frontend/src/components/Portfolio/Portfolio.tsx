import * as React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Breadcrumb from '../Dashboard/Breadcrumb/Breadcrumb'
import Transfer from './Transfer/Transfer';
import Home from './Home/Home';

const Portfolio = () => {
    const { path } = useRouteMatch();

    return (
        <>
            <Breadcrumb/>
            <Switch>
                <Route exact path={`${path}/deposit`}>
                    <Transfer type="deposit"/>
                </Route>
                <Route exact path={`${path}/withdraw`}>
                    <Transfer type="withdraw"/>
                </Route>
                <Route exact path={path}>
                    <Home/>
                </Route>
            </Switch>
        </>
    );
}

export default Portfolio;