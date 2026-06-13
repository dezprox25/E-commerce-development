import { Link, useLocation } from 'react-router-dom';
import './Breadcrumb.css';

export default function Breadcrumb({ items }) {
  const location = useLocation();

  const defaultItems = location.pathname.split('/').filter(Boolean).map((segment, index, arr) => ({
    label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
    // Route /category alone back to homepage since there's no standalone category page
    path: segment.toLowerCase() === 'category' ? '/' : '/' + arr.slice(0, index + 1).join('/'),
  }));

  const breadcrumbItems = items || defaultItems;

  return (
    <nav className="breadcrumb">
      <div className="container">
        <ul className="breadcrumb__list">
          <li className="breadcrumb__item">
            <Link to="/" className="breadcrumb__link">Home</Link>
          </li>
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="breadcrumb__item">
              <span className="breadcrumb__separator">/</span>
              {index === breadcrumbItems.length - 1 ? (
                <span className="breadcrumb__current">{item.label}</span>
              ) : (
                <Link to={item.path} className="breadcrumb__link">{item.label}</Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
