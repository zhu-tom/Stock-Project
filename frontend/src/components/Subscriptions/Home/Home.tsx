import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space, Switch, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { TableRowSelection } from "antd/lib/table/interface";
import * as React from "react";
import { Link } from "react-router-dom";
import { SubscriptionType } from "../../../types/StockTypes";
import Axios from 'axios';

const Home: React.FC<{subscriptions: SubscriptionType[], handleToggle: (i: number, id: number | string) => void, setSubscriptions: any}> = ({subscriptions, handleToggle, setSubscriptions}) => {
    const [selectedRowKeys, setSelectedKeys]: [React.Key[], any] = React.useState([]);

    const rowSelection: TableRowSelection<SubscriptionType> = {
        onChange(selectedRowKeys) {
            setSelectedKeys(selectedRowKeys);
        },
        selectedRowKeys,
    }

    const columns: ColumnsType<SubscriptionType> = [
        {
            title: "Symbol",
            render(val) {
                return <Link to={`/market/${val.symbol}`}>{val.symbol}</Link>;
            },
            sorter(a, b) {
                return a.symbol < b.symbol ? -1 : 1;
            }
        },
        {
            title: "Name",
            dataIndex: "name",
            sorter(a, b) {
                return a.name < b.name ? -1 : 1;
            }
        },
        {
            title: "Constraints",
            render(val) {
                return `${val.event}%`;
            },
            sorter(a, b) {
                return a.event - b.event;
            }
        },
        {
            title: "Active",
            render(_, record, index) {
                return <Switch checked={record.active} onChange={() => {
                        handleToggle(index, record.id)
                    }
                }/>
            }
        },
        {
            title: "",
            render(_, record) {
                return (
                    <Space>
                        <Link to={`/account/subscriptions/edit/${record.id}`}><Button type="primary" size="small"><EditOutlined/></Button></Link>
                        <Button size="small" type="primary" danger onClick={() => {
                            Axios.delete(`/api/users/bbard1/subscriptions/${record.id}`).then(res => {
                                let copy = [...subscriptions];
                                setSubscriptions(copy.filter(item => item.id !== record.id));
                            });
                        }}><DeleteOutlined/></Button>
                    </Space>
                );
            }
        }
    ];

    return (
        <>
            <Space style={{marginBottom: "16px"}}>
                <Button type="primary"><PlusOutlined/>Add New Event Subscription</Button>
                {selectedRowKeys.length > 0 && <Button type="primary" danger>{`Delete All (${selectedRowKeys.length})`}</Button>}
            </Space>
            <Table rowKey="id" columns={columns} rowSelection={rowSelection} dataSource={subscriptions}/>
        </>
    );
}

export default Home;