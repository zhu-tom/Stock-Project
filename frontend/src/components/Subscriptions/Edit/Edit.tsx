import { Button, Card, Form, Input, InputNumber } from 'antd';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { SubscriptionType } from '../../../types/StockTypes';

const Edit: React.FC<{subscriptions: SubscriptionType[]}> = ({subscriptions}) => {
    const { id } = useParams<{id: string}>();
    const item = subscriptions.find(el => el.id === parseInt(id));
    return (
        <Card>
            <Form>
                <Form.Item label="Symbol" required>
                    <Input disabled value={item?.symbol}/>
                </Form.Item>
                <Form.Item rules={[{required: true, type: 'number', message: "Enter a valid number."}]} label="Minimum Change" required>
                    <InputNumber formatter={val => `${val}%`} parser={val => val!.replace("%", '')}/>
                </Form.Item>
                <Form.Item>
                    <Button>Cancel</Button>
                    <Button type="primary">Save</Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default Edit;