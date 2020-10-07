import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Switch, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import * as React from "react";
import { SubscriptionType } from "../../../types/StockTypes";

const mock: SubscriptionType[] = [
    {
        name: "Microsoft",
        symbol: "MSFT",
        minChange: 5,
        active: true,
    },
    {
        name: "Apple",
        symbol: "APPL",
        minChange: 14,
        active: false,
    },
    {
        name: "Waste Management",
        symbol: "WMT",
        minChange: 10,
        active: true,
    }
];

const Home = () => {
    const [data, setData] = React.useState(mock);

    const handleChange = (i: number) => {
        setData(data.map((val, index) => {
            if (index === i) {
                return ({
                    ...val,
                    active: !val.active,
                });
            } else {
                return val;
            }
        }))
    }

    const columns: ColumnsType<SubscriptionType> = [
        {
            title: "Symbol",
            dataIndex: "symbol",
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
                return `${val.minChange}%`;
            },
            sorter(a, b) {
                return a.minChange - b.minChange;
            }
        },
        {
            title: "Active",
            render(_, record, index) {
                return <Switch checked={record.active} onChange={() => handleChange(index)}/>
            }
        },
        {
            title: "",
            render() {
                return <Button size="small" type="primary" danger><DeleteOutlined/></Button>
            }
        }
    ];

    return (
        <>
            <Button style={{marginBottom: "16px"}} type="primary"><PlusOutlined/>Add New Event Subscription</Button>
            <Table columns={columns} dataSource={data}/>
        </>
    );
}

export default Home;