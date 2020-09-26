import { MenuFoldOutlined, MenuUnfoldOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Col, Input, Layout, Menu, Row } from 'antd';
import * as React from 'react';

const data: string[] = ["Notification 1", "Notification 2","Notification 3"];

const Header: React.FC<{siderCollapsed: boolean, setSiderCollapsed: Function}> = ({siderCollapsed, setSiderCollapsed}) => {
    return (
        <Layout.Header style={{background: '#fff', padding:0}}>
            <Row>
                <Col xs={12} lg={10} xl={8} flex="auto" style={{display:'flex', alignItems: 'center'}}>    
                    {React.createElement(siderCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        onClick: () => setSiderCollapsed(!siderCollapsed),
                        style: {fontSize: '16pt', padding: '16px', height: '100%', display: 'flex', alignItems:'center'}
                    })}    
                    <Input.Search placeholder="Search..." enterButton/>
                </Col>
                <Col xs={12} lg={14} xl={16}>
                    <Menu style={{float:'right'}} theme="light" mode="horizontal">
                        <Menu.SubMenu style={{margin: '0 10px', height:'64px'}}icon={<Badge count={data.length}><NotificationOutlined/></Badge>} key="Noti">
                            {data.map((value: string) => (<Menu.Item>{value}</Menu.Item>))}
                        </Menu.SubMenu>
                        <Menu.SubMenu style={{margin: '0 10px', height: '64px'}}icon={<Avatar icon={<UserOutlined/>}/>} key="Acc" title="Tom Zhu">
                            <Menu.Item key="4">Profile</Menu.Item>
                            <Menu.Divider/>
                            <Menu.Item key="5">Log Out</Menu.Item>
                        </Menu.SubMenu>
                    </Menu>
                </Col>
            </Row>
            
      </Layout.Header>
    );
};

export default Header;