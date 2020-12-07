import { Button, Card, Col, Form, Input, notification, Row } from 'antd';
import Axios from 'axios';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Landing from '../../Landing/Landing';

class SignUp extends React.Component<RouteComponentProps, {}> {

    render() {
        return (
            <Landing>
                <Row style={{height: '100%', alignItems: 'center'}}>
                    <Col lg={{span: 12, offset: 6}} md={{span: 14, offset: 5}} sm={{span: 16, offset: 4}} xs={{span: 18, offset: 3}}>
                        <Card title="Create A New Account">
                            <Form onFinish={values => {
                                const { password, username } = values;
                                Axios.post("/auth/signup", {username, password}).then(res => {
                                    this.props.history.push("/");
                                }).catch(err => {
                                    notification.open({
                                        message: "Error",
                                        description: err.response.data
                                    });
                                    console.log(err);
                                });
                            }} labelCol={{span: 8}} wrapperCol={{span: 16}}>
                                <Form.Item name="username" label="Username" rules={[{required: true, message: "Please enter a username"}]}>
                                    <Input/>
                                </Form.Item>
                                <Form.Item name="password" label="Password" rules={[{required: true, message: "Please enter a password"}]}>
                                    <Input.Password/>
                                </Form.Item>
                                <Form.Item name="confirm" label="Confirm Password" 
                                    rules={[
                                        {required: true, message: "Re-enter your password"}, 
                                        ({getFieldValue}) => ({
                                            validator: (rule, value) => !value || getFieldValue('password') === value ? Promise.resolve():Promise.reject("Passwords must match")
                                        })
                                    ]}>
                                    <Input.Password/>
                                </Form.Item>
                                <Form.Item wrapperCol={{xs: {span: 24, offset: 0}, sm: {span: 16, offset: 8}}}>
                                    <Button type="primary" htmlType="submit">Sign Up</Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Landing>
            
        );
    }
}

export default withRouter(SignUp);