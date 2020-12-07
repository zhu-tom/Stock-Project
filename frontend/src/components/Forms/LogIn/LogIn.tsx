import { Button, Card, Col, Form, Input, notification, Row } from 'antd';
import Axios from 'axios';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import Landing from '../../Landing/Landing';

const Login = () => {
    const history = useHistory();

    const onFinish = (values: {username : string, password: string}) => {
        const {username, password} = values;
        Axios.post("/auth/login", {
            username,
            password
        }).then(res => {
            if (res.status === 200) {
                history.push("/");
            }
        }).catch(err => {
            notification.open({
                message: "Error",
                description: err.response.data
            });
        });
    }

    return (
        <Landing>
            <Row style={{height: '100%', alignItems: 'center'}}>
                <Col lg={{span: 12, offset: 6}} md={{span: 14, offset: 5}} sm={{span: 16, offset: 4}} xs={{span: 18, offset: 3}}>
                    <Card title="Login To Your Account">
                        <Form onFinish={onFinish} labelCol={{span: 8}} wrapperCol={{span: 16}}>
                            <Form.Item name="username" label="Username" rules={[{required: true, message: "Please enter a username"}]}>
                                <Input/>
                            </Form.Item>
                            <Form.Item name="password" label="Password" rules={[{required: true, message: "Please enter a password"}]}>
                                <Input.Password/>
                            </Form.Item>
                            <Form.Item wrapperCol={{xs: {span: 24, offset: 0}, sm: {span: 16, offset: 8}}}>
                                <Button type="primary" htmlType="submit">Login</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Landing>
    );
}

export default Login;