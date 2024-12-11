import React from 'react';
import { useNavigate } from 'react-router-dom';

function Thanhtoan() {
    const navigate = useNavigate()
  // Lấy chuỗi truy vấn từ URL hiện tại
  const queryParams = new URLSearchParams(window.location.search);

  // Lấy thông tin cần thiết
  const data = {
    amount: (queryParams.get('vnp_Amount') / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
    bankCode: queryParams.get('vnp_BankCode'),
    bankTranNo: queryParams.get('vnp_BankTranNo'),
    cardType: queryParams.get('vnp_CardType'),
    orderInfo: decodeURIComponent(queryParams.get('vnp_OrderInfo')),
    payDate: new Date(
      queryParams.get('vnp_PayDate')?.replace(
        /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
        '$1-$2-$3T$4:$5:$6'
      )
    ).toLocaleString('vi-VN'),
    responseCode: queryParams.get('vnp_ResponseCode') === '00' ? 'Thành công' : 'Thất bại',
    transactionNo: queryParams.get('vnp_TransactionNo'),
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#4CAF50' }}>Kết quả giao dịch</h1>
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#f9f9f9' }}>
        <p><strong>Số tiền thanh toán:</strong> {data.amount}</p>
        <p><strong>Ngân hàng:</strong> {data.bankCode}</p>
        <p><strong>Mã giao dịch ngân hàng:</strong> {data.bankTranNo}</p>
        <p><strong>Loại thẻ:</strong> {data.cardType}</p>
        <p><strong>Nội dung thanh toán:</strong> {data.orderInfo}</p>
        <p><strong>Ngày thanh toán:</strong> {data.payDate}</p>
        <p>
            <strong>Trạng thái giao dịch:</strong> <span style={{
                color: data.responseCode === 'Thất bại' ? 'red' : 'inherit',  // Chỉ thay đổi màu chữ khi thất bại
                fontWeight: 'bold',
            }}>{data.responseCode}</span>
        </p>
        <p><strong>Mã giao dịch VNPAY:</strong> {data.transactionNo}</p>
      </div>
      <button onClick={()=>{navigate('/')}}
        style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            fontSize: '16px',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
            marginTop: '20px',
            transition: 'background-color 0.3s ease, transform 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#45a049';
            e.target.style.transform = 'scale(1.02)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#4CAF50';
            e.target.style.transform = 'scale(1)';
          }}
        >Quay lại</button>
    </div>
  );
}

export default Thanhtoan;