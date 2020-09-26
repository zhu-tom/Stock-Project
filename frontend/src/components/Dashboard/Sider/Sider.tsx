import { Layout, Menu, Space } from 'antd';
import * as React from 'react';
import { BankFilled, BellOutlined, BookOutlined, CompassOutlined, EyeOutlined, FundProjectionScreenOutlined, HistoryOutlined, ReadOutlined, ShopOutlined, TagsOutlined } from "@ant-design/icons";

import './Sider.css';

type Props = {
    collapsed: boolean;
    setCollapsed: Function;
}

type State = {
    collapsedWidth: number;
}

class Sider extends React.Component<Props, State> {
    static defaultProps: Props = {
        collapsed: false,
        setCollapsed: () => {},
    }

    state: State = {
        collapsedWidth: 80,
    }

    onBreakpoint = (broken: boolean) => this.setState({collapsedWidth: broken ? 0:80});
    onCollapse = (collapsed: boolean) => this.props.setCollapsed(collapsed);

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
                        <BankFilled/>{!this.props.collapsed && 'Bank Street Bets'}
                    </Space>
                    <Menu style={{padding: 0}} defaultOpenKeys={["acc"]} theme="dark" mode="inline">
                        <Menu.Item key="1" icon={<CompassOutlined/>}>Dashboard</Menu.Item>
                        <Menu.SubMenu key="acc" icon={<BookOutlined/>} title="Account">
                            <Menu.Item key="2" icon={<FundProjectionScreenOutlined/>}>Portfolio</Menu.Item>
                            <Menu.Item key="3" icon={<EyeOutlined/>}>Watchlist</Menu.Item>
                            <Menu.Item key="4" icon={<BellOutlined/>}>Subscriptions</Menu.Item>
                            <Menu.Item key="5" icon={<TagsOutlined/>}>Orders</Menu.Item>
                            <Menu.Item key="8" icon={<HistoryOutlined/>}>History</Menu.Item>
                        </Menu.SubMenu>
                        <Menu.Item key="6" icon={<ShopOutlined/>}>Market</Menu.Item>
                        <Menu.Item key="7" icon={<ReadOutlined/>}>News</Menu.Item>
                    </Menu>
                </Layout.Sider>            
        );
    }
}

export default Sider;