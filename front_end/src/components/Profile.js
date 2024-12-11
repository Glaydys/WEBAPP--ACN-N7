import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import Header from './Navbar';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});
  const [detailsLoading, setDetailsLoading] = useState({});
  const [newAddress, setNewAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [isAddressEditing, setIsAddressEditing] = useState(false); // To toggle address editing

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    const userId = localStorage.getItem('userId', null);

    try {
      const response = await axios.get(
        `http://localhost:3003/orders/getorder?userId=${userId}&status=${selectedStatus}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error('Không thể lấy danh sách đơn hàng:', error);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, [selectedStatus]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3003/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setNewAddress(response.data.address || '');
      } catch (error) {
        console.error('Không thể lấy thông tin người dùng:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  useEffect(() => {
    if (selectedTab === 'orders') {
      fetchOrders();
    }
  }, [selectedTab, fetchOrders]);

  const fetchOrderDetails = async (orderId) => {
    if (orderDetails[orderId]) return;
    setDetailsLoading((prev) => ({ ...prev, [orderId]: true }));
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:3003/orders/${orderId}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrderDetails((prevState) => ({
        ...prevState,
        [orderId]: response.data
      }));
    } catch (error) {
      console.error('Không thể lấy chi tiết đơn hàng:', error);
      setOrderDetails((prevState) => ({
        ...prevState,
        [orderId]: null
      }));
    } finally {
      setDetailsLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setOrderDetails({});
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setOrderDetails({});
  };
  

  const handleAddressChange = async () => {
    setAddressError(''); // Reset any previous error
    const token = localStorage.getItem('token');
    if (!newAddress.trim()) {
      setAddressError('Địa chỉ không được để trống!');
      return;
    }

    try {
      const response = await axios.put(
        'http://localhost:3003/api/profile', // API cập nhật địa chỉ
        { address: newAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data); // Cập nhật thông tin người dùng với địa chỉ mới
      setIsAddressEditing(false); // Close the address edit input
      alert('Cập nhật địa chỉ thành công!');
    } catch (error) {
      console.error('Không thể cập nhật địa chỉ:', error);
      alert('Có lỗi khi cập nhật địa chỉ!');
    }
  };

  if (loading) {
    return <p>Đang tải thông tin người dùng...</p>;
  }

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-sidebar">
          <h2>Xin chào, {user ? user.username : 'User'}</h2>
          <button
            onClick={() => handleTabChange('orders')}
            className={`tab-button ${selectedTab === 'orders' ? 'active' : ''}`}
          >
            Đơn hàng đã mua
          </button>
          <button
            onClick={() => handleTabChange('info')}
            className={`tab-button ${selectedTab === 'info' ? 'active' : ''}`}
          >
            Thông tin cá nhân
          </button>
          <button onClick={handleLogout} className="logout-button">
            Đăng xuất
          </button>
        </div>
        <div className="profile-content">
          {selectedTab === 'orders' && (
            <div className="orders-content">
              <h2>Đơn hàng đã mua</h2>
              <div className="order-filters">
              <button onClick={() => handleStatusChange('')}
               className={`tab-button ${selectedStatus === '' ? 'active' : ''}`}>Tất cả
              </button>
              <button onClick={() => handleStatusChange('Đang chờ xác nhận')}
              className={`tab-button ${selectedStatus === 'Đang chờ xác nhận' ? 'active' : ''}`}>Chờ xác nhận
              </button>
              <button onClick={() => handleStatusChange('Đang giao')}
              className={`tab-button ${selectedStatus === 'Đang giao' ? 'active' : ''}`}>Đang giao hàng
              </button>
              <button onClick={() => handleStatusChange('Đã giao')}
              className={`tab-button ${selectedStatus === 'Đã giao' ? 'active' : ''}`}>Đã giao
             </button>
      </div>


              {ordersLoading ? (
                <p>Đang tải đơn hàng...</p>
              ) : orders.length === 0 ? (
                <div className="order-empty">
                  <RemoveShoppingCartIcon style={{ fontSize: '100px', color: '#d32f2f', marginBottom: '10px' }} />
                  <p>Rất tiếc, không tìm thấy đơn hàng nào phù hợp</p>
                  <span>Vẫn còn rất nhiều sản phẩm đang chờ bạn</span>
                  <div className="product-suggestions">
                    <button onClick={() => navigate('/products?category=1')}>Điện thoại</button>
                    <button onClick={() => navigate('/products?category=2')}>Máy tính bảng</button>
                    <button onClick={() => navigate('/products?category=3')}>Laptop</button>
                    <button onClick={() => navigate('/products?category=5')}>Máy tính để bàn</button>
                    <button onClick={() => navigate('/products?category=6')}>Máy in</button>
                    <button onClick={() => navigate('/products?category=7')}>Máy ảnh</button>
                    <button onClick={() => navigate('/products?category=4')}>Đồng hồ</button>
                  </div>
                  <button className="back-home-button" onClick={() => navigate('/')}>Về trang chủ</button>
                </div>
              ) : (
                <div className="order-list">
                  {orders.map((order) => (
                    <div key={order._id} className="order-item" onClick={() => fetchOrderDetails(order._id)}>
                      <p>Mã đơn hàng: {order.OrderCode}</p>
                      <p>Ngày đặt: {new Date(order.OrderDate).toLocaleDateString()}</p>
                      <p>Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.TotalAmount)}
                      </p>
                      <p>Trạng thái: {order.Status}</p>

                      {detailsLoading[order._id] && <p>Đang tải chi tiết đơn hàng...</p>}

                      {orderDetails[order._id] ? (
                        <div className="order-details">
                          <h3>Chi tiết đơn hàng</h3>
                          {orderDetails[order._id].map((detail) => (
                            <div key={detail._id} className="order-detail-item">
                              <p>Sản phẩm: {detail.name_product}</p>
                              <p>Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detail.price)}</p>
                              <p>Số lượng: {detail.quantity}</p>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedTab === 'info' && (
            <div className="info-content">
              <h2>Thông tin cá nhân</h2>

              <p>Tên: {user ? user.username : 'N/A'}</p>
              <p>Email: {user ? user.email : 'N/A'}</p>

              <div className="info-item">
                <label>Địa chỉ: </label>
                <div className="address-container">
                  <p>{user && user.address ? user.address : 'Chưa cập nhật'}</p>

                  {/* Nếu không phải chế độ chỉnh sửa, hiển thị nút Cập nhật địa chỉ */}
                  {!isAddressEditing && (
                    <button onClick={() => setIsAddressEditing(true)} className="edit-address-button">
                      Cập nhật địa chỉ
                    </button>
                  )}

                  {/* Nếu đang ở chế độ chỉnh sửa địa chỉ */}
                  {isAddressEditing && (
                    <div className="address-edit-container">
                      <input
                        type="text"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        placeholder="Nhập địa chỉ mới"
                      />
                      <button onClick={handleAddressChange} className="save-address-button">
                        Lưu
                      </button>
                      <button onClick={() => setIsAddressEditing(false)} className="cancel-address-button">
                        Hủy
                      </button>
                    </div>
                  )}
                </div>
                {addressError && <p className="error-message">{addressError}</p>}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Profile;
