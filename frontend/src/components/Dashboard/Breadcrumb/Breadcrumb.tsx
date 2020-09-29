import { Breadcrumb } from 'antd';
import { BreadcrumbProps } from 'antd/lib/breadcrumb';
import * as React from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

type StringKeys = {
    [key: string]: String
}

const map: StringKeys = {
    '/': 'Home',
    '/account': 'Account',
    '/portfolio': 'Portfolio',
    '/watchlist': 'Watchlist',
    '/subscriptions': 'Subscriptions',
    '/orders': 'Orders',
    '/history': 'History',
    '/market': 'Market',
    '/news': 'Newsfeed',
}

const Crumb: React.FC<RouteComponentProps<{}>> = ({location}) => {
    const parts = location.pathname.split(/(?=\/)/);
    console.log(parts);
    return (
        <Breadcrumb separator=">">
            {parts.map((key, index) => {
                return (
                    <Breadcrumb.Item>
                        {key === '/account' ? <span>{map[key]}</span> : (<Link to={parts.slice(0, index + 1).join('')}>{map[key]}</Link>)}
                    </Breadcrumb.Item>
                );
            })}
        </Breadcrumb>
    );
}

export default withRouter(Crumb);