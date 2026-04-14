import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const PaymentModal = ({ show, onHide, booking, paymentType, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  console.log('PaymentModal rendered:', { show, booking, paymentType });

  // Load Razorpay script
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setScriptLoaded(true);
      console.log('✅ Razorpay script loaded');
    };
    script.onerror = () => {
      console.error('❌ Failed to load Razorpay script');
      toast.error('Failed to load payment gateway');
    };
    document.body.appendChild(script);
    
    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  React.useEffect(() => {
    if (show) {
      console.log('📋 PaymentModal opened:', { 
        bookingId: booking?._id, 
        paymentType, 
        amount: paymentType === 'deposit' ? booking?.deposit : booking?.totalAmount 
      });
    }
  }, [show, booking, paymentType]);

  const handlePayment = async () => {
    if (!booking?._id) {
      toast.error('Booking information missing');
      return;
    }

    // Check if using mock Razorpay (for testing without valid credentials)
    const isMockMode = !scriptLoaded || process.env.REACT_APP_MOCK_PAYMENT === 'true';
    
    if (isMockMode) {
      // Mock payment for testing
      const confirmPay = window.confirm(
        `TEST MODE: Simulate payment of ₹${paymentType === 'deposit' ? booking.deposit : booking.totalAmount}?\n\nClick OK to mark as paid (no actual payment will be processed)`
      );
      
      if (confirmPay) {
        try {
          const token = localStorage.getItem('token');
          const endpoint = paymentType === 'deposit'
            ? '/api/payments/mark-deposit-paid'
            : '/api/payments/mark-rent-paid';
          
          await axios.post(`http://localhost:5000${endpoint}`, {
            bookingId: booking._id
          }, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          toast.success(`${paymentType === 'deposit' ? 'Deposit' : 'Rent'} marked as paid!`);
          onPaymentSuccess();
          onHide();
        } catch (error) {
          toast.error('Failed to mark payment');
        }
      }
      return;
    }

    setLoading(true);
    try {
      console.log('💳 Starting payment process...');
      
      // Create order
      const endpoint = paymentType === 'deposit' 
        ? '/api/payments/create-deposit-order' 
        : '/api/payments/create-rent-order';

      console.log(`📝 Creating ${paymentType} order for booking:`, booking._id);
      
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000${endpoint}`, {
        bookingId: booking._id
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const { orderId, amount, keyId } = response.data;
      console.log('✅ Order created:', { orderId, amount, keyId });

      // Razorpay options
      const options = {
        key: keyId,
        amount: Math.round(amount * 100), // Amount in paise
        currency: 'INR',
        name: 'AgriRent',
        description: `${paymentType === 'deposit' ? 'Security Deposit' : 'Rental Amount'} - ${booking.tool?.name}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            console.log('✅ Payment completed by user');
            
            // Verify payment
            const verifyEndpoint = paymentType === 'deposit'
              ? '/api/payments/verify-deposit-payment'
              : '/api/payments/verify-rent-payment';

            console.log('🔍 Verifying payment...');
            await axios.post(`http://localhost:5000${verifyEndpoint}`, {
              bookingId: booking._id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            console.log('✅ Payment verified successfully');
            toast.success(`${paymentType === 'deposit' ? 'Deposit' : 'Rent'} payment successful!`);
            onPaymentSuccess();
            onHide();
          } catch (error) {
            console.error('❌ Payment verification failed:', error);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: 'Farmer',
          email: 'farmer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#667eea'
        }
      };

      console.log('🎯 Opening Razorpay checkout...');
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('❌ Payment error:', error);
      toast.error(error.response?.data?.message || 'Failed to create payment order');
    } finally {
      setLoading(false);
    }
  };

  const amount = paymentType === 'deposit' ? booking?.deposit : booking?.totalAmount;
  const title = paymentType === 'deposit' 
    ? 'Pay Security Deposit' 
    : 'Pay Rental Amount';

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" style={{ zIndex: 9999 }}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!booking ? (
          <div className="text-center py-5">
            <Spinner animation="border" className="mb-3" />
            <p className="text-muted">Loading booking details...</p>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <h6>Equipment: {booking?.tool?.name}</h6>
              <p className="text-muted">
                {new Date(booking?.startDate).toLocaleDateString()} - {new Date(booking?.endDate).toLocaleDateString()}
              </p>
            </div>

            <Alert variant="info">
              <strong>Payment Details:</strong>
              <div className="mt-2">
                {paymentType === 'deposit' ? (
                  <>
                    <p className="mb-1">Security Deposit: <strong>₹{booking?.deposit}</strong></p>
                    <p className="text-muted small">This will be refunded after equipment return in good condition</p>
                  </>
                ) : (
                  <>
                    <p className="mb-1">Rental Amount: <strong>₹{booking?.totalAmount}</strong></p>
                    <p className="text-muted small">This is the rental cost for {booking?.totalDays} days</p>
                  </>
                )}
              </div>
            </Alert>

            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Payment Method</Form.Label>
                <Form.Control 
                  type="text" 
                  value="Razorpay (Credit/Debit Card, UPI, Wallet)" 
                  disabled 
                />
              </Form.Group>
            </Form>

            {!scriptLoaded && (
              <Alert variant="warning">
                <small>⏳ Payment gateway is loading... Please wait.</small>
              </Alert>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handlePayment}
          disabled={loading || !scriptLoaded || !booking}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Processing...
            </>
          ) : !scriptLoaded ? (
            'Loading...'
          ) : (
            `Pay ₹${amount}`
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;
