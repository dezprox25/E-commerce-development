import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Breadcrumb from '../components/layout/Breadcrumb';
import Button from '../components/ui/Button';
import './AccountPage.css';

export default function AccountPage() {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    address: user?.address || '',
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

  const { updateProfile } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        address: formData.address
      });
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile: ' + error.message);
    }
  };

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-page__header">
          <Breadcrumb />
          <div className="account-page__welcome">
            Welcome! <span className="account-page__name">{user?.name || 'User'}</span>
          </div>
        </div>
        
        <div className="account-page__inner">
          {/* Sidebar */}
          <aside className="account-sidebar">
            <div className="account-sidebar__section">
              <h3 className="account-sidebar__title">Manage My Account</h3>
              <ul className="account-sidebar__list">
                <li className="account-sidebar__item account-sidebar__item--active">My Profile</li>
                <li className="account-sidebar__item">Address Book</li>
                <li className="account-sidebar__item">My Payment Options</li>
              </ul>
            </div>
            
            <div className="account-sidebar__section">
              <h3 className="account-sidebar__title">My Orders</h3>
              <ul className="account-sidebar__list">
                <li className="account-sidebar__item">My Returns</li>
                <li className="account-sidebar__item">My Cancellations</li>
              </ul>
            </div>
            
            <div className="account-sidebar__section">
              <h3 className="account-sidebar__title">My WishList</h3>
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="account-content">
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
                  />
                </div>
                <div className="account-form__group">
                  <label>Address</label>
                  <input 
                    type="text" 
                    className="input" 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
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
          </main>
        </div>
      </div>
    </div>
  );
}
