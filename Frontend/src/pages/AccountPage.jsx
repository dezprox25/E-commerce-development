import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Breadcrumb from '../components/layout/Breadcrumb';
import Button from '../components/ui/Button';
import MyOrders from './MyOrders';
import MyCancellations from './MyCancellations';
import './AccountPage.css';

export default function AccountPage() {
  const { user, updateProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'profile';
  
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tab = queryParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/account?tab=${tab}`);
  };

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    streetAddress: user?.streetAddress || '',
    apartment: user?.apartment || '',
    city: user?.city || '',
    companyName: user?.companyName || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        streetAddress: formData.streetAddress,
        apartment: formData.apartment,
        city: formData.city,
        companyName: formData.companyName
      });
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile: ' + error.message);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <>
            <h2 className="account-content__title">My Orders</h2>
            <MyOrders />
          </>
        );
      case 'cancellations':
        return (
          <>
            <h2 className="account-content__title">My Cancellations</h2>
            <MyCancellations />
          </>
        );
      case 'profile':
      default:
        return (
          <>
            <h2 className="account-content__title">Edit Your Profile</h2>
            <form className="account-form" onSubmit={handleSubmit}>
              <div className="account-form__row">
                <div className="account-form__group">
                  <label>First Name</label>
                  <input 
                    type="text" 
                    className="input" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="account-form__group">
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    className="input" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="account-form__row">
                <div className="account-form__group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    className="input" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                  />
                </div>
                <div className="account-form__group">
                  <label>Phone</label>
                  <input 
                    type="tel" 
                    className="input" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className="account-form__row">
                <div className="account-form__group">
                  <label>Street Address</label>
                  <input 
                    type="text" 
                    className="input" 
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    placeholder="Enter your street address"
                  />
                </div>
                <div className="account-form__group">
                  <label>Apartment / Floor</label>
                  <input 
                    type="text" 
                    className="input" 
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    placeholder="Apt, floor, etc. (optional)"
                  />
                </div>
              </div>

              <div className="account-form__row">
                <div className="account-form__group">
                  <label>Town / City</label>
                  <input 
                    type="text" 
                    className="input" 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                  />
                </div>
                <div className="account-form__group">
                  <label>Company Name</label>
                  <input 
                    type="text" 
                    className="input" 
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Company (optional)"
                  />
                </div>
              </div>
              
              <div className="account-form__password-section">
                <label>Password Changes</label>
                <div className="account-form__password-inputs">
                  <input 
                    type="password" 
                    className="input" 
                    placeholder="Current Password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                  <input 
                    type="password" 
                    className="input" 
                    placeholder="New Password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                  <input 
                    type="password" 
                    className="input" 
                    placeholder="Confirm New Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="account-form__actions">
                <button type="button" className="account-form__cancel">Cancel</button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </>
        );
    }
  };

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-page__header">
          <Breadcrumb />
          <div className="account-page__welcome">
            Welcome! <span className="account-page__name">{user?.firstName || 'User'}</span>
          </div>
        </div>
        
        <div className="account-page__inner">
          {/* Sidebar */}
          <aside className="account-sidebar">
            <div className="account-sidebar__section">
              <h3 className="account-sidebar__title">Manage My Account</h3>
              <ul className="account-sidebar__list">
                <li 
                  className={`account-sidebar__item ${activeTab === 'profile' ? 'account-sidebar__item--active' : ''}`}
                  onClick={() => handleTabChange('profile')}
                >
                  My Profile
                </li>
                <li className="account-sidebar__item">Address Book</li>
                <li className="account-sidebar__item">My Payment Options</li>
              </ul>
            </div>
            
            <div className="account-sidebar__section">
              <h3 className="account-sidebar__title">My Orders</h3>
              <ul className="account-sidebar__list">
                <li 
                  className={`account-sidebar__item ${activeTab === 'orders' ? 'account-sidebar__item--active' : ''}`}
                  onClick={() => handleTabChange('orders')}
                >
                  My Orders
                </li>
                <li 
                  className={`account-sidebar__item ${activeTab === 'cancellations' ? 'account-sidebar__item--active' : ''}`}
                  onClick={() => handleTabChange('cancellations')}
                >
                  My Cancellations
                </li>
              </ul>
            </div>
            
            <div className="account-sidebar__section">
              <h3 className="account-sidebar__title">My WishList</h3>
              <ul className="account-sidebar__list">
                <li className="account-sidebar__item">
                  <Link to="/wishlist" style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>
                    Liked products
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="account-content">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}
