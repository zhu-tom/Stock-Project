import { ArrowUpOutlined, DollarCircleFilled, FundFilled } from '@ant-design/icons';
import { Col, Layout, Row, Statistic, Tabs } from 'antd';
import * as React from 'react';
import AreaChart from '../Charts/Area/Area';
import Breadcrumb from '../Dashboard/Breadcrumb/Breadcrumb';
import './Home.css';

const Home: React.FC<{}> = () => {
    return (
        <>
            <Breadcrumb/>
            <Row gutter={[24, 24]}>
                <Col xs={24} md={16} lg={12}>
                    <Layout>
                        <Statistic title="My Account" className="big-stat" precision={2} value={12345.67}/>
                        <Row>
                            <Col flex="auto"><Statistic title="Today" value={11.28} precision={2} valueStyle={{ color: '#3f8600' }} prefix={<ArrowUpOutlined />} suffix="%"/></Col>
                            <Col flex="auto"><Statistic title="Cash" value={10000} precision={2} prefix={<DollarCircleFilled/>}/></Col>
                            <Col flex="auto"><Statistic title="Stock" value={2345.67} precision={2} prefix={<FundFilled/>}/></Col>
                        </Row>
                    </Layout>
                </Col>
                <Col span={24}>
                        <Tabs type="card">
                            <Tabs.TabPane tab="Today" key="1">
                                <Layout className="bg-white">
                                    <AreaChart/>
                                </Layout>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="This Week" key="2">

                            </Tabs.TabPane>
                            <Tabs.TabPane tab="This Month" key="3">

                            </Tabs.TabPane>
                            <Tabs.TabPane tab="This Year" key="4">

                            </Tabs.TabPane>
                        </Tabs>
                </Col>
            </Row>
        </>
    );
}

export default Home;