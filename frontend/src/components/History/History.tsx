import { Table } from 'antd';
import * as React from 'react';
import moment from 'moment';
import { TradeType, TransferType } from '../../types/StockTypes';
import Breadcrumb from '../Dashboard/Breadcrumb/Breadcrumb';
import { ColumnsType } from 'antd/lib/table';
import Axios from 'axios';
import { Link } from 'react-router-dom';

const History = () => {
    const [data, setData] = React.useState<(TransferType | TradeType)[]>([]);

    React.useEffect(() => {
        Axios.get("/api/users/bbard1/history").then(res => {
            setData(res.data);
        });
    })
    const columns: ColumnsType<TransferType | TradeType> = [
        {
            title: "Action",
            render(item) {
                return <>
                    {`${item.type.charAt(0).toUpperCase().concat(item.type.slice(1))} ${item.amount} `}
                    {(item.type === "buy" || item.type === "sell") ? <><Link to={`/market/${item.symbol}`}>{item.symbol}</Link>{` at ${item.price}`}</>:""}
                </>
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
                return moment(item.datetime).format("dddd, MMMM Do YYYY, h:mm:ss a");
            },
            sorter(a, b) {
                return moment(a.datetime).isBefore(moment(b.datetime)) ? -1 : 1;
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