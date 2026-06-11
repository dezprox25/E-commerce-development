import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiFetch from '../utils/api';
import Breadcrumb from '../components/layout/Breadcrumb';
import Button from '../components/ui/Button';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [billing, setBilling] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    streetAddress: '',
    apartment: '',
    city: '',
    phone: '',
    email: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [saveInfo, setSaveInfo] = useState(false);
  const [placing, setPlacing] = useState(false);

  // --- Auto-fill billing from user profile when authenticated ---
  useEffect(() => {
    if (isAuthenticated) {
      loadUserProfile();
    }
  }, [isAuthenticated]);

  async function loadUserProfile() {
    try {
      const profile = await apiFetch('/users/profile');

      setBilling(prev => ({
        ...prev,
        firstName: profile.firstName || prev.firstName,
        lastName: profile.lastName || prev.lastName,
        email: profile.email || prev.email,
        phone: profile.phone || prev.phone,
        streetAddress: profile.streetAddress || prev.streetAddress,
        apartment: profile.apartment || prev.apartment,
        city: profile.city || prev.city,
        companyName: profile.companyName || prev.companyName
      }));
    } catch (error) {
      console.error('Failed to load profile for checkout:', error);
    }
  }

  const handleChange = (e) => {
    setBilling(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const isFormValid = () => {
    return (
      billing.firstName.trim() !== '' &&
      billing.streetAddress.trim() !== '' &&
      billing.city.trim() !== '' &&
      billing.phone.trim() !== '' &&
      billing.email.trim() !== ''
    );
  };
  
  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      alert("Please login to place an order");
      navigate('/login');
      return;
    }

    if (!isFormValid()) {
      alert("Please fill in all required fields (Name, Street Address, City, Phone, Email)");
      return;
    }

    setPlacing(true);

    try {
      // Build the full shipping address string for the order
      const fullAddress = [
        billing.streetAddress,
        billing.apartment,
        billing.city
      ].filter(Boolean).join(', ');

      const orderData = {
        orderItems: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: fullAddress,
        paymentMethod: paymentMethod,
        totalAmount: cartTotal
      };

      await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });

      // Only save billing address to user profile if the checkbox is ticked
      if (saveInfo) {
        try {
          await updateProfile({
            firstName: billing.firstName,
            lastName: billing.lastName,
            phone: billing.phone,
            streetAddress: billing.streetAddress,
            apartment: billing.apartment,
            city: billing.city,
            companyName: billing.companyName
          });
        } catch (err) {
          console.error('Failed to save billing info:', err);
        }
      }

      alert('Order placed successfully!');
      clearCart();
      navigate('/account');
    } catch (error) {
      alert('Failed to place order: ' + error.message);
    } finally {
      setPlacing(false);
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
              <input
                type="text"
                className="input"
                name="firstName"
                value={billing.firstName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="checkout-page__form-group">
              <label>Last Name</label>
              <input
                type="text"
                className="input"
                name="lastName"
                value={billing.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="checkout-page__form-group">
              <label>Company Name</label>
              <input
                type="text"
                className="input"
                name="companyName"
                value={billing.companyName}
                onChange={handleChange}
              />
            </div>
            
            <div className="checkout-page__form-group">
              <label>Street Address<span className="required">*</span></label>
              <input
                type="text"
                className="input"
                name="streetAddress"
                value={billing.streetAddress}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="checkout-page__form-group">
              <label>Apartment, floor, etc. (optional)</label>
              <input
                type="text"
                className="input"
                name="apartment"
                value={billing.apartment}
                onChange={handleChange}
              />
            </div>
            
            <div className="checkout-page__form-group">
              <label>Town/City<span className="required">*</span></label>
              <input
                type="text"
                className="input"
                name="city"
                value={billing.city}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="checkout-page__form-group">
              <label>Phone Number<span className="required">*</span></label>
              <input
                type="tel"
                className="input"
                name="phone"
                value={billing.phone}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="checkout-page__form-group">
              <label>Email Address<span className="required">*</span></label>
              <input
                type="email"
                className="input"
                name="email"
                value={billing.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="checkout-page__checkbox">
              <input
                type="checkbox"
                id="save-info"
                checked={saveInfo}
                onChange={(e) => setSaveInfo(e.target.checked)}
              />
              <label htmlFor="save-info">Save this information for faster check-out next time</label>
            </div>
          </form>
          
          {/* Order Summary */}
          <div className="checkout-page__summary">
            <div className="checkout-page__items">
              {cartItems.map(item => (
                <div key={item.id} className="checkout-page__item">
                  <div className="checkout-page__item-left">
                    <div className="checkout-page__item-img">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      ) : 'IMG'}
                    </div>
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
            
            <Button onClick={handlePlaceOrder} disabled={placing || !isFormValid()}>
              {placing ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
