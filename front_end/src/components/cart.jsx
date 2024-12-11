import { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Navbar";
import './Cart.css';

function Cart() {
  const [cartProducts, setCartProducts] = useState([]);
  const userId = localStorage.getItem('userId', null)

  useEffect(() => {
    async function fetchCart() {
      try {
        const response = await axios.get(
          `http://localhost:3003/cart/${userId}`
        );
        if (response.status === 200) setCartProducts(response.data?.products);
      } catch (error) {
        alert(`Lỗi khi hiển thị sản phẩm trong giỏ hàng: ${error}`);
      }
    }
    fetchCart();
  }, [userId]);

  const [selectedProducts, setSelectProducts] = useState([]);

  const handleSelectProduct = (product) => {
    const isSelected = selectedProducts.some(
      (item) => item.productId._id === product.productId._id
    );

    if (isSelected) {
      const nextProductList = selectedProducts.filter(
        (productItem) => productItem.productId._id !== product.productId._id
      );
      setSelectProducts(nextProductList);
    } else {
      setSelectProducts([...selectedProducts, product]);
    }
  };

  function totalMoney(productList) {
    return productList.reduce(
      (total, product) => total + product?.productId?.price * product.quantity,
      0
    );
  }

  async function handlePayment() {
    if (selectedProducts.length > 0) {
      // Điều hướng người dùng đến trang thanh toán, có thể truyền dữ liệu sản phẩm
      try {
        const total = totalMoney(selectedProducts)
        const newPayment = {
          userId,
          products: selectedProducts,
          amount: total,
          bankCode: null,
          language: "vn"
        }
        console.log(newPayment)
        const response = await axios.post('http://localhost:3003/vnpay/create_payment_url', newPayment)
        if (response.status === 200 && response.data) {
          window.location.href = response.data.paymentUrl;
        }
      } catch (error) {
        alert(`Lỗi: ${error}`)
      }
    } else {
      alert("Bạn chưa chọn sản phẩm để thanh toán!");
    }
  };

  const handleRemoveProduct = async (product) => {
    try {
      const productId = product.productId

      const response = await axios.post('http://localhost:3003/cart/delete_product_cart', {
        userId,
        productId
      })

      if (response.status === 200) {
        setCartProducts((prevProducts) =>
          prevProducts.filter((p) => p.productId !== productId))
      }
    } catch (error) {
      console.error('Error delete product:', error);
    }
  };

  const handleIncrease = async (product) => {
    const updatedQuantity = product.quantity + 1;
  
    try {
      const updatedProducts = cartProducts.map((item) =>
        item.productId._id === product.productId._id
          ? { ...item, quantity: updatedQuantity }
          : item
      );
  
      const response = await axios.post('http://localhost:3003/cart/update', {
        userId,
        products: updatedProducts.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
        })),
      });
  
      if (response.status === 200) {
        setCartProducts(updatedProducts);
      }
    } catch (error) {
      console.error('Error updating product quantity:', error);
    }
  };
  
  const handleDecrease = async (product) => {
    const updatedQuantity = Math.max(product.quantity - 1, 0);
  
    try {
      const updatedProducts = cartProducts.map((item) =>
        item.productId._id === product.productId._id
          ? { ...item, quantity: updatedQuantity }
          : item
      );
  
      const response = await axios.post('http://localhost:3003/cart/update', {
        userId,
        products: updatedProducts.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
        })),
      });
  
      if (response.status === 200) {
        setCartProducts(updatedProducts);
      }
    } catch (error) {
      console.error('Error updating product quantity:', error);
    }
  };  



  return (
    <>
      <Header />
      <div className="cart-container">
        <ul className="cart-table">
          <h2>Giỏ hàng</h2>
          <table>
            <tbody>
              {cartProducts?.length > 0 ? (
                cartProducts.map((product, key) => (
                  <tr className="cart-product" key={key}>
                    <td>
                      <input
                        type="checkbox"
                        className="checkbox"
                        size="large"
                        onChange={() => handleSelectProduct(product)}
                        checked={selectedProducts.some(
                          (item) => item.productId._id === product.productId._id
                        )}
                      />
                    </td>
                    <td>
                      <img
                        src={product?.productId.image_product}
                        alt={product?.productId.name_product}
                      />
                    </td>
                    <td>
                      <p>{product?.productId.name_product}</p>
                    </td>
                    <td>
                      <p className="product-price">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product?.productId?.price)}
                      </p>
                    </td>
                    <td>
                      <button onClick={() => handleDecrease(product)}>-</button>
                      <span>{product?.quantity}</span>
                      <button onClick={() => handleIncrease(product)}>+</button>
                    </td>
                    <td>
                      <p className="remove" onClick={() => handleRemoveProduct(product)}>
                        Xóa
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <>Giỏ hàng trống</>
              )}
            </tbody>
          </table>
        </ul>
        <ul className="selected-products-table">
          <h2>Các sản phẩm đã chọn</h2>
          <table>
            <tbody>
              {selectedProducts?.length > 0 ? (
                selectedProducts.map((product, key) => (
                  <tr key={key}>
                    <td>
                      <img
                        src={product?.productId.image_product}
                        alt={product?.productId.name_product}
                      />
                    </td>
                    <td>
                      <p>{product?.productId.name_product}</p>
                    </td>
                    <td>
                      <p className="product-price">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product?.productId?.price)}
                      </p>
                      <span>SL: {product?.quantity}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <>Chưa có sản phẩm được chọn</>
              )}
            </tbody>
          </table>
          <h3 className="total-money">
            Tổng số tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalMoney(selectedProducts))}
          </h3>
          {selectedProducts.length > 0 && (
            <button className="payment-button" onClick={handlePayment}>
              Thanh toán
            </button>
          )}
        </ul>
      </div>
    </>
  );
}

export default Cart;
