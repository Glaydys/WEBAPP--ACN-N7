import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import './styles/global.css';  
import Product from './components/category_details';
import Productdetails from './components/product_details';
import Cart from './components/cart';
import SearchResultsPage from './components/Search';

function App() {
  return (
    <Router>  
      <Routes> 
        <Route path="/" element={<HomePage />} /> 
        <Route path="/products" element={<Product />} />
        <Route path="/products/:id" element={<Productdetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search-results" element={<SearchResultsPage />} />
        </Routes>
    </Router>
  );
}

export default App;
