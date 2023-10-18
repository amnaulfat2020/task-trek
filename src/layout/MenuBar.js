
import { signOut } from "firebase/auth";
import { auth } from '../utils/constants/Firebase';
import React from 'react';
import { Input, Space, Badge, Avatar, Typography, Menu, Dropdown } from 'antd';
import {
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useSearch } from '../contexts/SearchContext';
import headerStyles from '../styles/headerStyles.js';
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from '../contexts/SearchContext';

const MenuBar = ({ currentPage }) => {
  const { searchQuery, setSearch } = useSearch();
  const navigate = useNavigate();
  const { userData } = useUserContext();
  
  const navigateToUserProfile = () => {
    navigate('/dashboard/user-profile'); 
  };
  const handleClick = () => {
    signOut(auth)
      .then(() => {
        navigate('/')
        console.log("user signed out successfully")
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const menu = (
    <Menu>
      <Menu.Item key="email" icon={<UserOutlined />} onClick={navigateToUserProfile}>
        {userData && userData.email}
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleClick} icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
  };

  const { Text } = Typography;
  return (
    <div style={headerStyles.container}>
      <div style={headerStyles.leftSection}>
        <Link to='/dashboard' style={headerStyles.userLink} >Dashboard</Link>
      </div>
      <div style={headerStyles.centerSection}>
        <Space>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search..."
            style={headerStyles.searchInput}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Space>
      </div>
      <div style={headerStyles.rightSection}>
        <Space size="large">
          <Badge dot>
            <BellOutlined style={headerStyles.icon} />
          </Badge>
          <Dropdown overlay={menu} trigger={['click']}>
            <Avatar icon={<UserOutlined />} style={headerStyles.avatar} />
          </Dropdown>
        </Space>
      </div>
    </div>
  );
};

export default MenuBar;

