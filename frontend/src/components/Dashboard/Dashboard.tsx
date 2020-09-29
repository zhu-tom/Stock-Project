import { Layout } from 'antd';
import * as React from 'react';
import Footer from '../Footer/Footer';
import Header from './Header/Header';
import Sider from './Sider/Sider';

type Props = {
    children: React.ReactNode,
}

const Dashboard: React.FC<Props> = ({children}) => {
    const [siderCollapsed, setSiderCollapsed] = React.useState(false);

    return (
        <Layout>
            <Sider collapsed={siderCollapsed} setCollapsed={setSiderCollapsed}/>
            <Layout style={{minHeight: '100vh'}}>
                <Header siderCollapsed={siderCollapsed} setSiderCollapsed={setSiderCollapsed} />
                <Layout.Content>
                    {children}
                </Layout.Content>
                <Footer/>
            </Layout>
        </Layout>
    );
};

export default Dashboard;