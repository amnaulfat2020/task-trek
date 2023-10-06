import { updateProfile, signOut } from "firebase/auth";
import { auth } from '../utils/constants/Firebase';
import React, { useContext } from 'react';
import { Input, Space, Badge, Avatar, Typography, Menu, Dropdown } from 'antd';
import {
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  PlusOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useSearch } from '../contexts/SearchContext'; // Import the useSearch hook
import headerStyles from '../styles/headerStyles.js';
import { Link, useNavigate } from "react-router-dom";


const MenuBar = ({ currentPage }) => {
  const { searchQuery, setSearch } = useSearch(); // Access the searchQuery and setSearch from the context
  const navigate = useNavigate();
  const handleClick = () => {
    signOut(auth)
      .then(() => {
        navigate('/')
        console.log("user signedout successfully")
      })
      .catch((err) => {
        console.log(err);
      });
  }


  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="logout"
        onClick={handleClick}
        icon={<LogoutOutlined />}>
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