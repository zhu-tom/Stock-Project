import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { TableRowSelection } from 'antd/lib/table/interface';
import * as React from 'react';
import { OrderType } from '../../types/StockTypes';
import Breadcrumb from '../Dashboard/Breadcrumb/Breadcrumb';
import moment from 'moment';

const ordrers: OrderType[] = [
    {
        id: 329,
        symbol: "MSFT",
        name: "Microsoft",
        type: 'buy',
        placed: 23,
        fulfilled: 20,
        price: 56,
        date: moment("09-24-20 09:20:30")
    },
    {
        id: 239,
        symbol: "APPL",
        name: "Apple",
        type: 'sell',
        placed: 43,
        fulfilled: 24,
        price: 234,
        date: moment("10-04-20 12:32:45")
    }
];

const Orders = () => {
    const [selectedRowKeys, setSelectedKeys]: [React.Key[], any] = React.useState([]);

    const rowSelection: TableRowSelection<OrderType> = {
        onChange(selectedRowKeys) {
            setSelectedKeys(selectedRowKeys);
        },
        selectedRowKeys,
    }

    const columns: ColumnsType<OrderType> = [
        {
            title: "Symbol",
            render(val) {
                return `${val.symbol} (${val.name})`;
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
            title: "Placed",
            dataIndex: 'placed',
            sorter(a, b) {
                return a.placed - b.placed;
            }
        },
        {
            title: "Date",
            render(_, record) {
                return record.date.format("ddd MMM Do h:mm a");
            },
            sorter(a, b) {
                return a.date.isAfter(b.date) ? 1 : -1;
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
            <Table rowKey="id" rowSelection={rowSelection} dataSource={ordrers} columns={columns}/>
        </>
    );
}

export default Orders;