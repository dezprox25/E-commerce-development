import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import './Header.css';

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const { products } = useProducts();
  
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setShowSearchResults(false);
    setSearchQuery('');
  }, [location]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim() && products) {
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(val.toLowerCase()) || 
        p.category.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 5); // limit to 5 items in dropdown
      setSearchResults(filtered);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/contact', label: 'Contact' },
    { path: '/about', label: 'About' },
    { path: isAuthenticated ? '/account' : '/signup', label: isAuthenticated ? 'Account' : 'Sign Up' },
  ];

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container header__inner">
        {/* Logo */}
        <Link to="/" className="header__logo">Exclusive</Link>

        {/* Desktop Nav */}
        <nav className="header__nav">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`header__nav-link ${location.pathname === link.path ? 'header__nav-link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="header__actions">
          {/* Search */}
          <div className="header__search" ref={searchRef} style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="What are you looking for?"
              className="header__search-input"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                if (searchQuery.trim() && searchResults.length > 0) setShowSearchResults(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  setShowSearchResults(false);
                  navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
            />
            <span 
              className="header__search-icon" 
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (searchQuery.trim()) {
                  setShowSearchResults(false);
                  navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 17L13.2223 13.2156M15.3158 8.15789C15.3158 12.1101 12.1101 15.3158 8.15789 15.3158C4.20571 15.3158 1 12.1101 1 8.15789C1 4.20571 4.20571 1 8.15789 1C12.1101 1 15.3158 4.20571 15.3158 8.15789Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            {showSearchResults && searchResults.length > 0 && (
              <div className="header__search-results">
                {searchResults.map(result => (
                  <Link 
                    key={result.id} 
                    to={`/product/${result.id}`} 
                    className="header__search-result-item"
                    onClick={() => setShowSearchResults(false)}
                  >
                    {result.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <Link to="/wishlist" className="header__icon-btn">
            <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 1C3.239 1 1 3.216 1 5.95C1 8.157 1.875 13.395 10.488 18.69C10.6423 18.7839 10.8194 18.8335 11 18.8335C11.1806 18.8335 11.3577 18.7839 11.512 18.69C20.125 13.395 21 8.157 21 5.95C21 3.216 18.761 1 16 1C13.239 1 11 4 11 4C11 4 8.761 1 6 1Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {wishlistItems.length > 0 && (
              <span className="header__badge">{wishlistItems.length}</span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="header__icon-btn">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 27C11.5523 27 12 26.5523 12 26C12 25.4477 11.5523 25 11 25C10.4477 25 10 25.4477 10 26C10 26.5523 10.4477 27 11 27Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M25 27C25.5523 27 26 26.5523 26 26C26 25.4477 25.5523 25 25 25C24.4477 25 24 25.4477 24 26C24 26.5523 24.4477 27 25 27Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 5H7L10 22H26" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 16.6667H25.59C25.7056 16.6667 25.8177 16.6267 25.9072 16.5535C25.9966 16.4802 26.0579 16.3782 26.0806 16.2648L27.8806 7.26479C27.8951 7.19222 27.8934 7.11733 27.8755 7.04552C27.8575 6.97371 27.8239 6.90678 27.7## truncated for brevity" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {cartCount > 0 && (
              <span className="header__badge">{cartCount}</span>
            )}
          </Link>

          {/* Account */}
          {isAuthenticated && (
            <div className="header__account-wrapper" ref={dropdownRef}>
              <button
                className={`header__account-btn ${dropdownOpen ? 'header__account-btn--active' : ''}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke={dropdownOpen ? "white" : "black"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke={dropdownOpen ? "white" : "black"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <div className={`header__dropdown ${dropdownOpen ? 'header__dropdown--open' : ''}`}>
                <Link to="/account?tab=profile" className="header__dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M20 21V19C20 16.79 18.21 15 16 15H8C5.79 15 4 16.79 4 19V21"/><circle cx="12" cy="7" r="4"/></svg>
                  Manage My Account
                </Link>
                <Link to="/account?tab=orders" className="header__dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"/><path d="M3 6H21"/><path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"/></svg>
                  My Order
                </Link>
                <Link to="/account?tab=cancellations" className="header__dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                  My Cancellations
                </Link>
                <Link to="/wishlist" className="header__dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M11.49 3.17l-1.83 3.7-4.08.59a1 1 0 00-.55 1.7l2.95 2.88-.7 4.07a1 1 0 001.45 1.05L12 15.4l3.64 1.91a1 1 0 001.45-1.05l-.7-4.07 2.95-2.88a1 1 0 00-.55-1.7l-4.08-.59-1.83-3.7a1 1 0 00-1.8 0z"/></svg>
                  My Reviews
                </Link>
                <button className="header__dropdown-item" onClick={handleLogout}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Mobile Hamburger */}
          <button className="header__hamburger" onClick={() => setMobileMenuOpen(true)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`header__mobile-overlay ${mobileMenuOpen ? 'header__mobile-overlay--open' : ''}`} onClick={() => setMobileMenuOpen(false)} />
      <nav className={`header__mobile-nav ${mobileMenuOpen ? 'header__mobile-nav--open' : ''}`}>
        <button className="header__mobile-nav-close" onClick={() => setMobileMenuOpen(false)}>✕</button>
        <div className="header__mobile-search">
          <input type="text" placeholder="What are you looking for?" />
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M17 17L13.2223 13.2156M15.3158 8.15789C15.3158 12.1101 12.1101 15.3158 8.15789 15.3158C4.20571 15.3158 1 12.1101 1 8.15789C1 4.20571 4.20571 1 8.15789 1C12.1101 1 15.3158 4.20571 15.3158 8.15789Z" stroke="black" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </div>
        <div className="header__mobile-nav-links">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} className="header__mobile-nav-link">
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
