import { Layout, Menu, Space } from 'antd';
import * as React from 'react';
import { BankFilled, BellOutlined, BookOutlined, CompassOutlined, EyeOutlined, FundProjectionScreenOutlined, HistoryOutlined, ReadOutlined, ShopOutlined, TagsOutlined } from "@ant-design/icons";

import './Sider.css';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

type Props = {
    collapsed: boolean;
    setCollapsed: Function;
}

type State = {
    collapsedWidth: number;
}

type MenuItem = {
    location: string,
    icon: React.ReactNode,
    title: string,
    children?: MenuItem[]
}

const menuItems: MenuItem[] = [
    {
        location: '/',
        icon: <CompassOutlined/>,
        title: 'Home', 
    },
    {
        location: '/account',
        icon: <BookOutlined/>,
        title: 'Account',
        children: [
            {
                location: '/account/portfolio',
                icon: <FundProjectionScreenOutlined/>,
                title: 'Portfolio'
            }, 
            {
                location: '/account/watchlist',
                icon: <EyeOutlined/>,
                title: 'Watchlist',
            },
            {
                location: '/account/subscriptions',
                icon: <BellOutlined/>,
                title: 'Subscriptions'
            },
            {
                location: '/account/orders',
                icon: <TagsOutlined/>,
                title: 'Orders',
            },
            {
                location: '/account/history',
                icon: <HistoryOutlined/>,
                title: 'History'
            }
        ]
    },
    {
        location: '/market',
        icon: <ShopOutlined/>,
        title: 'Market'
    },
    {
        location: '/news',
        icon: <ReadOutlined/>,
        title: 'News'
    }
];

class Sider extends React.Component<RouteComponentProps<{}> & Props, State> {
    static defaultProps: Props = {
        collapsed: false,
        setCollapsed: () => {},
    }

    state: State = {
        collapsedWidth: 80,
    }

    onBreakpoint = (broken: boolean) => this.setState({collapsedWidth: broken ? 0:80});
    onCollapse = (collapsed: boolean) => this.props.setCollapsed(collapsed);
    createItem = ({icon, title, location}: MenuItem) => <Menu.Item icon={icon} key={location}><Link to={location}>{title}</Link></Menu.Item>;

    render() {
        return (
                <Layout.Sider 
                    breakpoint="md" 
                    collapsedWidth={this.state.collapsedWidth} 
                    onBreakpoint={this.onBreakpoint} 
                    collapsible 
                    onCollapse={this.onCollapse}
                    collapsed={this.props.collapsed} 
                    style={{
                        overflowY: 'auto',
                        height: '100vh',
                        position: 'sticky',
                        top: 0,
                        left: 0,
                    }}>
                    <Space align="center" className="logo">
                        <BankFilled/>{!this.props.collapsed && <span>{'Bank Street Bets'}</span>}
                    </Space>
                    <Menu style={{padding: 0}} selectedKeys={[this.props.location.pathname]} defaultOpenKeys={["/account"]} theme="dark" mode="inline">
                        {menuItems.map((item) => {
                            return item.children ? (
                                <Menu.SubMenu key={item.location} icon={item.icon} title={item.title}>
                                    {item.children.map(this.createItem)}
                                </Menu.SubMenu>
                            ) : (
                                this.createItem(item)
                            );
                        })}
                    </Menu>
                </Layout.Sider>            
        );
    }
}

export default withRouter(Sider);