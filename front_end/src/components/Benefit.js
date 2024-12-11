import React from 'react';
import './Benefit.css';
import freeship from '../assets/freeship.png';
import money from '../assets/money.png';
import phone from '../assets/phone.png';
import secure from '../assets/secure.png';

function Benefit() {
  return (
    <div className="benefit">
      <div className="benefit-item">
        <img src={freeship} alt="freeship" />
        <p>Free Shipping</p>
        <span>Free delivery for all orders</span>
      </div>
      <div className="benefit-item">
        <img src={money} alt="money" />
        <p>Money Guarantee</p>
        <span>30 days money back</span>
      </div>
      <div className="benefit-item">
        <img src={phone} alt="phone" />
        <p>24/7 Support</p>
        <span>Friendly 24/7 support</span>
      </div>
      <div className="benefit-item">
        <img src={secure} alt="secure" />
        <p>Secure Payment</p>
        <span>All cards accepted</span>
      </div>
    </div>
  );
}

export default Benefit;
