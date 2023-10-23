import React, { useState, useEffect } from 'react';
import UserProfilePopup from '../pages/userprofile/index';
import { signOut } from 'firebase/auth';
import { auth, db } from '../utils/constants/Firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Space, Badge, Avatar, Typography, Menu, Dropdown } from 'antd';
import {
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useSearch } from '../contexts/SearchContext';
import headerStyles from '../styles/headerStyles';
const Title = Typography;
const MenuBar = ({ currentPage }) => {
  const { searchQuery, setSearch } = useSearch();
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, 'users', user.email);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserData({ ...userData, email: user.email });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchUserData();
  }, []);

  const handleClick = () => {
    signOut(auth)
      .then(() => {
        navigate('/');
        console.log('User signed out successfully');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => setShowProfilePopup(true)}>
        Profile
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleClick}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
  };

  return (
    <div style={headerStyles.container}>
      <div style={headerStyles.leftSection}>
        {/* <Link to='/project' style={headerStyles.userLink} >Project</Link> 
        */}
        <Title style={headerStyles.userLink}>{currentPage}</Title>
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
          <Avatar icon={<UserOutlined />} style={headerStyles.avatar} />
        </Space>
      </div>
      {showProfilePopup && userData && (
        <UserProfilePopup userData={userData} onClose={() => setShowProfilePopup(false)} />
      )}
    </div>
  );
};

export default MenuBar;
