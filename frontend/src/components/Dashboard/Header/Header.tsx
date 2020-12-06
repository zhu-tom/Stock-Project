import { MenuFoldOutlined, MenuUnfoldOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { AutoComplete, Avatar, Badge, Col, Input, Layout, Menu, Row, Typography } from 'antd';
import * as React from 'react';
import _ from 'lodash';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import { NotificationType, StockType } from '../../../types/StockTypes';
import { SelectProps } from 'antd/lib/select';

const data: string[] = ["Notification 1", "Notification 2","Notification 3"];

const Header: React.FC<{siderCollapsed: boolean, setSiderCollapsed: Function}> = ({siderCollapsed, setSiderCollapsed}) => {
    const [results, setResults] = React.useState<StockType[]>([]);
    const [loading, setLoading] = React.useState(false);
    const history = useHistory();
    const [search, setSearch] = React.useState("");
    const [notis, setNotis] = React.useState<NotificationType[]>([]);

    React.useEffect(() => {
        Axios.get('/api/me/notifications?unreadOnly=true').then(res => {
            setNotis(res.data);
        });
    }, []);

    const handleSearch = _.debounce((value: string) => {
        doSearch(value);
    }, 500);

    const doSearch = (value: string) => {
        setSearch(value);
        if (value) {
            Axios.get(`/api/stocks?q=${value}`).then(res => {
                setResults(res.data);
            });
        }
    }

    const handleSubmit = (value: string) => {
        setLoading(true);
        if (value) {
            history.push(`/market/${value}`);
        }
        setLoading(false);
    }

    const options: SelectProps<object>['options'] = results.map(res => {
        return (
            {
                value: res.symbol,
                label: (
                    <Typography.Text ellipsis>
                        {`${res.symbol} - ${res.name}`}
                    </Typography.Text>
                )
            }
        )
    });

    const handleLogout = () => {
        Axios.post("/auth/logout").then(res => {
            history.push("/login");
        });
    }

    return (
        <Layout.Header style={{background: '#fff', padding:0}}>
            <Row>
                <Col xs={15} md={14} lg={10} style={{display:'flex', alignItems: 'center'}}>    
                    {React.createElement(siderCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        onClick: () => setSiderCollapsed(!siderCollapsed),
                        style: {fontSize: '16pt', padding: '16px', height: '100%', display: 'flex', alignItems:'center'}
                    })}    
                    <AutoComplete onSelect={handleSubmit} onSearch={doSearch} onChange={handleSearch} options={options}>
                        <Input.Search placeholder="Search..." enterButton loading={loading} value={search}/>
                    </AutoComplete>                    
                </Col>
                <Col flex='auto'>
                    <Menu style={{float:'right'}} theme="light" mode="horizontal">
                        <Menu.SubMenu style={{margin: '0 10px', height:'64px'}} icon={<Badge count={notis.length}><NotificationOutlined/></Badge>} key="Noti">
                            {notis.map((value, index) => (
                                <Menu.Item key={index} onClick={() => {
                                    history.push(`${value.type === "sub" ? `/account/subscriptions` : `/market/${value.trade?.order.symbol}`}`)
                                }}>
                                    <Typography.Text type={value.type === "sub" ? "warning" : "success"}>
                                        {value.type === "sub" ? 
                                        `Subscription: ${value.subscription?.symbol} changed by ${value.subscription?.event}%` :
                                        `Trade: ${value.trade?.order.symbol} - ${value.trade?.amount} units at $${value.trade?.price}`}
                                    </Typography.Text>
                                </Menu.Item>
                            ))}
                        </Menu.SubMenu>
                        <Menu.SubMenu style={{margin: '0 10px', height: '64px'}}icon={<Avatar icon={<UserOutlined/>}/>} key="Acc">
                            <Menu.Item key="4">Profile</Menu.Item>
                            <Menu.Divider/>
                            <Menu.Item key="5" onClick={handleLogout}>Log Out</Menu.Item>
                        </Menu.SubMenu>
                    </Menu>
                </Col>
            </Row>
            
      </Layout.Header>
    );
};

export default Header;