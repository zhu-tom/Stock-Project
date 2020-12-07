import { Button, Card, Form, Input, InputNumber, notification } from 'antd';
import * as React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { SubscriptionType } from '../../../types/StockTypes';
import Axios from 'axios';

const Edit: React.FC<{subscriptions: SubscriptionType[], setSubscriptions: any}> = ({subscriptions, setSubscriptions}) => {
    const { id } = useParams<{id: string}>();
    const history = useHistory();
    const [item, setItem] = React.useState<SubscriptionType>();

    const [form] = Form.useForm();

    React.useEffect(() => {
        Axios.get(`/api/me/subscriptions/${id}`).then(res => {
            console.log(res.data);
            setItem(res.data);
            form.setFieldsValue(res.data);
        }).catch(err => {
            notification.open({
                message: "Error",
                description: err
            });
        });
    }, [id, form]);


    const [loading, setLoading] = React.useState(false);
    return (
        <Card>
            <Form initialValues={{event: item?.event, symbol: item?.symbol}} onFinish={(values) => {
                setLoading(true);
                Axios.put(`/api/me/subscriptions/${id}`, {
                    event: parseInt(values.event)
                }).then(res => {
                    console.log(res.data);
                    let copy = subscriptions;
                    const index = copy.findIndex(el => el._id === res.data._id);
                    copy[index] = res.data;
                    setSubscriptions(copy);
                }).catch(err => {
                    notification.open({
                        message: "Error",
                        description: err.response.datar
                    });
                }).finally(() => {
                    setLoading(false);
                    
                    history.push("/account/subscriptions");
                });
            }} form={form}>
                <Form.Item name="symbol" label="Symbol" required>
                    <Input disabled value={item?.symbol}/>
                </Form.Item>
                <Form.Item name="event" initialValue={item?.event} rules={[{required: true, type: 'number', message: "Enter a valid number."}]} label="Minimum Change" required>
                    <InputNumber formatter={val => `${val}%`} parser={val => val!.replace("%", '')}/>
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