import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, notification, Space, Switch, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { TableRowSelection } from "antd/lib/table/interface";
import * as React from "react";
import { Link } from "react-router-dom";
import { SubscriptionType } from "../../../types/StockTypes";
import Axios from 'axios';

const Home: React.FC<{subscriptions: SubscriptionType[], handleToggle: (i: number, id: number | string) => void, setSubscriptions: any}> = ({subscriptions, handleToggle, setSubscriptions}) => {
    const [selectedRowKeys, setSelectedKeys]: [React.Key[], any] = React.useState([]);

    const rowSelection: TableRowSelection<SubscriptionType> = {
        onChange(srk) {
            setSelectedKeys(srk);
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
                        handleToggle(index, record._id)
                    }
                }/>
            }
        },
        {
            title: "",
            render(_, record) {
                return (
                    <Space>
                        <Link to={`/account/subscriptions/edit/${record._id}`}><Button type="primary" size="small"><EditOutlined/></Button></Link>
                        <Button size="small" type="primary" danger onClick={() => {
                            Axios.delete(`/api/me/subscriptions/${record._id}`).then(res => {
                                let copy = [...subscriptions];
                                setSubscriptions(copy.filter(item => item._id !== record._id));
                            }).catch(err => {
                                notification.open({
                                    message: "Error",
                                    description: err.response.data
                                });
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
                {selectedRowKeys.length > 0 && 
                    <Button type="primary" danger onClick={() => {
                        selectedRowKeys.forEach(id => {
                            Axios.delete(`/api/me/subscriptions/${id}`).then(res => {
                                let copy = [...subscriptions];
                                setSubscriptions(copy.filter(item => item._id !== id));
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
            </Space>
            <Table rowKey="_id" columns={columns} rowSelection={rowSelection} dataSource={subscriptions}/>
        </>
    );
}

export default Home;