import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 200px;
  height: auto;
  background-color: #333;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin: 0;
`;

const SidebarItem = styled(Link)`
  color: #fff;
  text-decoration: none;
  margin-bottom: 20px;
  &:hover {
    color: #f0a500;
     padding: 0;
  }
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <h2>Admin Dashboard</h2>
      <SidebarItem to="/dashboard">Dashboard</SidebarItem>
      <SidebarItem to="/products">Products</SidebarItem>
      <SidebarItem to="/orders">Orders</SidebarItem>
      <SidebarItem to="/users">Users</SidebarItem>
      <SidebarItem to="/categories">Category</SidebarItem>
    </SidebarContainer>
  );
};

export default Sidebar;
