import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Header from '../components/ProductHeader';
import Benefit from '../components/Benefit';
import Category from '../components/Category';

function HomePage() {
  return (
    <div>
      <Navbar />
      <Header/>
      <Category/>
      <Benefit />
      <Footer />
    </div>
  );
}

export default HomePage;
