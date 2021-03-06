import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Modal, notification, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table';
import { TableRowSelection } from 'antd/lib/table/interface';
import Axios from 'axios';
import * as React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { WatchlistType } from "../../../types/StockTypes";

type Props = {
    watchlists?: WatchlistType[],
    setWatchlists: any,
}

const Home: React.FC<Props> = ({watchlists, setWatchlists}) => {
    const [selectedRowKeys, setSelectedKeys]: [React.Key[], any] = React.useState([]);
    const [isVisible, setIsVisible] = React.useState(false);
    const [watchlistName, setWatchlistName] = React.useState("");
    const { path } = useRouteMatch();

    const columns: ColumnsType<any> = [
        {
            title: "Name",
            render(val: WatchlistType) {
                return <Link to={`${path}/${val._id}`}>{val.name}</Link>
            }
        },
        {
            title: "# Stocks",
            render(val: WatchlistType) {
                return val.stocks?.length;
            }
        },
        {
            title: "",
            render(val: WatchlistType) {
                return <Button danger size="small" type="primary" 
                        onClick={() => {
                            Axios.delete(`/api/me/watchlists/${val._id}`).then(res => {
                                setWatchlists(res.data);
                            }).catch(err => {
                                notification.open({
                                    message: "Error",
                                    description: err.response.data
                                });
                            });
                        }}><DeleteOutlined/></Button>
            }
        }
    ];

    const rowSelection: TableRowSelection<any> = {
        onChange(selectedKeys) {
            setSelectedKeys(selectedKeys);
        },
        selectedRowKeys,
    }

    const handleOk = () => {
        Axios.post("/api/me/watchlists", {name: watchlistName}).then(res => {
            setWatchlists(res.data);
        }).catch(err => {
            notification.open({
                message: "Error",
                description: err.response.data
            });
        });
        setIsVisible(false);
        setWatchlistName("");
    }

    return (
        <>
            <Modal title="New Watchlist" visible={isVisible} onOk={handleOk} onCancel={() => setIsVisible(false)}>
                <Input placeholder="Watchlist Name" value={watchlistName} onChange={({target}) => setWatchlistName(target.value)}/>
            </Modal>
            <Button onClick={() => setIsVisible(true)} style={{marginBottom: "16px"}} type="primary"><PlusOutlined/>Create A New Watchlist</Button>
            {selectedRowKeys.length > 0 && 
                <Button danger type="primary" onClick={() => {
                    selectedRowKeys.forEach(id => {
                        Axios.delete(`/api/me/watchlists/${id}`).then(res => {
                            setWatchlists(res.data);
                        }).catch(err => {
                            notification.open({
                                message: "Error",
                                description: err.response.data
                            });
                        }).finally(() => {
                            setSelectedKeys([]);
                        });
                    });
                }}>{`Delete All (${selectedRowKeys.length})`}</Button>}
            <Table rowKey="_id" rowSelection={{type: 'checkbox', ...rowSelection}} dataSource={watchlists} columns={columns}>
            </Table>
        </>
    );
}

export default Home;