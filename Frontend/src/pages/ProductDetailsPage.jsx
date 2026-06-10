import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
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
  const navigate = useNavigate();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

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
    }
  }, [product]);
  const relatedProducts = product ? products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4) : [];

  if (!product) {
    return <div className="container" style={{padding: '100px 0', textAlign: 'center'}}>Loading product...</div>;
  }

  const handleQuantityChange = (type) => {
    if (type === 'dec' && quantity > 1) {
      setQuantity(quantity - 1);
    } else if (type === 'inc') {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
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
              <span className="product-info__stock">In Stock</span>
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
              
              <Button onClick={handleBuyNow} className="product-actions__buy-btn">Buy Now</Button>
              
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
