import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import StarRating from './StarRating';
import './ProductCard.css';

export default function ProductCard({
  product,
  showDiscount = false,
  showDelete = false,
  showAddToCart = true,
  onDelete,
  compact = false,
}) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);

  return (
    <div className={`product-card ${compact ? 'product-card--compact' : ''}`}>
      {/* Image Area */}
      <div className="product-card__image-wrapper">
        <div className="product-card__image">
          {/* Placeholder for product image */}
          <div className="product-card__image-placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        </div>

        {/* Badges */}
        <div className="product-card__badges">
          {showDiscount && product.discount > 0 && (
            <span className="badge badge--discount">-{product.discount}%</span>
          )}
          {product.isNew && (
            <span className="badge badge--new">NEW</span>
          )}
        </div>

        {/* Action Icons */}
        <div className="product-card__actions">
          {showDelete ? (
            <button className="product-card__action-btn" onClick={() => onDelete?.(product.id)} title="Remove">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          ) : (
            <button
              className={`product-card__action-btn ${wishlisted ? 'product-card__action-btn--active' : ''}`}
              onClick={() => toggleWishlist(product)}
              title="Wishlist"
            >
              <svg width="18" height="18" viewBox="0 0 22 20" fill={wishlisted ? '#DB4444' : 'none'} xmlns="http://www.w3.org/2000/svg">
                <path d="M6 1C3.239 1 1 3.216 1 5.95C1 8.157 1.875 13.395 10.488 18.69C10.6423 18.7839 10.8194 18.8335 11 18.8335C11.1806 18.8335 11.3577 18.7839 11.512 18.69C20.125 13.395 21 8.157 21 5.95C21 3.216 18.761 1 16 1C13.239 1 11 4 11 4C11 4 8.761 1 6 1Z" stroke={wishlisted ? '#DB4444' : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          <button className="product-card__action-btn" title="Quick View">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>

        {/* Add to Cart Overlay */}
        {showAddToCart && (
          <button className="product-card__add-to-cart" onClick={() => addToCart(product)}>
            Add To Cart
          </button>
        )}
      </div>

      {/* Info Area */}
      <div className="product-card__info">
        <Link to={`/product/${product.id}`} className="product-card__name">{product.name}</Link>
        <div className="product-card__pricing">
          <span className="product-card__price">${product.price}</span>
          {product.originalPrice > 0 && product.originalPrice !== product.price && (
            <span className="product-card__original-price">${product.originalPrice}</span>
          )}
        </div>
        <div className="product-card__rating">
          <StarRating rating={product.rating} />
          <span className="product-card__rating-count">({product.ratingCount})</span>
        </div>
        {product.colors && product.colors.length > 0 && (
          <div className="product-card__colors">
            {product.colors.map((color, i) => (
              <span key={i} className="product-card__color" style={{ backgroundColor: color }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
