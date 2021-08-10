import React, {useState} from 'react';
import './App.css';
import {FileUpload} from './components'
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function App() {

  const [collapsed,setCollapsed]= useState(false);
  const [func, setFunc]= useState("ic");

  const onCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (

    <Layout style={{ minHeight: '100vh', maxWidth: '100vw', overflowX: 'hidden' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['2']} mode="inline">
            <Menu.Item key="1" icon={<PieChartOutlined />} onClick={()=>{setFunc("ss");}}>
              Semantic Image Segmentation
            </Menu.Item>
            <Menu.Item key="2" icon={<PieChartOutlined />} onClick={()=>{setFunc("ic");}}>
              Image Classification
            </Menu.Item>
            
            
            <Menu.Item key="9" icon={<FileOutlined />}>
              Files
            </Menu.Item>
          </Menu>
        </Sider>
        
          {/* <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              Bill is a cat.
            </div>
          </Content> */}
          <div className="conatiner text-center mt-3 w-100">
            <h3 className=" display-4 text-center mb-4">
              Image Processing NESAC
            </h3>
            
            <FileUpload func={func}/>
          
          <Footer style={{ textAlign: 'center' }}>PS1 NESAC ML/DL team</Footer>
          </div>
      </Layout>
    
  );
}

export default App;
