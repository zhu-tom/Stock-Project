import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Table } from 'antd'
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
                return <Link to={`${path}/${val.id}`}>{val.name}</Link>
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
            render() {
                return <Button danger size="small" type="primary"><DeleteOutlined/></Button>
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
        Axios.post("/api/users/bbard1/watchlists", {name: watchlistName}).then(res => {
            setWatchlists(watchlists?.concat([res.data]));
        })
        setIsVisible(false);
        setWatchlistName("");
    }

    return (
        <>
            <Modal title="New Watchlist" visible={isVisible} onOk={handleOk} onCancel={() => setIsVisible(false)}>
                <Input placeholder="Watchlist Name" value={watchlistName} onChange={({target}) => setWatchlistName(target.value)}/>
            </Modal>
            <Button onClick={() => setIsVisible(true)} style={{marginBottom: "16px"}} type="primary"><PlusOutlined/>Create A New Watchlist</Button>
            {selectedRowKeys.length > 0 && <Button danger type="primary">{`Delete All (${selectedRowKeys.length})`}</Button>}
            <Table rowKey="id" rowSelection={{type: 'checkbox', ...rowSelection}} dataSource={watchlists} columns={columns}>
            </Table>
        </>
    );
}

export default Home;