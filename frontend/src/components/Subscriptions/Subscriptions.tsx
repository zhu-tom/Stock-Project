import * as React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { SubscriptionType } from '../../types/StockTypes';
import Breadcrumb from '../Dashboard/Breadcrumb/Breadcrumb';
import Edit from './Edit/Edit';
import Home from './Home/Home';
import Axios from 'axios';
import _ from 'lodash';

const Subscriptions = () => {
    const { path } = useRouteMatch();
    const [subscriptions, setSubscriptions] = React.useState<SubscriptionType[]>([]);

    React.useEffect(() => {
        Axios.get("/api/me/subscriptions").then(data => {
            setSubscriptions(data.data);
        }).catch(err => {
            console.log(err);
        });
    }, []);

    const handleToggle = _.throttle((i: number, id: number | string) => {
        setSubscriptions(subscriptions.map((val, index) => {
            Axios.post(`/api/me/subscriptions/${id}/active`).then((data) => {
                console.log(data);
            });
            if (index === i) {
                return ({
                    ...val,
                    active: !val.active,
                });
            } else {
                return val;
            }
        }));
    }, 500);

    return (
        <>
            <Breadcrumb/>
            <Switch>
                <Route exact path={`${path}/edit/:id`}>
                    <Edit subscriptions={subscriptions} setSubscriptions={setSubscriptions}/>
                </Route>
                <Route exact path={path}>
                    <Home handleToggle={handleToggle} subscriptions={subscriptions} setSubscriptions={setSubscriptions}/>
                </Route>
            </Switch>
        </>
    );
}

export default Subscriptions;