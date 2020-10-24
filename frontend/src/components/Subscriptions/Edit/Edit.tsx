import { Button, Card, Form, Input, InputNumber } from 'antd';
import * as React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { SubscriptionType } from '../../../types/StockTypes';
import Axios from 'axios';

const Edit: React.FC<{subscriptions: SubscriptionType[], setSubscriptions: any}> = ({subscriptions, setSubscriptions}) => {
    const { id } = useParams<{id: string}>();
    const item = subscriptions.find(el => el.id === parseInt(id));
    const history = useHistory();
    const [loading, setLoading] = React.useState(false);
    return (
        <Card>
            <Form initialValues={{event: item?.event, symbol: item?.symbol}} onFinish={(values) => {
                setLoading(true);
                Axios.post(`/api/users/bbard1/subscriptions/${id}`, {
                    event: parseInt(values.event)
                }).then(res => {
                    console.log(res.data);
                    let copy = subscriptions;
                    const index = copy.findIndex(el => el.id === res.data.id);
                    copy[index] = res.data;
                    setSubscriptions(copy);
                }).catch(err => {
                    console.log(err);
                }).finally(() => {
                    setLoading(false);
                    
                    history.push("/account/subscriptions");
                });
            }}>
                <Form.Item name="symbol" label="Symbol" required>
                    <Input disabled value={item?.symbol}/>
                </Form.Item>
                <Form.Item name="event" rules={[{required: true, type: 'number', message: "Enter a valid number."}]} label="Minimum Change" required>
                    <InputNumber defaultValue={item?.event} formatter={val => `${val}%`} parser={val => val!.replace("%", '')}/>
                </Form.Item>
                <Form.Item>
                    <Button onClick={() => history.goBack()}>Cancel</Button>
                    <Button type="primary" loading={loading} htmlType="submit">Save</Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default Edit;