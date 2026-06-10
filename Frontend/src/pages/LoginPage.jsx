import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import './Auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      alert(error.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__inner">
        <div className="auth-page__image">
          <div className="auth-page__image-placeholder">Side Image</div>
        </div>
        
        <div className="auth-page__content">
          <h1 className="auth-page__title">Log in to Exclusive</h1>
          <p className="auth-page__subtitle">Enter your details below</p>
          
          <form className="auth-page__form" onSubmit={handleSubmit}>
            <div className="auth-page__form-group">
              <input 
                type="text" 
                className="input input--underline" 
                placeholder="Email or Phone Number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="auth-page__form-group">
              <input 
                type="password" 
                className="input input--underline" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="auth-page__actions-row">
              <Button type="submit" className="auth-page__login-btn">Log In</Button>
              <Link to="#" className="auth-page__forgot-link">Forget Password?</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
