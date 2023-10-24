import {
  FileOutlined,
  TeamOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import AppHeader from "../../layout/MenuBar";
import logo from '../../assets/images/side-logo.png';
import React, { useState } from 'react';
import {
  UserOutlined,
} from '@ant-design/icons';
import './sidebar.css'
import { Layout, Menu, Button, theme } from 'antd';
import Project from '../project/Project';
import { useNavigate } from 'react-router-dom';
const { Sider } = Layout;
const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate()
  console.log('yo ma nigga')
  return (
    <Layout className='layout-container'>

      <Sider trigger={null} collapsible collapsed={collapsed} className='sider-shapatar'>
        <img src={logo} alt="Logo" className='logo' />

        <div className="demo-logo-vertical" />
        <div className='flex-control'>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={['1']}
            className='one'
            items={[
              {
                key: '1',
                icon: <UserOutlined />,
                label: 'Dashboard',
              },
              {
                key: '2',
                icon: <FileOutlined />,
                label: 'Projects',
              },
              {
                key: '3',
                icon: <TeamOutlined />,
                label: 'Members',
              },
            ]}
          />
          <Button
            className='sidebar-btn'
          >
            <LogoutOutlined onclick={() => {
              console.log('yo ma nigga')
              navigate('/')
            }} style={{ marginRight: '20px' }} />
            Logout
          </Button>
        </div>

      </Sider>
      <Layout>
        <AppHeader />
        <Project />

      </Layout>
    </Layout>
  );
};
export default Sidebar;