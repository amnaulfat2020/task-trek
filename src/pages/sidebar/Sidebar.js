import logo from '../../assets/images/side-logo.png';
import React, { useState } from 'react';
import './sidebar.css';
import { Layout, Menu, Button, theme } from 'antd';
import { UserOutlined, FileOutlined, LogoutOutlined, TeamOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import './sidebar.css';
import { useNavigate, useParams } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../utils/constants/Firebase';
import SideImg from '../../assets/images/hamburger.png'
import { CaretRightOutlined, CaretLeftOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const Sidebar = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const items = [
    getItem('Dashboard', 'sub1', <UserOutlined />, null, 'item'),
    {
      type: 'divider',
    },
    getItem('Projects', 'sub2', <FileOutlined />, null, 'item'),
    {
      type: 'divider',
    },
    getItem('Members', 'sub4', <TeamOutlined />, null, 'item'),
     
  ];


  const onClick = (e) => {
    console.log('click ', e);
  };

  return (
    <div className={`side-bar ${collapsed ? 'collapsed' : ''}`}>
      <div className="logo-container">
        <img src={logo} alt="logo" className={`logo ${collapsed ? 'collapsed-logo' : ''}`} />
        <div
          onClick={handleCollapse}
        >
          {collapsed ? <img src={SideImg} alt='side-img' className='w-50 colaps-img cursor' />
            : <img src={SideImg} alt='side-img' className='w-50  mr-10 cursor' />}
        </div>

      </div>
      <div className='mt-100 b-top b-bottom'>
        <Menu
          onClick={onClick}
          style={{
            width: collapsed ? 100 : "100%",
          }}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          items={items}
          onSelect={({ key }) => {
            if (key === 'sub1') {
              navigate(`/dashboard/${userId}`);
            }
            if (key === 'sub2') {
              navigate(`/dashboard/project/${userId}`);
            }
            if (key === 'sub4') {
              navigate(`/members/${userId}`);
            }
          }}
          inlineCollapsed={collapsed}
        />
      </div>

      {collapsed ? <Button className="sidebar-btn" onClick={handleLogout}>
        <LogoutOutlined />
      </Button> : <Button className="sidebar-btn" onClick={handleLogout}>
        <LogoutOutlined /> Logout
      </Button>}

    </div >
  );
};

export default Sidebar;