import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../../data/products';
import SectionHeader from '../ui/SectionHeader';
import ArrowButtons from '../ui/ArrowButtons';
import CategoryCard from '../ui/CategoryCard';
import './Categories.css';

export default function Categories() {
  const scrollRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState(categories[3].id);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="section categories">
      <div className="container">
        <SectionHeader 
          subtitle="Categories" 
          title="Browse By Category" 
          rightContent={
            <ArrowButtons 
              onPrev={() => scroll('left')} 
              onNext={() => scroll('right')} 
            />
          } 
        />
        
        <div className="categories__list" ref={scrollRef}>
          {categories.map(category => (
            <Link to={`/category/${category.name.toLowerCase()}`} key={category.id} style={{ textDecoration: 'none' }}>
              <CategoryCard 
                icon={category.icon} 
                name={category.name} 
                isActive={category.id === activeCategory}
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="divider divider--section"></div>
    </section>
  );
}
