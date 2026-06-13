import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import apiFetch from '../utils/api';
import Breadcrumb from '../components/layout/Breadcrumb';
import Button from '../components/ui/Button';
import StarRating from '../components/ui/StarRating';
import SectionHeader from '../components/ui/SectionHeader';
import ProductCard from '../components/ui/ProductCard';
import './ProductDetailsPage.css';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { getProductById, products } = useProducts();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  
  const [reviews, setReviews] = useState([]);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Find product
  const product = getProductById(id) || products[0];

  useEffect(() => {
    if (product) {
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0].hexCode || product.colors[0]);
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0].size || product.sizes[0]);
      }
      
      // Fetch reviews
      apiFetch(`/reviews/${product.id}`)
        .then(data => setReviews(data))
        .catch(err => console.error("Failed to load reviews", err));
    }
  }, [product]);
  const relatedProducts = product ? products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4) : [];

  if (!product) {
    return <div className="container" style={{padding: '100px 0', textAlign: 'center'}}>Loading product...</div>;
  }

  const handleQuantityChange = (type) => {
    if (type === 'dec' && quantity > 1) {
      setQuantity(quantity - 1);
    } else if (type === 'inc' && quantity < product.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    if (product.stockQuantity === 0) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const toggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to submit a review.");
      navigate('/login');
      return;
    }

    setIsSubmittingReview(true);
    setReviewError('');

    try {
      const data = await apiFetch(`/reviews/${product.id}`, {
        method: 'POST',
        body: JSON.stringify({
          rating: newReviewRating,
          comment: newReviewComment
        })
      });

      // Update local state with new review
      setReviews([data.review, ...reviews]);
      setNewReviewComment('');
      setNewReviewRating(5);
      
      // Update the product context if we had a function for it, but 
      // we'll just update local product object for immediate UI feedback
      product.rating = data.productRating;
      product.ratingCount = data.productRatingCount;
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="product-details-page">
      <Breadcrumb items={[
        { label: 'Product', path: '/products' },
        { label: product.name, path: `/product/${product.id}` }
      ]} />
      
      <div className="container">
        <div className="product-details__inner">
          
          {/* Gallery */}
          <div className="product-gallery">
            <div className="product-gallery__thumbnails">
              <div className="product-gallery__thumb product-gallery__thumb--active">
                <div className="product-gallery__img-placeholder">IMG</div>
              </div>
              <div className="product-gallery__thumb">
                <div className="product-gallery__img-placeholder">IMG</div>
              </div>
              <div className="product-gallery__thumb">
                <div className="product-gallery__img-placeholder">IMG</div>
              </div>
              <div className="product-gallery__thumb">
                <div className="product-gallery__img-placeholder">IMG</div>
              </div>
            </div>
            
            <div className="product-gallery__main">
              <div className="product-gallery__img-placeholder">Main Image</div>
            </div>
          </div>
          
          {/* Info */}
          <div className="product-info">
            <h1 className="product-info__title">{product.name}</h1>
            
            <div className="product-info__meta">
              <StarRating rating={product.rating} />
              <span className="product-info__reviews">({product.reviews} Reviews)</span>
              <span className="product-info__meta-divider">|</span>
              {product.stockQuantity === 0 ? (
                <span className="product-info__stock" style={{ color: '#DB4444', fontWeight: 600 }}>Out of Stock</span>
              ) : product.stockQuantity <= 3 ? (
                <span className="product-info__stock" style={{ color: '#FFAD33', fontWeight: 600 }}>Only {product.stockQuantity} left in stock</span>
              ) : (
                <span className="product-info__stock" style={{ color: '#00FF66' }}>In Stock</span>
              )}
            </div>
            
            <div className="product-info__price">${Number(product.price).toFixed(2)}</div>
            
            <p className="product-info__desc">
              PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mess free removal Pressure sensitive.
            </p>
            
            <div className="product-info__divider"></div>
            
            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="product-options">
                <span className="product-options__label">Colours:</span>
                <div className="product-options__colors">
                  {product.colors.map(color => {
                    const hex = typeof color === 'string' ? color : color.hexCode;
                    return (
                      <button
                        key={hex}
                        className={`product-color-btn ${selectedColor === hex ? 'active' : ''}`}
                        style={{ backgroundColor: hex }}
                        onClick={() => setSelectedColor(hex)}
                        aria-label={`Select color ${hex}`}
                      />
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="product-options">
                <span className="product-options__label">Size:</span>
                <div className="product-options__sizes">
                  {product.sizes.map(sizeObj => {
                    const size = typeof sizeObj === 'string' ? sizeObj : sizeObj.size;
                    return (
                      <button 
                        key={size}
                        className={`product-options__size-btn ${selectedSize === size ? 'product-options__size-btn--active' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Actions */}
            <div className="product-actions">
              <div className="product-quantity">
                <button className="product-quantity__btn" onClick={() => handleQuantityChange('dec')}>-</button>
                <div className="product-quantity__val">{quantity}</div>
                <button className="product-quantity__btn product-quantity__btn--plus" onClick={() => handleQuantityChange('inc')}>+</button>
              </div>
              
              <Button 
                onClick={handleBuyNow} 
                className="product-actions__buy-btn"
                disabled={product.stockQuantity === 0}
              >
                Buy Now
              </Button>
              
              <button 
                className={`product-actions__wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                onClick={toggleWishlist}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill={isInWishlist(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>
            
            {/* Delivery Info */}
            <div className="product-delivery">
              <div className="product-delivery__item">
                <div className="product-delivery__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                </div>
                <div>
                  <h4 className="product-delivery__title">Free Delivery</h4>
                  <p className="product-delivery__text">Enter your postal code for Delivery Availability</p>
                </div>
              </div>
              
              <div className="product-delivery__item">
                <div className="product-delivery__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                </div>
                <div>
                  <h4 className="product-delivery__title">Return Delivery</h4>
                  <p className="product-delivery__text">Free 30 Days Delivery Returns. Details</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="product-reviews">
          <h2 className="product-reviews__title">Reviews ({product.ratingCount || reviews.length})</h2>
          
          <div className="product-reviews__list">
            {reviews.length === 0 ? (
              <p>No reviews yet. Be the first to review this product!</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-card__header">
                    <div className="review-card__user">
                      {review.user?.firstName} {review.user?.lastName}
                    </div>
                    <div className="review-card__date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <StarRating rating={review.rating} />
                  {review.comment && (
                    <p className="review-card__comment">{review.comment}</p>
                  )}
                </div>
              ))
            )}
          </div>
          
          <div className="review-form">
            <h3 className="review-form__title">Write a Review</h3>
            {reviewError && <p style={{color: 'var(--primary)', marginBottom: '16px'}}>{reviewError}</p>}
            
            <form onSubmit={handleReviewSubmit}>
              <div className="review-form__rating">
                <span className="review-form__rating-label">Your Rating:</span>
                <div className="review-form__stars">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg 
                      key={star} 
                      width="24" height="24" viewBox="0 0 24 24" 
                      fill={star <= newReviewRating ? "#FFAD33" : "none"} 
                      stroke={star <= newReviewRating ? "#FFAD33" : "currentColor"} 
                      strokeWidth="2"
                      onClick={() => setNewReviewRating(star)}
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <textarea 
                className="review-form__textarea" 
                placeholder="Share your thoughts about this product..."
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                required
              />
              
              <Button type="submit" disabled={isSubmittingReview}>
                {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          </div>
        </div>
        
        {/* Related Products */}
        <div className="related-products">
          <SectionHeader subtitle="Related Item" title="" />
          <div className="related-products__grid">
            {relatedProducts.map(item => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
