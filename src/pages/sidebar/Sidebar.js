// import React, { useEffect, useState } from 'react';
// import { Drawer, Menu, Button } from 'antd';
import {
  HomeOutlined,
  FileOutlined,
  AppstoreAddOutlined,
  ScheduleOutlined,
  TeamOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import AppHeader from "../../layout/MenuBar";

import logo from '../../assets/images/side-logo.png';
// import sidebarStyles from '../../styles/sidebarStyles';
// // import { useNavigate } from 'react-router';

// const Sidebar = ({ menuOpen, toggleMenu }) => {
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {

//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 1025);
//     };


//     handleResize();
//     window.addEventListener('resize', handleResize);


//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);
//   // /const navigate = useNavigate()


//   if (isMobile) {
//     return null;
//   }
// console.log('yo  ma niga')
//   return (
//     <Drawer
//       width={310}
//       placement="left"
//       open={menuOpen}
//       style={sidebarStyles.drawer}
//     >
//       <div style={sidebarStyles.logoContainer}>
//         <img src={logo} alt="Logo" style={sidebarStyles.logo} />
//         <div style={sidebarStyles.taglineContainer}>
//           <div style={sidebarStyles.tagline}>Task Trek</div>
//         </div>
//         <MenuOutlined
//           style={sidebarStyles.menuIcon}
//           onClick={toggleMenu}
//         />
//       </div>

//       <Menu theme="light" className="custom-menu">
//         <Menu.Item key="dashboard" icon={<HomeOutlined />} className="custom-menu-item">
//           Dashboard
//         </Menu.Item>
//         <Menu.Item key="projects" icon={<FileOutlined />} className="custom-menu-item">
//           Projects
//         </Menu.Item>
//         <Menu.Item key="modules" icon={<AppstoreAddOutlined />} className="custom-menu-item">
//           Modules
//         </Menu.Item>
//         <Menu.Item key="sprints" icon={<ScheduleOutlined />} className="custom-menu-item">
//           Sprints
//         </Menu.Item>
//         <Menu.Item key="members" icon={<TeamOutlined />} className="custom-menu-item">
//           Members
//         </Menu.Item>
//         <Menu.Item key="reports" icon={<FileTextOutlined />} className="custom-menu-item">
//           Reports
//         </Menu.Item>
//       </Menu>  
//       <h2>hellpp</h2>
//       <div style={sidebarStyles.logoutButtonContainer}>
//         <Button
//           // onclick={() => { navigate('/') }}
//         >
//           <LogoutOutlined style={{ marginRight: '20px' }} />
//           Logout
//         </Button>
//       </div>
//     </Drawer>
//   );
// };

// export default Sidebar;


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