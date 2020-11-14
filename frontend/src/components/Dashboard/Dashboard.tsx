import { Layout } from 'antd';
import Axios from 'axios';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Header from './Header/Header';
import Sider from './Sider/Sider';

type Props = {
    children: React.ReactNode,
}

const Dashboard: React.FC<Props> = ({children}) => {
    const [siderCollapsed, setSiderCollapsed] = React.useState(false);

    const history = useHistory();

    React.useEffect(() => {
        Axios.get("/auth").then(res => {
            if (!res.data.loggedin) {
                history.push("/login");
            }
        })
    }, [history]);

    return (
        <Layout>
            <Sider collapsed={siderCollapsed} setCollapsed={setSiderCollapsed}/>
            <Layout style={{minHeight: '100vh'}}>
                <Header siderCollapsed={siderCollapsed} setSiderCollapsed={setSiderCollapsed} />
                <Layout.Content style={{padding: '16px'}}>
                    {children}
                </Layout.Content>
                <Footer/>
            </Layout>
        </Layout>
    );
};

export default Dashboard;