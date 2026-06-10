import { Link } from 'react-router-dom';
import appleLogo from '../../assets/1200px-Apple_gray_logo 1.png';
import heroImage from '../../assets/hero_endframe__cvklg0xk3w6e_large 2.png';
import { sidebarCategories } from '../../data/products';
import './HeroBanner.css';

export default function HeroBanner() {
  return (
    <section className="hero-banner">
      <div className="container hero-banner__inner">
        {/* Sidebar */}
        <div className="hero-banner__sidebar">
          <ul className="hero-banner__menu">
            {sidebarCategories.map((category, index) => (
              <li key={index} className="hero-banner__menu-item">
                <Link to="/products" className="hero-banner__menu-link">
                  {category.name}
                  {category.hasDropdown && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Carousel / Banner */}
        <div className="hero-banner__carousel">
          <div className="hero-banner__slide">
            <div className="hero-banner__content">
              <div className="hero-banner__logo-row">
                <img src={appleLogo} alt="Apple Logo" style={{ width: '40px', objectFit: 'contain' }} />
                <span className="hero-banner__subtitle">iPhone 14 Series</span>
              </div>
              <h1 className="hero-banner__title">Up to 10%<br/>off Voucher</h1>
              <Link to="/products" className="hero-banner__cta">
                Shop Now
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Link>
            </div>
            <div className="hero-banner__image">
              <div className="hero-banner__image-placeholder">
                <img src={heroImage} alt="iPhone 14 Series" />
              </div>
            </div>
          </div>
          
          <div className="hero-banner__dots">
            <span className="hero-banner__dot"></span>
            <span className="hero-banner__dot"></span>
            <span className="hero-banner__dot hero-banner__dot--active"></span>
            <span className="hero-banner__dot"></span>
            <span className="hero-banner__dot"></span>
          </div>
        </div>
      </div>
    </section>
  );
}
