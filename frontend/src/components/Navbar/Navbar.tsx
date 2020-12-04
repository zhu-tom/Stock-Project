import { Button, Col, Layout, Menu, Row, Space } from 'antd';
import MenuItem from 'antd/lib/menu/MenuItem';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC<{}> = () => {
    const history = useHistory();
    return (
        <Layout.Header>
            <Row>
                <Col xs={12}>
                    <Menu theme="dark" mode="horizontal">
                        <MenuItem key="1">Home</MenuItem>
                        <MenuItem key="2">Market</MenuItem>
                        <MenuItem key="3">News</MenuItem>
                    </Menu>
                </Col>
                <Col xs={12} >
                    <Space style={{float: 'right'}}>
                        <Button type="primary" shape="round" onClick={() => history.push("/signup")}>Sign Up</Button>
                        <Button type="default" shape="round" onClick={() => history.push("/login")}>Login</Button>
                    </Space>
                </Col>
            </Row>
        </Layout.Header>
    );
};

export default Navbar;