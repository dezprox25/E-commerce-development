import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiFetch from '../utils/api';
import Breadcrumb from '../components/layout/Breadcrumb';
import Button from '../components/ui/Button';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  
  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      alert("Please login to place an order");
      navigate('/signup');
      return;
    }

    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: address || 'No address provided',
        paymentMethod: paymentMethod,
        totalAmount: cartTotal
      };

      await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });

      alert('Order placed successfully!');
      clearCart();
      navigate('/account');
    } catch (error) {
      alert('Failed to place order: ' + error.message);
    }
  };

  return (
    <div className="checkout-page">
      <Breadcrumb />
      
      <div className="container">
        <h2 className="checkout-page__title">Billing Details</h2>
        
        <div className="checkout-page__inner">
          {/* Billing Form */}
          <form className="checkout-page__form" onSubmit={(e) => e.preventDefault()}>
            <div className="checkout-page__form-group">
              <label>First Name<span className="required">*</span></label>
              <input type="text" className="input" required />
            </div>
            
            <div className="checkout-page__form-group">
              <label>Company Name</label>
              <input type="text" className="input" />
            </div>
            
            <div className="checkout-page__form-group">
              <label>Street Address<span className="required">*</span></label>
              <input type="text" className="input" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
            
            <div className="checkout-page__form-group">
              <label>Apartment, floor, etc. (optional)</label>
              <input type="text" className="input" />
            </div>
            
            <div className="checkout-page__form-group">
              <label>Town/City<span className="required">*</span></label>
              <input type="text" className="input" required />
            </div>
            
            <div className="checkout-page__form-group">
              <label>Phone Number<span className="required">*</span></label>
              <input type="tel" className="input" required />
            </div>
            
            <div className="checkout-page__form-group">
              <label>Email Address<span className="required">*</span></label>
              <input type="email" className="input" required />
            </div>
            
            <div className="checkout-page__checkbox">
              <input type="checkbox" id="save-info" />
              <label htmlFor="save-info">Save this information for faster check-out next time</label>
            </div>
          </form>
          
          {/* Order Summary */}
          <div className="checkout-page__summary">
            <div className="checkout-page__items">
              {cartItems.map(item => (
                <div key={item.id} className="checkout-page__item">
                  <div className="checkout-page__item-left">
                    <div className="checkout-page__item-img">IMG</div>
                    <span>{item.name}</span>
                  </div>
                  <span>${Number(item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="checkout-page__totals">
              <div className="checkout-page__total-row">
                <span>Subtotal:</span>
                <span>${Number(cartTotal).toFixed(2)}</span>
              </div>
              <div className="checkout-page__total-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="checkout-page__total-row checkout-page__total-row--final">
                <span>Total:</span>
                <span>${Number(cartTotal).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="checkout-page__payment">
              <div className="checkout-page__payment-method">
                <div className="checkout-page__radio">
                  <input type="radio" id="bank" name="payment" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} />
                  <label htmlFor="bank">Bank</label>
                </div>
                <div className="checkout-page__payment-icons">
                  <span className="payment-icon">BKash</span>
                  <span className="payment-icon">Visa</span>
                  <span className="payment-icon">MC</span>
                  <span className="payment-icon">Nagad</span>
                </div>
              </div>
              
              <div className="checkout-page__payment-method">
                <div className="checkout-page__radio">
                  <input type="radio" id="cod" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                  <label htmlFor="cod">Cash on delivery</label>
                </div>
              </div>
            </div>
            
            <div className="checkout-page__coupon">
              <input type="text" className="input" placeholder="Coupon Code" />
              <Button>Apply Coupon</Button>
            </div>
            
            <Button onClick={handlePlaceOrder}>Place Order</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
