import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import Breadcrumb from '../components/layout/Breadcrumb';
import ProductCard from '../components/ui/ProductCard';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import './WishlistPage.css';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { products } = useProducts();

  const handleMoveAllToCart = () => {
    wishlistItems.forEach(item => {
      addToCart(item);
      removeFromWishlist(item.id);
    });
  };

  const justForYouProducts = products.slice(12, 16);

  return (
    <div className="wishlist-page">
      <div className="container">
        
        {/* Wishlist Section */}
        <div className="wishlist-section">
          <div className="wishlist-section__header">
            <h3 className="wishlist-section__title">Wishlist ({wishlistItems.length})</h3>
            <Button variant="secondary" onClick={handleMoveAllToCart} disabled={wishlistItems.length === 0}>
              Move All To Bag
            </Button>
          </div>
          
          <div className="wishlist-section__grid">
            {wishlistItems.length > 0 ? (
              wishlistItems.map(item => (
                <ProductCard 
                  key={item.id} 
                  product={item} 
                  showDelete={true}
                  onDelete={removeFromWishlist}
                  compact={true}
                />
              ))
            ) : (
              <p className="wishlist-section__empty">Your wishlist is empty.</p>
            )}
          </div>
        </div>

        {/* Just For You Section */}
        <div className="just-for-you-section">
          <SectionHeader 
            subtitle="Just For You" 
            title="" 
            rightContent={
              <Button variant="secondary">See All</Button>
            } 
          />
          
          <div className="wishlist-section__grid">
            {justForYouProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                showDiscount={true}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
