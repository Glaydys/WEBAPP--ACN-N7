import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './revise.css';

const ReviseProducts = () => {
  const { productId } = useParams(); // Lấy productId từ URL
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    category_id: '',
    name_product: '',
    description: '',
    price: '',
    quantity: '',
    image_product: null // Thay đổi để lưu hình ảnh như một đối tượng
  });

  // Lấy thông tin sản phẩm khi component được mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3003/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [productId]);

  // Xử lý thay đổi trên input
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input name: ${name}, Input value: ${value}`); // Ghi log giá trị đầu vào
    setProduct((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value,
    }));
  };

  // Xử lý thay đổi file hình ảnh
  const handleFileChange = (e) => {
    setProduct((prev) => ({
      ...prev,
      image_product: e.target.files[0], // Lưu file hình ảnh để upload
    }));
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(product).forEach(key => {
        formData.append(key, product[key]);
      });

      // Gửi yêu cầu PUT để cập nhật sản phẩm
      await axios.put(`http://localhost:3003/products/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Cập nhật sản phẩm thành công');
      navigate('/products');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Chỉnh sửa sản phẩm</h1>

        <label htmlFor="category_id">Mã danh mục:</label>
        <input
          type="number"
          id="category_id"
          name="category_id"
          value={product.category_id}
          onChange={handleChange}
          required
        /><br /><br />

        <label htmlFor="name_product">Tên sản phẩm:</label>
        <input
          type="text"
          id="name_product"
          name="name_product"
          value={product.name_product}
          onChange={handleChange}
          required
        /><br /><br />

        <label htmlFor="description">Mô tả sản phẩm:</label>
        <textarea
          id="description"
          name="description"
          value={product.description}
          onChange={handleChange}
        ></textarea><br /><br />

        <label htmlFor="price">Giá sản phẩm:</label>
        <input
          type="number"
          id="price"
          name="price"
          value={product.price}
          onChange={handleChange}
          required
        /><br /><br />

        <label htmlFor="quantity">Số lượng:</label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={product.quantity}
          onChange={handleChange}
          required
        /><br /><br />

        <label htmlFor="image_product">
          Chọn hình ảnh mới:
          <br />
          {product.image_product && typeof product.image_product === 'string' && (
            <div>
              <br />
              <img
                src={product.image_product}
                alt="Product"
                style={{ width: '200px', height: 'auto', display: 'block', marginBottom: '10px' }}
              />
            </div>
          )}
          <input
            type="file"
            id="image_product"
            name="image_product"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
        <br /><br />

        <button type="submit">Lưu sản phẩm</button>
      </form>
    </div>
  );
};

export default ReviseProducts;
