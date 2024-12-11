import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './products.css';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3003/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Hàm xử lý xóa sản phẩm
  const handleDelete = async (productId) => {
    try {
      console.log('Product ID:', productId); // Kiểm tra xem productId có đúng không
      const response = await axios.delete(`http://localhost:3003/products/${productId}`);

      if (response.status === 200) {
        // Xóa sản phẩm khỏi mảng `products` sau khi đã xóa thành công
        setProducts(products.filter(product => product.product_id !== productId));
        alert('Sản phẩm đã được xóa thành công!');
      } else {
        // Nếu có vấn đề khác từ server
        alert('Lỗi khi xóa sản phẩm!');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Lỗi khi xóa sản phẩm!');
    }
  };

  return (
    <div>
      <button onClick={() => { navigate('/products/FormAddProduct') }}>Add</button> {/* Gọi hàm handleAddProduct */}
      <h2>Product Management</h2>
      <table>
        <thead>
          <tr>
            <th>Category ID</th>
            <th>Name product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Description</th>
            <th>Image</th>
            <th>Revise</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.category_id}</td>
              <td>{product.name_product}</td>
              <td>
                {product.price !== undefined && product.price !== null
                  ? product.price.toLocaleString('vi-VN') + ' VNĐ'
                  : 'Price not available'}
              </td>
              <td>{product.quantity}</td>
              <td>{product.description}</td>
              <td>
                <img src={`${product.image_product}`} alt={product.name_product} style={{ width: '100px' }} />
              </td>
              <td>
                <button onClick={() => navigate(`/reviseProduct/${product._id}`)}>Revise</button>
              </td>
              <td>
                <button onClick={() => handleDelete(product._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
