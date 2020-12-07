import { notification, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import Axios from 'axios';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { StockType } from '../../../types/StockTypes';

const columns: ColumnsType<StockType> = [
    {
        title: 'Symbol',
        render(val: StockType) {
            return <Link to={`/market/${val.symbol}`}>{val.symbol}</Link>;
        },
        sorter(a, b) {
            return a.symbol > b.symbol ? 1 : -1;
        }
    },
    {
        title: 'Name',
        render(val: StockType) {
            return <Link to={`/market/${val.symbol}`}>{val.name}</Link>;
        },
        sorter(a, b) {
            return a.name > b.name ? 1 : -1;
        }
    },
    {
        title: 'Market',
        dataIndex: 'market',
        sorter(a, b) {
            return a.market > b.market ? 1 : -1;
        },
        filters: [
            {
                value: 'NASDAQ',
                text: 'NASDAQ'
            },
            {
                value: 'NYSE',
                text: 'NYSE',
            }
        ],
        onFilter(val, rec) {
            return rec.market === val;
        }
    },
    {
        title: 'Price',
        render(val: StockType) {
            return `$${val.price}`
        },
        sorter(a, b) {
            return a.price - b.price
        }
    },
    {
        title: 'Ask',
        render(val: StockType) {
            return `$${val.current.ask}`
        },
        sorter(a, b) {
            return a.current.ask - b.current.ask
        }
    },
    {
        title: 'Bid',
        render(val: StockType) {
            return `$${val.current.bid}`
        },
        sorter(a, b) {
            return a.current.bid - b.current.bid
        }
    },
];

const Home = () => {
    const [data, setData] = React.useState<StockType[]>([]);
    const [limit, setLimit] = React.useState<number | undefined>(10000);
    const [page, setPage] = React.useState<number | undefined>(1);
    const [loading, setLoading] = React.useState(false);

    const getData = React.useCallback(() => {
        setLoading(true);
        Axios.get(`/api/stocks?page=${page}&limit=${limit}`).then(res => {
            setData(res.data);
            setLoading(false);
        }).catch(err => {
            notification.open({
                message: "Error",
                description: err.response.data
            });
        });
    }, [page, limit]);

    React.useEffect(() => {
        console.log("effect");
        getData();
    }, [getData])

    return (
        <Table 
            dataSource={data}
            loading={loading}
            pagination={{
                onChange: (pg, pageSize) => {
                    console.log("change");
                    setLimit(10000);
                    setPage(pg);
                    getData();
                },
                defaultPageSize: 10,
                pageSizeOptions: ['10', '20', '30']
            }}
            columns={columns}
        />
    );
}

export default Home;