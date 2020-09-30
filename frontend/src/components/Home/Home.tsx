import { ArrowDownOutlined, ArrowUpOutlined, DollarCircleFilled, FundFilled } from '@ant-design/icons';
import { Col, Divider, Layout, Row, Space, Statistic } from 'antd';
import * as React from 'react';
import LineChart from '../Charts/Line/Line';
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
                    <Layout>
                        <LineChart/>
                    </Layout>
                </Col>
            </Row>
        </>
    );
}

export default Home;