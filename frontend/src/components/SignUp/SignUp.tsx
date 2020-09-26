import { Button, Card, Col, Form, Input, Row } from 'antd';
import * as React from 'react';
import Landing from '../Landing/Landing';

type State = {

}

class SignUp extends React.Component<{}, {}> {
    state = {

    }

    render() {
        return (
            <Landing>
                <Row style={{height: '100%', alignItems: 'center'}}>
                    <Col lg={{span: 12, offset: 6}} md={{span: 14, offset: 5}} sm={{span: 16, offset: 4}} xs={{span: 18, offset: 3}}>
                        <Card title="Create A New Account">
                            <Form labelCol={{span: 8}} wrapperCol={{span: 16}}>
                                <Form.Item name="username" label="Username" rules={[{required: true, message: "Please enter a username"}]}>
                                    <Input/>
                                </Form.Item>
                                <Form.Item name="password" label="Password" rules={[{required: true, message: "Please enter a password"}]}>
                                    <Input.Password/>
                                </Form.Item>
                                <Form.Item name="confirm" label="Confirm Password" 
                                    rules={[
                                        {required: true, message: "Re-enter your password"}, 
                                        ({getFieldValue}) => ({validator: (rule, value) => !value || getFieldValue('password') === value ? Promise.resolve():Promise.reject("Passwords must match")})
                                    ]}>
                                    <Input.Password/>
                                </Form.Item>
                                <Form.Item wrapperCol={{xs: {span: 24, offset: 0}, sm: {span: 16, offset: 8}}}>
                                    <Button type="primary">Sign Up</Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Landing>
            
        );
    }
}

export default SignUp;