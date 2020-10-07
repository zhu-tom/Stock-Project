import { Button, Card, Form, Input, Layout } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import * as React from 'react';

type Props = {
    type: "deposit" | "withdraw"
}

const Transfer: React.FC<Props> = ({type}) => {
    const [form] = useForm();
    const title = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    return (
        <Layout>
            <Card>
                <Form form={form}>
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
                        <Button type="primary">{title}</Button>
                    </Form.Item>
                </Form>
            </Card>
        </Layout>
    );
}

export default Transfer;