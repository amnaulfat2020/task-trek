import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../utils/constants/Firebase';
import { Card, Input, List, Avatar, Typography } from 'antd';
import './Member.css'; 
const { Search } = Input;

const Member = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const querySnapshot = await getDocs(usersCollection);
        const userData = querySnapshot.docs.map((doc) => doc.data());
        setUsers(userData);
      } catch (error) {
        console.error('Error fetching users: ', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.firstName && user.firstName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, users]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div>
      <h1>Members</h1>
      <Search
        placeholder="Search members..."
        onSearch={handleSearch}
        style={{ width: 400 }}
      />
      <List
        itemLayout="horizontal"
        dataSource={filteredUsers}
        renderItem={(user) => (
          <Card style={{ marginBottom: 16 }}>
            <Avatar
              size={50}
              style={{
                backgroundColor: '#125bc1', 
                color: 'white', 
              }}
            >
              {user.firstName.charAt(0).toUpperCase()}
            </Avatar>
            <div className="user-details">
              <Typography.Title level={4}>{user.firstName}</Typography.Title>
              <Typography.Text>{user.email}</Typography.Text>
            </div>
          </Card>
        )}
      />
    </div>
  );
};

export default Member;
