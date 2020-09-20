import { Layout } from 'antd';
import React, { useState } from 'react';
import './App.css';
import Sider from './components/Dashboard/Sider/Sider';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';



function App() {
  const [siderCollapsed, setSiderCollapsed] = useState(false);
  return (
    <>
    <Layout>
      <Sider collapsed={siderCollapsed} setCollapsed={setSiderCollapsed}/>
      <Layout>
          <Header siderCollapsed={siderCollapsed} setSiderCollapsed={setSiderCollapsed} />
          <Layout.Content style={{height: '150vh'}}>
            
          </Layout.Content>
          <Footer/>
      </Layout>
      
    </Layout>
    </>
  );
}

export default App;
