import React, { useState, useEffect } from 'react';
import './Navbar.css';
import search from '../assets/search.png';
import Person from '@mui/icons-material/Person';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CartIcon = () => {
  const navigate = useNavigate();
  const [cartProduct, setcartProduct] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (isLoggedIn) {
      async function fetchCartProduct() {
        const userId = localStorage.getItem('userId', null);
        try {
          const response = await axios.get(`http://localhost:3003/cart/${userId}`);
          if (response.status === 200) setcartProduct(response.data);
        } catch (error) {
          console.log('Error fetching carts:', error.message);
        }
      }
      fetchCartProduct();
    }
  }, [isLoggedIn]);

  const productCount = cartProduct?.products?.length || 0;

  return (
    <div className="icon-container">
      <IconButton
        onClick={() => {
          if (isLoggedIn) {
            navigate('/cart');
          } else {
            alert("Login to view cart");
            navigate('/login');
          }
        }}
        size="large"
        color="inherit"
      >
        <Badge badgeContent={productCount} color="error">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
    </div>
  );
};

const SearchField = () => {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (searchText.trim()) {
      try {
        const response = await axios.get(`http://localhost:3003/searchs/products/search?query=${searchText}`);
        console.log('Search Results:', response.data);
        navigate('/search-results', { state: { results: response.data } });
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Tìm kiếm..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="search-input"
      />
      <button className="search-button" onClick={handleSearch}>
        <img src={search} alt="Search Icon" className="search-icon" />
      </button>
    </div>
  );
};

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleProfileClick = () => {
    navigate(isLoggedIn ? '/profile' : '/login');
  };

  return (
    <div className="main-header">
      <div className="header-left">
        <div className="logo" onClick={() => navigate('/')}>
          OHMN
        </div>
      </div>

      <div className="header-center">
        <SearchField />
      </div>

      <div className="header-right">
        <CartIcon />
        <Person
          onClick={handleProfileClick}
          style={{ cursor: 'pointer', color: 'white' }}
        />
        <span
          className="login-text"
          onClick={handleProfileClick}
          style={{ cursor: 'pointer' }}
        >
          {isLoggedIn ? 'Profile' : 'Đăng nhập'}
        </span>
      </div>
    </div>
  );
};

export default Header;
