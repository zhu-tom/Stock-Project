import { Button, Card, Form, Input, Layout, notification } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import * as React from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';

type Props = {
    type: "deposit" | "withdraw"
}

const Transfer: React.FC<Props> = ({type}) => {
    const [form] = useForm();
    const history = useHistory();
    const title = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    return (
        <Layout>
            <Card>
                <Form form={form} onFinish={(values) => {
                    Axios.post(`/api/me/${type}`, {
                        amount: parseInt(values.amount),
                        password: values.password,
                    }).then(res => {
                        console.log(res);
                        history.push("/account/portfolio");
                    }).catch(err => {
                        notification.open({
                            message: "Error",
                            description: err.response.data
                        });
                    });
                }}>
                    <Form.Item name="amount" label={`${title} Amount`} 
                        rules={[
                            {
                                required: true, 
                                type: "number", 
                                validator(_, val) {return val > 0 ? Promise.resolve() : Promise.reject("Enter a valid amount.")},
                            }
                        ]}
                    >
                        <Input type="number"/>
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[{required: true, message: "Enter your password."}]}>
                        <Input.Password/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">{title}</Button>
                    </Form.Item>
                </Form>
            </Card>
        </Layout>
    );
}

export default Transfer;