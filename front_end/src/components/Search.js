import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Grid2 } from '@mui/material';
import Header from './Navbar';
import React, { useState, useEffect } from 'react';

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { results } = location.state || { results: [] };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set login state when component mounts
  }, []);

  const handleAddToCart = async (productId) => {
    if (isLoggedIn) {
      if (productId !== null) {
        const data = {
          userId: localStorage.getItem('userId', null),
          productId,
          quantity: 1,
        }

        console.log(data)
        try {
          const response = await axios.post(`http://localhost:3003/cart/addproduct_cart`, data, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.status === 200) {
            alert('Add to cart successfull')
          }
        } catch (error) {
          console.log(error?.message);
        }
      }
    } else {
      alert("Login to add cart")
      navigate('/login')
    }
  };

  return (
    <div>
      <Header />
      <div className="search-results-page">
        <h2>Kết quả tìm kiếm</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {results.length > 0 ? (
            results.map((product) => (
              <div key={product._id} className="product-container" onClick={() => navigate(`/products/${product._id}`)}>
                <img
                  src={product.image_product}
                  alt={product.name_product}
                  className="product-image"
                />
                <p className="product-name">{product.name_product}</p>
                                            <div className="product-ratings">
                  <p className="average-rating">
                    {product.averageRating && product.averageRating > 0 ? (
                      <>
                        Đánh giá: {product.averageRating.toFixed(1)}
                        <span style={{ color: '#FFD700', marginLeft: '5px' }}>★</span>
                      </>
                    ) : (
                      'Chưa có đánh giá'
                    )}
                  </p>
                  <p className="total-comments">
                    Bình luận: {product.totalComments || 0}
                  </p>
                </div>
                <p className="product-price">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </p>
                <Grid2
                  className="add-to-cart-btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleAddToCart(product._id);
                  }}
                >
                  Add to Cart
                </Grid2>
              </div>
            ))
          ) : (
            <div>Không tìm thấy sản phẩm nào.</div>
          )}
        </div>
      </div>
    </div>
  );
};



export default SearchResultsPage;
