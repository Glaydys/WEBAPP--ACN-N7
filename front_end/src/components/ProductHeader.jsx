import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

// Import các hình ảnh
import headphoneImage1 from '../assets/16.png';
import headphoneImage2 from '../assets/17.png';
import headphoneImage3 from '../assets/18.png';
import headphoneImage4 from '../assets/19.png';


function Header() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const slides = [headphoneImage1, headphoneImage2, headphoneImage3,headphoneImage4];

  const prevSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
  
    return () => clearInterval(interval);
  }, [slides.length]);  

  return (
    <div className="slideshow-container">
      {/* Nút Trái */}
      <button className="nav-button left" onClick={prevSlide}>
        ❮
      </button>

      {/* Hình nền */}
      <div
        className="background-image"
        style={{ backgroundImage: `url(${slides[currentImageIndex]})` }}
      >
        {currentImageIndex === 0 && (
          <div className="content">
            <h1 className="product-title">iPhone 16</h1>
            <p className="product-subtitle">The Biggest Upcoming Sales Events</p>
            <div className="button-container">
              <button
                className="learn-more-btn"
                onClick={() => navigate('/products/67089ad609136ebff0d348c8')}
              >
                Learn More
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Nút Phải */}
      <button className="nav-button right" onClick={nextSlide}>
        ❯
      </button>
    </div>
  );
}

export default Header;
