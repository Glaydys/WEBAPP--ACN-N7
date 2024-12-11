import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/header';
import Dashboard from './components/dashboard';
import Products from './views/products';
import styled from 'styled-components';
import ReviseProducts from './views/reviseProduct';
import FormAddProduct from './views/FormAddProduct';
import Users from './views/UsersList';
import Category from './views/category';
import FormAddCategory from './views/FormAddCategory';
import ReviseCategory from './views/reviseCategory';
import OrdersList from './views/OrdersList';

const MainContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Content = styled.div`
  flex-grow: 1;
  padding: 20px;
`;

function App() {
  return (
    <Router>
      <Header />
      <MainContainer>
        <Sidebar />
        <Content>
          <Routes>
            <Route path="/users" element={<Users />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/reviseProduct/:productId" element={<ReviseProducts />} />
            <Route path="/products/FormAddProduct" element={<FormAddProduct />} />
            <Route path="/categories" element={<Category />} />
            <Route path="/reviseCategory/:categoryId" element={<ReviseCategory />} />
            <Route path="/categories/FormAddCategory" element={<FormAddCategory />} />
            <Route path="/orders" element={<OrdersList />} />
          </Routes>
        </Content>
      </MainContainer>
    </Router>
  );
}

export default App;
