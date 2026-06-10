import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { categories } from '../data/products';
import Breadcrumb from '../components/layout/Breadcrumb';
import CategoryCard from '../components/ui/CategoryCard';
import ProductCard from '../components/ui/ProductCard';
import './ExplorePage.css';

export default function ExplorePage() {
  const { products, loading } = useProducts();
  const [activeCategory, setActiveCategory] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // 2 rows of 4 for desktop

  if (loading) {
    return <div className="container" style={{padding: '100px 0', textAlign: 'center'}}>Loading...</div>;
  }

  // Filter products by category if one is selected
  const categoryProducts = activeCategory 
    ? products.filter(p => 
        p.category.toLowerCase() === activeCategory.toLowerCase() || 
        p.category.toLowerCase() === activeCategory.replace('-', ' ').toLowerCase() ||
        p.category.toLowerCase().includes(activeCategory.toLowerCase())
      )
    : products;

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = categoryProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(categoryProducts.length / productsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 300, behavior: 'smooth' }); // Scroll back to grid start
  };

  const handleCategorySelect = (categoryId) => {
    // If clicking same category, deselect it (show all)
    setActiveCategory(prev => prev === categoryId ? null : categoryId);
    setCurrentPage(1); // Reset pagination on filter change
  };

  return (
    <div className="page-wrapper explore-page">
      <Breadcrumb />
      
      <div className="container" style={{ paddingBottom: '140px' }}>
        
        {/* Category Picker Section */}
        <div className="explore-page__categories">
          <h1 className="explore-page__title">Explore Categories</h1>
          <p className="explore-page__subtitle">Select a category below to filter products, or browse them all.</p>
          
          <div className="explore-page__category-grid">
            {categories.map(category => (
              <div 
                key={category.id} 
                onClick={() => handleCategorySelect(category.name.toLowerCase())}
                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
              >
                <CategoryCard 
                  icon={category.icon} 
                  name={category.name} 
                  isActive={activeCategory === category.name.toLowerCase()}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="divider divider--section"></div>

        {/* Product Grid Section */}
        <div className="explore-page__products">
          <h2 className="explore-page__products-title">
            {activeCategory ? `${activeCategory.replace('-', ' ')} Products` : 'All Products'}
          </h2>

          {categoryProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-secondary)' }}>
              No products found.
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '30px' }}>
                {currentProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '60px' }}>
                  <button 
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                  >
                    &lt;
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button 
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        
      </div>
    </div>
  );
}
