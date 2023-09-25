import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from './pages/sidebar/Sidebar';
import Header from './pages/Header';

const { Content } = Layout;

function App() {
  const [menuOpen, setMenuOpen] = useState(true);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const currentPage = 'Dashboard'; 
  return (
    <Layout>
      <Sidebar menuOpen={menuOpen} toggleMenu={toggleMenu} />
      <Layout>
        <Header currentPage={currentPage} />
        <Content>Content goes here</Content>
      </Layout>
    </Layout>
  );
}

export default App;