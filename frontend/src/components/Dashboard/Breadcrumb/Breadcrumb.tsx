import { Breadcrumb } from 'antd';
import * as React from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

type StringKeys = {
    [key: string]: string
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
    '/deposit': 'Deposit',
    '/withdraw': 'Withdraw',
    '/create': 'Create',
    '/edit': 'Edit',
}

const Crumb: React.FC<RouteComponentProps<{}> & {end?: string}> = ({location, end}) => {
    const parts = location.pathname.split(/(?=\/)/);
    console.log(parts);
    return (
        <Breadcrumb style={{marginBottom: '16px'}} separator=">">
            {parts.map((key, index) => {
                return (
                    <Breadcrumb.Item key={index}>
                        {((key === '/account' && <span>{map[key] || key.slice(1)}</span>) || (index === parts.length - 1 ? 
                        (end || map[key]) && <span>{end || map[key]}</span> : 
                        (<Link to={parts.slice(0, index + 1).join('')}>{map[key]}</Link>)))}
                    </Breadcrumb.Item>
                );
            })}
        </Breadcrumb>
    );
}

export default withRouter(Crumb);