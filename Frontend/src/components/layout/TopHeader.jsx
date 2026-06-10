import { Link } from 'react-router-dom';
import './TopHeader.css';

export default function TopHeader() {
  return (
    <div className="top-header">
      <div className="container top-header__inner">
        <p className="top-header__text">
          Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
          <Link to="/products" className="top-header__link">ShopNow</Link>
        </p>
        <div className="top-header__lang">
          <select defaultValue="en">
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
          </select>
        </div>
      </div>
    </div>
  );
}
