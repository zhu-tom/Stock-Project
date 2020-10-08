import * as React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Breadcrumb from '../Dashboard/Breadcrumb/Breadcrumb';
import Stock from './Stock/Stock';

const Market = () => {
    const { path } = useRouteMatch<{path: string}>();

    return (
            <Switch>
                <Route exact path={`${path}/:symbol`}>
                    <Stock/>
                </Route>
                <Route exact path={path}>
                    <Breadcrumb/>
                </Route>
            </Switch>
    );
}

export default Market;