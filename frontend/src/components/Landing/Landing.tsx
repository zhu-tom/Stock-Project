import { Layout } from 'antd';
import * as React from 'react';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';

const Landing: React.FC<{children: React.ReactNode}> = ({children}) => {
    return (
        <Layout style={{height: '100vh'}}>
            <Navbar/>
            <Layout.Content>
                {children}
            </Layout.Content>
            <Footer/>
        </Layout>
    );
};

export default Landing;