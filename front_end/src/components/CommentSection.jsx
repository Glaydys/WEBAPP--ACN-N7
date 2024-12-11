import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa'; // Import biểu tượng sao từ react-icons
import { useNavigate } from 'react-router-dom';
import './Category.css';

function CommentSection({ productId }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [totalComments, setTotalComments] = useState(0); // State cho tổng số bình luận
    const [averageRating, setAverageRating] = useState(0); // State cho đánh giá trung bình
    const navigate = useNavigate();

    // Lấy danh sách bình luận và dữ liệu bổ sung từ server
    useEffect(() => {
    async function fetchComments() {
        try {
            const response = await axios.get(`http://localhost:3003/rate/rate/${productId}`, {
                headers: { "Content-Type": "application/json" },
            });

            console.log(response.data); 
            if (response.data) {
                if (Array.isArray(response.data.users)) {
                    setComments(response.data.users); // Lấy danh sách bình luận
                }
                setTotalComments(response.data.totalComments || 0); // Lấy tổng số bình luận

                // Chuyển đổi averageRating về kiểu number
                const avgRating = parseFloat(response.data.averageRating) || 0;
                setAverageRating(avgRating); // Lưu giá trị trung bình đánh giá vào state
            }
        } catch (error) {
            console.log("Error fetching comments:", error?.message);
        }
    }
    fetchComments();
}, [productId]);


    const handleCommentSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Vui lòng đăng nhập để bình luận.');
            navigate('/login');
            return;
        }

        if (comment && rating) {
            const data = {
                userId: localStorage.getItem('userId'),
                productId,
                comment,
                rating,
            };

            try {
                const response = await axios.post('http://localhost:3003/rate/rate', data, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.status === 200 && response.data.rate) {
                    alert('Bình luận thành công!');
                    window.location.reload(); // Load lại trang sau khi bấm đóng alert
                } else {
                    setErrorMessage("Có lỗi xảy ra khi gửi bình luận.");
                    setSuccessMessage('');
                }
            } catch (error) {
                console.log("Error posting comment:", error?.message);
                setErrorMessage("Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại.");
            }
        } else {
            setErrorMessage("Vui lòng nhập bình luận và đánh giá sao.");
        }
    };

    // Xử lý đánh giá sao
    const handleRatingChange = (ratingValue) => {
        setRating(ratingValue);
    };

    // Xử lý việc xóa bình luận
    const handleDeleteComment = async (commentId) => {
        const userId = localStorage.getItem('userId');  // Lấy userId từ localStorage
        try {
          const response = await axios.delete(`http://localhost:3003/rate/rate/${commentId}`, {
            data: { userId },  // Gửi userId trong body request
            headers: {
              "Content-Type": "application/json",
            },
          });
      
          if (response.status === 200) {
            setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
            setSuccessMessage("Đã xóa bình luận.");
          } else {
            setErrorMessage("Không thể xóa bình luận.");
          }
        } catch (error) {
          console.log("Error deleting comment:", error?.message);
          setErrorMessage("Có lỗi xảy ra khi xóa bình luận.");
        }
      };
      

    return (
        <div className="comment-section">
            <p style={{ fontWeight: 'bold', fontSize: '23px' }}>ĐÁNH GIÁ SẢN PHẨM</p>

            <div className="comment-summary">
                <p><strong>Tổng số bình luận:</strong> {totalComments > 0 ? totalComments : 'Chưa có bình luận'}</p>
                <p><strong>Đánh giá:  </strong>
                    {isNaN(averageRating) || averageRating === 0 ? 'Chưa có đánh giá' : (
                        <>
                            {averageRating.toFixed(1)}  / 5
                            <FaStar className="star-icon" style={{ color: '#FFD700', marginLeft: '5px' }} />
                        </>
                    )}
                </p>
            </div>

            <form onSubmit={handleCommentSubmit}>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Nhập bình luận của bạn..."
                    required
                    className="comment-textarea"
                />
                <div className="rating-container">
                    <label>Đánh giá sao: </label>
                    <div className="stars">
                        {[1, 2, 3, 4, 5].map((value) => (
                            <FaStar
                                key={value}
                                onClick={() => handleRatingChange(value)}
                                className={`star ${rating >= value ? 'filled' : ''}`}
                            />
                        ))}
                    </div>
                </div>
                <button type="submit" className="comment-submit-btn">Gửi bình luận</button>
            </form>

            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div className="comment-list">
                {comments.map((user) => (
                    <div key={user._id} className="comment-item">
                        <p><strong>{user.userId ? user.userId.username : 'Người dùng'}:</strong> {user.comment}</p>
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <FaStar
                                    key={value}
                                    className={`star ${user.rate >= value ? 'filled' : ''}`}
                                />
                            ))}
                        </div>
                        {user.userId && user.userId._id === localStorage.getItem('userId') && (
                            <button className="delete-comment-btn" onClick={() => handleDeleteComment(user._id)}>
                                Xóa
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CommentSection;
