import React, { useContext } from 'react';
import { Input, Space, Badge, Avatar, Typography } from 'antd';
import {
  SearchOutlined,
  BellOutlined,
  MessageOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import headerStyles from '../styles/headerStyles.js';
import { useNavigate } from 'react-router-dom';
const { Text } = Typography;

const MenuBar = () => {
  const navigate = useNavigate()
  return (
    <div style={headerStyles.container}>
      <div style={headerStyles.leftSection}>
        <h1 style={headerStyles.pageTitle}>Dahsboard</h1>
      </div>

      <div style={headerStyles.centerSection}>
        <Space>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search..."
            style={headerStyles.searchInput}
          />
        </Space>
      </div>

      <div style={headerStyles.rightSection}>
        <Space size="large">
          <MessageOutlined style={headerStyles.icon} />

          <Badge dot>
            <BellOutlined style={headerStyles.icon} />
          </Badge>

          <SettingOutlined style={headerStyles.icon} />
          <Avatar icon={<UserOutlined />} style={headerStyles.avatar} onClick={() => {
            navigate('./user-profile')
          }} />
        </Space>
        <Text>Moiz</Text>
        <Text>Email</Text>
      </div>
    </div>
  );
};

export default MenuBar;