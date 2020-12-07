import { Card, Col, Row, Typography } from 'antd';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import Breadcrumb from '../Dashboard/Breadcrumb/Breadcrumb';
import './Home.css';

const Home: React.FC<{}> = () => {
    const history = useHistory();
    return (
        <>
            <Breadcrumb/>
            <Row gutter={[16,16]}>
                <Col span={8}>
                    <Card hoverable onClick={() => history.push("/account/portfolio")}>
                        <Typography.Title>Portfolio</Typography.Title>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card hoverable onClick={() => history.push("/account/orders")}>
                        <Typography.Title>Orders</Typography.Title>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card hoverable onClick={() => history.push("/account/history")}>
                        <Typography.Title>History</Typography.Title>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card hoverable onClick={() => history.push("/account/watchlist")}>
                        <Typography.Title>Watchlist</Typography.Title>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card hoverable onClick={() => history.push("/account/subscriptions")}>
                        <Typography.Title>Subscription</Typography.Title>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card hoverable onClick={() => history.push("/market")}>
                        <Typography.Title>Market</Typography.Title>
                    </Card>
                </Col>
            </Row> 
        </>
    );
}

export default Home;