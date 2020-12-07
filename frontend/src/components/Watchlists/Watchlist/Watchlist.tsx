import { Button, notification, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { TableRowSelection } from 'antd/lib/table/interface';
import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import {StockType, WatchlistType} from '../../../types/StockTypes';
import Breadcrumb from '../../Dashboard/Breadcrumb/Breadcrumb';
import Axios from 'axios';

type Props = {
    watchlists?: WatchlistType[],
    setWatchlists: any,
}

const Watchlist: React.FC<Props> = ({watchlists, setWatchlists}) => {
    const [selectedRowKeys, setSelectedKeys]: [React.Key[], any] = React.useState([]);

    const { id } = useParams<{id: string}>();
    const list = watchlists?.find(val => val._id === id);
    
    const columns: ColumnsType<StockType> = [
        {
            title: "Symbol",
            render(val) {
                return <Link to={`/market/${val.symbol}`}>{val.symbol}</Link>;
            },
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
            title: "Ask/Bid",
            render({current}) {
                return `${current.ask}/${current.bid}`
            },
            sorter(a, b) {
                return a.current.ask - b.current.ask;
            }
        },
        {
            title: "Daily Trades",
            render({daily}) {
                return daily.trades;
            },
            sorter(a, b) {
                return a.daily.trades - b.daily.trades;
            }
        }, 
        {
            title: "",
            render(item, _, stockIndex) {
                return <Button danger onClick={() => {
                    
                    Axios.delete(`/api/me/watchlists/${id}/symbol/${item._id}`).then((data) => {
                        console.log(data.data);
                        setWatchlists(data.data);
                    }).catch(err => {
                        notification.open({
                            message: "Error",
                            description: err.response.data
                        });
                    })
                }}>Remove</Button>
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