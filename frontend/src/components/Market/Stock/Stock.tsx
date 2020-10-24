import { EyeOutlined, NotificationOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Form, Input, InputNumber, Modal, PageHeader, Radio, Select, Layout, Tabs, Checkbox } from 'antd';
import Axios from 'axios';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { OwnedStockType, StockType, WatchlistType } from '../../../types/StockTypes';
import AreaChart from '../../Charts/Area/Area';
import Breadcrumb from '../../Dashboard/Breadcrumb/Breadcrumb';

const Stock = () => {
    const { symbol } = useParams<{symbol: string}>();

    const [ isOrder, setOrder ] = React.useState<boolean>();
    const [ isList, setList ] = React.useState(false);
    const [ stock, setStock ] = React.useState<StockType | undefined>(undefined);
    const [ portfolio, setPortfolio ] = React.useState<OwnedStockType>();
    const [ watchlists, setWatchlists ] = React.useState<WatchlistType[]>([]);

    const [watchlistForm] = Form.useForm();

    console.log(symbol);

    React.useEffect(() => {
        Axios.get(`/api/stocks/symbol/${symbol}`).then(res => {
            console.log(res);
            setStock(res.data);
        });
        Axios.get(`/api/users/bbard1/portfolio?stock=${symbol}`).then(res => {
            setPortfolio(res.data);
        }).catch(() => {
            console.log("not found");
        });
    }, [symbol]);

    return (
        <>
            <Breadcrumb end={symbol}/>
                <Card>
                <PageHeader title={symbol} extra={[
                    <Button type="primary" onClick={() => setOrder(true)}>New Order</Button>,
                    <Button type="primary" onClick={() => {
                        Axios.get("/api/users/bbard1/watchlists").then(res => {
                            setWatchlists(res.data);
                        });
                        setList(true);
                    }}><EyeOutlined/>Watchlist</Button>,
                    <Button><NotificationOutlined/>Subscriptions</Button>
                ]}>
                    <Descriptions bordered layout="vertical" size="middle">
                        <Descriptions.Item label="Name">{stock?.name}</Descriptions.Item>
                        <Descriptions.Item label="Price">{stock?.price}</Descriptions.Item>
                        <Descriptions.Item label="Ask/Bid">{stock?.current.ask}/{stock?.current.bid}</Descriptions.Item>
                        <Descriptions.Item label="High/Low">{`${stock?.daily.high}/${stock?.daily.low}`}</Descriptions.Item>
                        <Descriptions.Item label="# Trades Today">{stock?.daily.trades}</Descriptions.Item>
                        <Descriptions.Item label="Shares Owned">{portfolio?.amount}</Descriptions.Item>
                        <Descriptions.Item label="Avg. Price Paid">{portfolio?.avgPrice}</Descriptions.Item>
                        <Descriptions.Item label="Current Value">{portfolio?.current}</Descriptions.Item>
                    </Descriptions>
                </PageHeader>
                
                <Tabs type="card">
                    <Tabs.TabPane tab="Today" key="1">
                        <Layout>
                            <AreaChart label={symbol} data={stock?.history} range="day"/>
                        </Layout>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="This Week" key="2">
                        <Layout>
                            <AreaChart label={symbol} data={stock?.history} range="week"/>
                        </Layout>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="This Month" key="3">
                        <Layout>
                            <AreaChart label={symbol} data={stock?.history} range="month"/>
                        </Layout>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="This Year" key="4">
                        <Layout>
                            <AreaChart label={symbol} data={stock?.history} range="year"/>
                        </Layout>
                    </Tabs.TabPane>
                </Tabs>
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
            <Modal visible={isList} title="Add to Watchlist" onCancel={() => setList(false)} onOk={() => {
                watchlistForm.submit();
            }}>
                <Form onFinish={(values) => {
                    let listIds = [];
                    for (const key in values) {
                        if (values[key]) {
                            listIds.push(key);
                        }
                    }
                    Axios.post(`/api/users/bbard1/watchlists/addStock`, {
                        symbol: symbol,
                        lists: listIds,
                    }).then(res => {
                        console.log(res.data)
                    }).finally(() => setList(false));
                }} form={watchlistForm} preserve={false}>
                   {watchlists.map(list => {
                       console.log(!!list.stocks.find(item => item.symbol === symbol));
                       return (
                           <Form.Item initialValue={!!list.stocks.find(item => item.symbol === symbol)} name={list.id} valuePropName="checked">
                               <Checkbox>{list.name}</Checkbox>
                           </Form.Item>
                       );
                   })}
                </Form>
            </Modal>
        </>
    );
}

export default Stock;