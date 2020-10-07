import { ArrowUpOutlined, DollarCircleFilled, FundFilled } from '@ant-design/icons';
import { Button, Col, Layout, Row, Space, Statistic, Table, Tabs } from 'antd';
import Breadcrumb from '../../Dashboard/Breadcrumb/Breadcrumb';
import { ColumnsType } from 'antd/lib/table';
import * as React from 'react';
import AreaChart from '../../Charts/Area/Area';
import './Home.css';
import { Link } from 'react-router-dom';

type OwnedStock = {
    name: string,
    symbol: string,
    amount: number,
    price: number,
    avgPaid: number
}

const data: OwnedStock[] = [
    {
        name: "Microsoft",
        symbol: "MSFT",
        amount: 100,
        price: 50,
        avgPaid: 40,
    },
    {
        name: "Apple",
        symbol: "APPL",
        amount: 120,
        price: 10,
        avgPaid: 30,
    },
    {
        name: "IBM",
        symbol: "IBM",
        amount: 50,
        price: 2,
        avgPaid: 3,
    },
    {
        name: "J.P. Morgan",
        symbol: "JPM",
        amount: 150,
        price: 34,
        avgPaid: 26,
    }

]

const Home: React.FC<{}> = () => {
    const columns: ColumnsType<any> = [
        {
            title: 'Name (Symbol)',
            render(val: OwnedStock) {
                return `${val.name} (${val.symbol})`;
            },
            sorter(a, b) {
                return a.name > b.name ? 1 : -1;
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
            title: 'Current Ask/Bid',
            dataIndex: 'price',
            sorter(a, b) {
                return a.price - b.price;
            }
        },
        {
            title: 'Average Paid',
            dataIndex: 'avgPaid',
            sorter(a, b) {
                return a.avgPaid - b.avgPaid;
            }
        }
    ];

    return (
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={8}>
                    <Layout>
                        <Statistic title="My Account" className="big-stat" precision={2} value={12345.67}/>
                        <Space>
                            <Link to="/account/portfolio/withdraw"><Button block type="primary">Withdraw</Button></Link>
                            <Link to="/account/portfolio/deposit"><Button block type="default">Deposit</Button></Link>
                        </Space>  
                        <Row>
                            <Col flex="auto"><Statistic title="Today" value={11.28} precision={2} valueStyle={{ color: '#3f8600' }} prefix={<ArrowUpOutlined/>} suffix="%"/></Col>
                            <Col flex="auto"><Statistic title="Cash" value={10000} precision={2} prefix={<DollarCircleFilled/>}/></Col>
                            <Col flex="auto"><Statistic title="Stock" value={2345.67} precision={2} prefix={<FundFilled/>}/></Col>
                           
                        </Row>
                    </Layout>
                </Col>
                <Col xs={24} lg={16}>
                        <Tabs type="card">
                            <Tabs.TabPane tab="Today" key="1">
                                <Layout>
                                    <AreaChart/>
                                </Layout>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="This Week" key="2">
                                <Layout>
                                    <AreaChart/>
                                </Layout>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="This Month" key="3">
                                <Layout>
                                    <AreaChart/>
                                </Layout>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="This Year" key="4">
                                <Layout>
                                    <AreaChart/>
                                </Layout>
                            </Tabs.TabPane>
                        </Tabs>
                </Col>
                <Col xs={24}>
                    <Table dataSource={data} columns={columns}/>
                </Col>
            </Row>
    );
}

export default Home;