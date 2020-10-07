import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { TableRowSelection } from 'antd/lib/table/interface';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import {StockType, WatchlistType} from '../../../types/StockTypes';
import Breadcrumb from '../../Dashboard/Breadcrumb/Breadcrumb';

type Props = {
    watchlists?: WatchlistType[],
}

const Watchlist: React.FC<Props> = ({watchlists}) => {
    const [selectedRowKeys, setSelectedKeys]: [React.Key[], any] = React.useState([]);

    const { id } = useParams<{id: string}>();
    const list = watchlists?.find(val => val.id === parseInt(id));
    
    const columns: ColumnsType<StockType> = [
        {
            title: "Symbol",
            dataIndex: "symbol",
            sorter(a, b) {
                return a.symbol < b.symbol ? -1:1;
            }
        },
        {
            title: "Name",
            dataIndex: "name",
            sorter(a, b) {
                return a.name < b.name ? -1:1;
            }
        },  
        {
            title: "Price",
            dataIndex: "price",
            sorter(a, b) {
                return a.price - b.price;
            }
        }, 
        {
            title: "Ask",
            dataIndex: "ask",
            sorter(a, b) {
                return a.ask - b.ask;
            }
        },
        {
            title: "Daily Trades",
            dataIndex: "daily",
            sorter(a, b) {
                return a.daily - b.daily;
            }
        }, 
        {
            title: "",
            render() {
                return <Button danger>Remove</Button>
            }
        }
    ];

    const rowSelection: TableRowSelection<StockType> = {
        onChange(selectedKeys) {
            setSelectedKeys(selectedKeys);
        },
        selectedRowKeys,
    }

    return (
        <>
        <Breadcrumb end={list?.name}/>
        <Table rowSelection={rowSelection} rowKey="symbol" columns={columns} dataSource={list?.stocks}>

        </Table>
        </>
    );
}

export default Watchlist;