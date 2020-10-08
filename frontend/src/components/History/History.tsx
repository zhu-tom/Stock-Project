import { Table } from 'antd';
import * as React from 'react';
import moment from 'moment';
import { TradeType, TransferType } from '../../types/StockTypes';
import Breadcrumb from '../Dashboard/Breadcrumb/Breadcrumb';
import { ColumnsType } from 'antd/lib/table';

const data: (TransferType | TradeType)[] = [
    {
        id: 2193,
        type: 'buy',
        amount: 3210,
        symbol: "MSFT",
        price: 10,
        date: moment("10-02-20 14:59:20")
    },
    {
        id: 2345,
        type: 'sell',
        amount: 693,
        symbol: "APPL",
        price: 902,
        date: moment("10-01-20 16:32:12")
    },
    {
        id: 312,
        type: 'withdraw',
        amount: 932,
        date: moment("09-26-20 11:29:31")
    },
    {
        id: 312,
        type: 'deposit',
        amount: 2453,
        date: moment("09-24-20 11:29:31")
    },
];

const History = () => {
    const columns: ColumnsType<TransferType | TradeType> = [
        {
            title: "Action",
            render(item) {
                return `${item.type.charAt(0).toUpperCase().concat(item.type.slice(1))} ${item.amount} 
                    ${(item.type === "buy" || item.type === "sell") ? `${item.symbol} at ${item.price}`:""}`;
            },
            sorter(a, b) {
                return a.type > b.type ? 1 : -1;
            },
            filters: [
                {
                    text: "Withdraw",
                    value: "withdraw"
                },
                {
                    text: "Deposit",
                    value: "deposit",
                },
                {
                    text: "Buy",
                    value: "buy"
                },
                {
                    text: "Sell",
                    value: "sell",
                }
            ],
            onFilter(val, record) {
                return record.type === val;
            }
        },
        {
            title: "Date",
            render(item) {
                return item.date.format("dddd, MMMM Do YYYY, h:mm:ss a");
            },
            sorter(a, b) {
                return a.date.isBefore(b.date) ? -1 : 1;
            }
        }
    ]

    return (
        <>
            <Breadcrumb/>
            <Table dataSource={data} columns={columns}/>
        </>
    );
}

export default History;