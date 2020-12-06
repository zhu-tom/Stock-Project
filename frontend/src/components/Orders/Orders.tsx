import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { TableRowSelection } from 'antd/lib/table/interface';
import * as React from 'react';
import { OrderType } from '../../types/StockTypes';
import Breadcrumb from '../Dashboard/Breadcrumb/Breadcrumb';
import moment from 'moment';
import Axios from 'axios';
import { Link } from 'react-router-dom';

const Orders = () => {
    const [selectedRowKeys, setSelectedKeys]: [React.Key[], any] = React.useState([]);
    const [data, setData] = React.useState<OrderType[]>([]);

    Axios.get("/api/me/orders").then(res => {
        setData(res.data);
    });

    const rowSelection: TableRowSelection<OrderType> = {
        onChange(keys) {
            setSelectedKeys(keys);
        },
        selectedRowKeys,
    }

    const columns: ColumnsType<OrderType> = [
        {
            title: "Symbol",
            render(val) {
                return (<Link to={`/market/${val.symbol}`}>{val.symbol}</Link>);
            },
            sorter(a, b) {
                return a.symbol > b.symbol ? 1 : -1;
            }
        },
        {
            title: "Type",
            filters: [
                {
                    text: "Buy",
                    value: "buy",
                },
                {
                    text: "Sell",
                    value: "sell",
                }
            ],
            onFilter(val, record) {
                return record.type === val;
            },
            render(val) {
                return val.type.charAt(0).toUpperCase().concat(val.type.slice(1));
            },
            sorter(a, b) {
                return a.type === 'buy' ? 1 : -1;
            }
        },
        {
            title: "Price",
            dataIndex: 'price',
            sorter(a, b) {
                return a.price - b.price;
            }
        },
        {
            title: "Fulfilled",
            dataIndex: 'fulfilled',
            sorter(a, b) {
                return a.fulfilled - b.fulfilled;
            }
        },
        {
            title: "Amount",
            dataIndex: 'amount',
            sorter(a, b) {
                return a.amount - b.amount;
            }
        },
        {
            title: "Date",
            render(_, record) {
                return moment(record.datetime).format("ddd MMM Do h:mm a");
            },
            sorter(a, b) {
                return moment(a.datetime).isAfter(moment(b.datetime)) ? 1 : -1;
            }
        },
        {
            title: "",
            render() {
                return <Button danger type="primary">Cancel</Button>
            },
        }
    ]

    return (
        <>
            <Breadcrumb/>
            {selectedRowKeys.length > 0 && <Button style={{marginBottom: '16px'}} type="primary" danger>{`Cancel All (${selectedRowKeys.length})`}</Button>}
            <Table rowKey="id" rowSelection={rowSelection} dataSource={data} columns={columns}/>
        </>
    );
}

export default Orders;