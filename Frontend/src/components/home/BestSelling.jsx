import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import SectionHeader from '../ui/SectionHeader';
import ProductCard from '../ui/ProductCard';
import Button from '../ui/Button';
import './BestSelling.css';

export default function BestSelling() {
  const { products } = useProducts();

  // Use backend products (maybe top rated or most sold, we'll use top rated for demo)
  const bestSellingProducts = products.filter(p => p.rating >= 4.5);
  const displayProducts = bestSellingProducts.length > 0 ? bestSellingProducts.slice(0, 4) : products.slice(0, 4);

  return (
    <section className="section best-selling">
      <div className="container">
        <SectionHeader 
          subtitle="This Month" 
          title="Best Selling Products" 
          rightContent={
            <Link to="/products?type=best-selling" style={{ textDecoration: 'none' }}>
              <Button>View All</Button>
            </Link>
          } 
        />
        
        <div className="best-selling__grid">
          {displayProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
