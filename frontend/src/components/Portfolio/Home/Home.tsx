import { ArrowUpOutlined, DollarCircleFilled, FundFilled } from '@ant-design/icons';
import { Button, Col, Layout, notification, Row, Space, Statistic, Table, Tabs } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import * as React from 'react';
import AreaChart from '../../Charts/Area/Area';
import './Home.css';
import { Link } from 'react-router-dom';

import { OwnedStockType, PortfolioType } from '../../../types/StockTypes';
import Axios from 'axios';

const Home: React.FC<{}> = () => {
    const [data, setData] = React.useState<PortfolioType|undefined>(undefined);
    const [stockTotal, setStockTotal] = React.useState<number>(0);

    React.useEffect(() => {
        Axios.get("/api/me/portfolio").then(res => {
            const newTotal = res.data.portfolio.reduce((prev: number, curr: OwnedStockType) => prev + (curr.amount * curr.stock.price), 0);
            res.data.data.push({datetime: new Date().toISOString(), value: newTotal + res.data.cash});
            setData(res.data);
            setStockTotal(newTotal);
        }).catch(err => {
            notification.open({
                message: "Error",
                description: err.response.data
            });
        });
    }, []);

    const columns: ColumnsType<any> = [
        {
            title: 'Name (Symbol)',
            render(val: OwnedStockType) {
                return <Link to={`/market/${val.stock.symbol}`}>{`${val.stock.name} (${val.stock.symbol})`}</Link>;
            },
            sorter(a, b) {
                return a.stock.name > b.stock.name ? 1 : -1;
            }
        },
        {
            title: '# Shares',
            dataIndex: 'amount',
            sorter(a, b) {
                return a.amount - b.amount;
            }
        },
        {
            title: 'Current Value',
            render(val: OwnedStockType) {
                return val.stock.price;
            },
            sorter(a, b) {
                return a.stock.price - b.stock.price;
            }
        },
        {
            title: 'Average Price',
            dataIndex: 'avgPrice',
            sorter(a, b) {
                return a.avgPrice - b.avgPrice;
            }
        }
    ];

    return (
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={8}>
                    <Layout>
                        <Statistic title="My Account" className="big-stat" precision={2} value={data && data.cash + stockTotal}/>
                        <Space>
                            <Link to="/account/portfolio/withdraw"><Button block type="primary">Withdraw</Button></Link>
                            <Link to="/account/portfolio/deposit"><Button block type="default">Deposit</Button></Link>
                        </Space>  
                        <Row>
                            <Col flex="auto"><Statistic title="Today" value={11.28} precision={2} valueStyle={{ color: '#3f8600' }} prefix={<ArrowUpOutlined/>} suffix="%"/></Col>
                            <Col flex="auto"><Statistic title="Cash" value={data?.cash} precision={2} prefix={<DollarCircleFilled/>}/></Col>
                            <Col flex="auto"><Statistic title="Stock" value={stockTotal} precision={2} prefix={<FundFilled/>}/></Col>
                           
                        </Row>
                    </Layout>
                </Col>
                <Col xs={24} lg={16}>
                        <Tabs type="card">
                            <Tabs.TabPane tab="Today" key="1">
                                <Layout>
                                    <AreaChart data={data?.data} range="day"/>
                                </Layout>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="This Week" key="2">
                                <Layout>
                                    <AreaChart data={data?.data} range="week"/>
                                </Layout>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="This Month" key="3">
                                <Layout>
                                    <AreaChart data={data?.data} range="month"/>
                                </Layout>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="This Year" key="4">
                                <Layout>
                                    <AreaChart data={data?.data} range="year"/>
                                </Layout>
                            </Tabs.TabPane>
                        </Tabs>
                </Col>
                <Col xs={24}>
                    <Table rowKey="symbol" dataSource={data?.portfolio} columns={columns}/>
                </Col>
            </Row>
    );
}

export default Home;