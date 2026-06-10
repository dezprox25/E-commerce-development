import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Column 1 - Exclusive */}
          <div className="footer__col">
            <h3 className="footer__col-title">Exclusive</h3>
            <p className="footer__col-subtitle">Subscribe</p>
            <p className="footer__subscribe-text">Get 10% off your first order</p>
            <form className="footer__subscribe-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="footer__subscribe-input"
              />
              <button type="submit" className="footer__subscribe-btn">
                <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.91199 9.9998H2.99999L1.02299 2.1348C1.01033 2.0891 1.00262 2.04216 0.999988 1.9948C0.977988 1.2738 1.77199 0.773804 2.45999 1.1038L21 9.9998L2.45999 18.8958C1.77999 19.2228 0.985988 18.7368 0.999988 18.0198C1.00201 17.9654 1.01085 17.9115 1.02599 17.8598L2.99999 12.9998" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          </div>

          {/* Column 2 - Support */}
          <div className="footer__col">
            <h3 className="footer__col-title">Support</h3>
            <div className="footer__links">
              <span className="footer__text">111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</span>
              <a href="mailto:exclusive@gmail.com" className="footer__link">exclusive@gmail.com</a>
              <a href="tel:+88015888889999" className="footer__link">+88015-88888-9999</a>
            </div>
          </div>

          {/* Column 3 - Account */}
          <div className="footer__col">
            <h3 className="footer__col-title">Account</h3>
            <div className="footer__links">
              <Link to="/account" className="footer__link">My Account</Link>
              <Link to="/login" className="footer__link">Login / Register</Link>
              <Link to="/cart" className="footer__link">Cart</Link>
              <Link to="/wishlist" className="footer__link">Wishlist</Link>
              <Link to="/" className="footer__link">Shop</Link>
            </div>
          </div>

          {/* Column 4 - Quick Link */}
          <div className="footer__col">
            <h3 className="footer__col-title">Quick Link</h3>
            <div className="footer__links">
              <Link to="/about" className="footer__link">Privacy Policy</Link>
              <Link to="/about" className="footer__link">Terms Of Use</Link>
              <Link to="/about" className="footer__link">FAQ</Link>
              <Link to="/contact" className="footer__link">Contact</Link>
            </div>
          </div>

          {/* Column 5 - Download App */}
          <div className="footer__col">
            <h3 className="footer__col-title">Download App</h3>
            <p className="footer__app-label">Save $3 with App New User Only</p>
            <div className="footer__app-wrapper">
              <div className="footer__qr">QR</div>
              <div>
                <div className="footer__app-btn" style={{ marginBottom: '8px' }}>
                  <span>Google Play</span>
                </div>
                <div className="footer__app-btn">
                  <span>App Store</span>
                </div>
              </div>
            </div>
            <div className="footer__social">
              <a href="#" className="footer__social-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z"/></svg>
              </a>
              <a href="#" className="footer__social-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M23 3.00005C22.0424 3.67552 20.9821 4.19216 19.86 4.53005C19.2577 3.83756 18.4573 3.34674 17.567 3.12397C16.6767 2.90121 15.7395 2.95724 14.8821 3.2845C14.0247 3.61176 13.2884 4.19445 12.773 4.95376C12.2575 5.71308 11.9877 6.61238 12 7.53005V8.53005C10.2426 8.57561 8.50127 8.18586 6.93101 7.39549C5.36074 6.60513 4.01032 5.43868 3 4.00005C3 4.00005 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.50005C20.9991 7.2215 20.9723 6.94364 20.92 6.67005C21.9406 5.66354 22.6608 4.39276 23 3.00005Z"/></svg>
              </a>
              <a href="#" className="footer__social-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61991 14.1902 8.22773 13.4229 8.09407 12.5922C7.9604 11.7616 8.09207 10.9099 8.47032 10.1584C8.84858 9.40685 9.45418 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87658 12.63 8C13.4789 8.12588 14.2649 8.52146 14.8717 9.1283C15.4785 9.73515 15.8741 10.5211 16 11.37Z" fill="#000"/><circle cx="16.5" cy="7.5" r="1.5" fill="#000"/></svg>
              </a>
              <a href="#" className="footer__social-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© Copyright Rimel 2022. All right reserved</p>
        </div>
      </div>
    </footer>
  );
}
