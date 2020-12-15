import { List, notification, Typography } from 'antd';
import Axios from 'axios';
import * as React from 'react';
import { ArticleType } from '../../types/StockTypes';
import Breadcrumb from '../Dashboard/Breadcrumb/Breadcrumb';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';

const News = () => {
    const [data, setData] = React.useState<ArticleType[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [hasMore, setHasMore] = React.useState(true);
    const pageSize = 20;

    const handleInfiniteLoad = (p: number) => {
        console.log(p);
        Axios.get(`/api/news?page=${p}&pageSize=${pageSize}`).then(res => {
            if (p * pageSize >= res.data.totalResults) {
                setHasMore(false);
            }
            setData(d => d.concat(res.data.articles));
        }).catch(err => {
            notification.open({
                message: "Error",
                description: err.response.data
            });
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <>
            <Breadcrumb/>
            <InfiniteScroll pageStart={0} loadMore={handleInfiniteLoad} hasMore={!loading && hasMore}>

            </InfiniteScroll>
            <List loading={loading} itemLayout="vertical" size="large" dataSource={data} style={{backgroundColor: '#fff'}}
                renderItem={item => (
                    <List.Item key={item.title} extra={<img width={250} alt="article" src={item.urlToImage}/>}>
                        <List.Item.Meta title={<Typography.Link href={item.url}>{item.title}</Typography.Link>} description={item.description}/>
                        {item.source.name} - {moment(item.publishedAt).fromNow()}
                    </List.Item>
                )}
            />
        </>
    );
}

export default News;