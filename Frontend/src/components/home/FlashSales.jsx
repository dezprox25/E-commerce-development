import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import SectionHeader from '../ui/SectionHeader';
import CountdownTimer from '../ui/CountdownTimer';
import ArrowButtons from '../ui/ArrowButtons';
import ProductCard from '../ui/ProductCard';
import Button from '../ui/Button';
import './FlashSales.css';

export default function FlashSales() {
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

  // Target date is set a few days in the future for demo
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 3);

  // Use backend products with a discount
  const flashSaleProducts = products.filter(p => p.discount > 0);
  const displayProducts = flashSaleProducts.length > 0 ? flashSaleProducts : products.slice(0, 4);

  return (
    <section className="section flash-sales">
      <div className="container">
        <SectionHeader 
          subtitle="Today's" 
          title="Flash Sales" 
          rightContent={
            <>
              <div className="flash-sales__timer-wrapper">
                <CountdownTimer targetDate={targetDate} />
              </div>
              <ArrowButtons 
                onPrev={() => scroll('left')} 
                onNext={() => scroll('right')} 
                className="flash-sales__arrows"
              />
            </>
          } 
        />
        
        <div className="flash-sales__products" ref={scrollRef}>
          {displayProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              showDiscount={true} 
            />
          ))}
        </div>

        <div className="flash-sales__footer">
          <Link to="/products?type=flash-sales" style={{ textDecoration: 'none' }}>
            <Button>View All Products</Button>
          </Link>
        </div>
      </div>
      <div className="divider divider--section"></div>
    </section>
  );
}
