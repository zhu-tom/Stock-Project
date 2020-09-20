import { Divider, Layout, Space, Typography } from 'antd';
import * as React from 'react';

const Footer: React.FC<{}> = () => {
    return (
        <Layout.Footer>
            <Divider/>
            <Space style={{float: 'right'}}>
                <Typography.Text>Made by <Typography.Link href="https://zhutom.com" target="_blank">Tom Zhu</Typography.Link></Typography.Text>
            </Space>
        </Layout.Footer>
    );
}

export default Footer;