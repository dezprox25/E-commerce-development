import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import SectionHeader from '../ui/SectionHeader';
import ArrowButtons from '../ui/ArrowButtons';
import ProductCard from '../ui/ProductCard';
import Button from '../ui/Button';
import './ExploreProducts.css';

export default function ExploreProducts() {
  const scrollRef = useRef(null);
  const { products } = useProducts();

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Group products into 2 rows for the grid
  // Using all products or specific categories from backend
  const exploreProducts = products.filter(p => p.category === 'electronics' || p.category === 'furniture');
  // Fallback to all if empty
  const displayProducts = exploreProducts.length > 0 ? exploreProducts : products;
  
  const row1 = displayProducts.slice(0, 4);
  const row2 = displayProducts.slice(4, 8);

  return (
    <section className="section explore-products">
      <div className="container">
        <SectionHeader 
          subtitle="Our Products" 
          title="Explore Our Products" 
          rightContent={
            <ArrowButtons 
              onPrev={() => scroll('left')} 
              onNext={() => scroll('right')} 
            />
          } 
        />
        
        <div className="explore-products__grid" ref={scrollRef}>
          <div className="explore-products__row">
            {row1.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
              />
            ))}
          </div>
          <div className="explore-products__row">
            {row2.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
              />
            ))}
          </div>
        </div>

        <div className="explore-products__footer">
          <Link to="/explore" style={{ textDecoration: 'none' }}>
            <Button>View All Products</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
