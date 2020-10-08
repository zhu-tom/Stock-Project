import { EyeOutlined, NotificationOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Form, Input, InputNumber, Modal, PageHeader, Radio, Select } from 'antd';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { StockType } from '../../../types/StockTypes';
import AreaChart from '../../Charts/Area/Area';
import Breadcrumb from '../../Dashboard/Breadcrumb/Breadcrumb';

const stocks: StockType[] = [
    {
        symbol: "APPL",
        name: "Apple",
        price: 120,
        ask: 123,
        daily: 2391,
        high: 124,
        low: 114,
        historical: [234, 232, 32, 1242, 123, 12, 123]
    }
];

const Stock = () => {
    const { symbol } = useParams<{symbol: string}>();

    const [ isOrder, setOrder ] = React.useState<boolean>();

    console.log(symbol);
    const stock = stocks.find(el => el.symbol === symbol);
    return (
        <>
            <Breadcrumb end={symbol}/>
                <Card>
                <PageHeader title={symbol} extra={[
                    <Button type="primary" onClick={() => setOrder(true)}>New Order</Button>,
                    <Button type="primary"><EyeOutlined/>Watchlist</Button>,
                    <Button><NotificationOutlined/>Subscriptions</Button>
                ]}>
                    <Descriptions bordered layout="vertical" size="middle">
                        <Descriptions.Item label="Name">{stock?.name}</Descriptions.Item>
                        <Descriptions.Item label="Price">{stock?.price}</Descriptions.Item>
                        <Descriptions.Item label="Ask">{stock?.ask}</Descriptions.Item>
                        <Descriptions.Item label="High/Low">{`${stock?.high}/${stock?.low}`}</Descriptions.Item>
                        <Descriptions.Item label="# Trades Today">{stock?.daily}</Descriptions.Item>
                        <Descriptions.Item label="Shares Owned">{3920}</Descriptions.Item>
                        <Descriptions.Item label="Avg. Price Paid">{45}</Descriptions.Item>
                        <Descriptions.Item label="Current Value">{28939}</Descriptions.Item>
                    </Descriptions>
                </PageHeader>
                <AreaChart label={symbol}/>
            </Card>
            <Modal visible={isOrder} title="New Order" onCancel={() => setOrder(false)} onOk={() => setOrder(false)}>
                <Form>
                    <Form.Item required label="Symbol">
                        <Input disabled value={symbol}/>
                    </Form.Item>
                    <Form.Item required label="Amount">
                        <InputNumber min={0}/>
                    </Form.Item>
                    <Form.Item required label="Price">
                        <InputNumber min={0}/>
                    </Form.Item>
                    <Form.Item required label="Type">
                        <Radio.Group>
                            <Radio value="buy">Buy</Radio>
                            <Radio value="sell">Sell</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item required label="Expiry">
                        <Select>
                            <Select.Option value="nolimit">Until Cancelled</Select.Option>
                            <Select.Option value="endday">End of Day</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default Stock;