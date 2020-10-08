import * as React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { SubscriptionType } from '../../types/StockTypes';
import Breadcrumb from '../Dashboard/Breadcrumb/Breadcrumb';
import Edit from './Edit/Edit';
import Home from './Home/Home';

const data: SubscriptionType[] = [
    {
        id: 1234,
        name: "Microsoft",
        symbol: "MSFT",
        minChange: 5,
        active: true,
    },
    {
        id: 2324,
        name: "Apple",
        symbol: "APPL",
        minChange: 14,
        active: false,
    },
    {
        id: 2391,
        name: "Waste Management",
        symbol: "WMT",
        minChange: 10,
        active: true,
    }
];

const Subscriptions = () => {
    const { path } = useRouteMatch();
    const [subscriptions, setSubscriptions] = React.useState(data);

    const handleToggle = (i: number) => {
        setSubscriptions(data.map((val, index) => {
            if (index === i) {
                return ({
                    ...val,
                    active: !val.active,
                });
            } else {
                return val;
            }
        }))
    }

    return (
        <>
            <Breadcrumb/>
            <Switch>
                <Route exact path={`${path}/edit/:id`}>
                    <Edit subscriptions={subscriptions}/>
                </Route>
                <Route exact path={path}>
                    <Home handleToggle={handleToggle} subscriptions={subscriptions}/>
                </Route>
            </Switch>
        </>
    );
}

export default Subscriptions;