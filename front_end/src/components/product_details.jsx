import axios from 'axios';
import { Grid } from '@mui/material';
import './Category.css';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "./Navbar";
import Benefit from "./Benefit"
import Footer from "./Footer"
import CommentSection from './CommentSection';
import { FaStar } from 'react-icons/fa';

function Productdetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await axios.get(`http://localhost:3003/products/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (response.status === 200) setProduct(response.data);
            } catch (error) {
                console.log(error?.message);
            }
        }
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
        fetchProduct();
    }, [id]);

    useEffect(() => {
        async function fetchSimilarProducts() {
            if (product?.category_id) {
                try {
                    const response = await axios.get(`http://localhost:3003/products/similar/${product.category_id}`);
                    if (response.status === 200) setSimilarProducts(response.data);
                } catch (error) {
                    console.log('Lỗi khi tải sản phẩm tương tự:', error?.message);
                }
            }
        }
        fetchSimilarProducts();
    }, [product?.category_id]);

        const handleAddToCart = async (productId) => {
        if (isLoggedIn) {
            if (productId !== null) {
                const inputQuantity = parseInt(document.getElementById("soluong").value, 10);
                if (inputQuantity > product.quantity) {
                    alert("Vượt quá số lượng trong kho");
                    return;
                }
    
                const data = {
                  userId: localStorage.getItem('userId', null),
                  productId,
                  quantity: inputQuantity
                }
                console.log(data)
                  try {
                    const response = await axios.post(`http://localhost:3003/cart/addproduct_cart`, data,{
                      headers: {
                        "Content-Type": "application/json",
                        },
                    });
                    if (response.status === 200) {
                        alert('Thêm vào giỏ hàng thành công');
                    }
                } catch (error) {
                    console.log(error?.message);
                }
            }
        } else {
            alert("Đăng nhập để thêm sản phẩm vào giỏ hàng");
            navigate('/login');
        }
    };

    const renderProduct = (product, onAddToCart, navigate) => (
        <Grid
              key={product._id}
        onClick={() => {
            navigate(`/products/${product._id}`);
            window.location.reload(); 
        }}
        style={{ cursor: 'pointer' }}
    >
            <div className="similarProductCard">
                <div className="similarProductImageWrapper">
                    <img
                        src={product.image_product}
                        alt={product.name_product}
                        className="similarProductImage"
                    />
                </div>
                <p className="similarProductName">{product.name_product}</p>
                <p className="similarProductPrice">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </p>
                <div className="similarProductRatings">
                    <p className="product-rating">
    {product.averageRating && product.averageRating > 0 ? (
        <>
            {product.averageRating.toFixed(1)} <span style={{ color: '#FFD700' }}>★</span>
        </>
    ) : (
        'Chưa có đánh giá'
    )}
</p>

                    <p className="product-comments">
    {product.totalComments || 0} Bình luận
</p>

                </div>
            </div>
        </Grid>
    );
    
    return (
        <>
            <Header />
            <div className="productDetailWrapper">
                {product && (
                    <>
                        <div className="productDetailWrapper">
                            {product && (
                                <>
                                    <div className="productDetailContent">
                                        <div className="productImageWrapper">
                                            <img
                                                src={product.image_product}
                                                alt={product.name_product}
                                                className="productImage"
                                            />
                                        </div>

                                        <div className="productInfoWrapper">
                                            <h1 className="productTitle">{product.name_product}</h1>

                                            <div className="productRatings">
                                                <p className="averageRating">
                                                    {product.averageRating && product.averageRating > 0 ? (
                                                        <>
                                                            Đánh giá trung bình: {product.averageRating.toFixed(1)} / 5
                                                            <FaStar style={{ color: '#FFD700', marginLeft: '5px' }} />
                                                        </>
                                                    ) : (
                                                        'Chưa có đánh giá'
                                                    )}
                                                </p>
                                                <p className="totalComments">
                                                    Tổng số bình luận: {product.totalComments || 0}
                                                </p>
                                            </div>

                                            <p className="productCost">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                            </p>
                                            <p className="shipping">
                                                <label>Vận Chuyển: Miễn phí vận chuyển</label>
                                            </p>
                                            <p className="productQuantity">
                                                <label>Số sản phẩm còn lại: </label>
                                                {product.quantity}
                                            </p>

                                            <div className="optionRow">
                                                <label>Số lượng:</label>
                                                <input type="number" name="quantity" id="soluong" min="1" defaultValue="1" />
                                            </div>

                                            <div className="productActionButtons">
                                                <button onClick={() => handleAddToCart(product?._id)} className="addToCartButton">
                                                    Thêm Vào Giỏ Hàng
                                                </button>
                                                <button className="buyNowButton">Mua Ngay</button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="productDescriptionWrapper">
                            <h2>Mô Tả Sản Phẩm</h2>
                            <p className="productDescription">{product.description}</p>
                        </div>
                    </>
                )}
            </div>

            <CommentSection productId={id} />
            <div className="similarProductsWrapper">
            <h2>Sản Phẩm Tương Tự</h2>
            <div className="similarProductsSlider">
            {similarProducts.map((similarProduct) =>
                    renderProduct(similarProduct, handleAddToCart, navigate)
                    )}
            </div>
            </div>
<Benefit/>
<Footer/></>

    );
}
export default Productdetails;
