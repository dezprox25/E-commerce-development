import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import Breadcrumb from '../components/layout/Breadcrumb';
import ProductCard from '../components/ui/ProductCard';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const { products, loading } = useProducts();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  if (loading) {
    return <div className="container" style={{padding: '100px 0', textAlign: 'center'}}>Loading products...</div>;
  }

  // Filter products by category
  // Sometimes category might have hyphens or different casing, handle gracefully
  const categoryProducts = products.filter(p => 
    p.category.toLowerCase() === categoryId.toLowerCase() || 
    p.category.toLowerCase() === categoryId.replace('-', ' ').toLowerCase() ||
    p.category.toLowerCase().includes(categoryId.toLowerCase())
  );

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = categoryProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(categoryProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="page-wrapper">
      <Breadcrumb />
      
      <div className="container" style={{ paddingBottom: '140px' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '40px', fontFamily: 'var(--font-secondary)', textTransform: 'capitalize' }}>
          {categoryId.replace('-', ' ')} Products
        </h1>
        
        {categoryProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-secondary)' }}>
            No products found in this category.
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
                  style={{
                    width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid var(--border-medium)', borderRadius: '4px', background: 'transparent',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1
                  }}
                >
                  &lt;
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    style={{
                      width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1px solid var(--border-medium)', borderRadius: '4px', cursor: 'pointer',
                      background: currentPage === i + 1 ? 'var(--primary)' : 'transparent',
                      color: currentPage === i + 1 ? 'white' : 'var(--text-primary)',
                      borderColor: currentPage === i + 1 ? 'var(--primary)' : 'var(--border-medium)'
                    }}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid var(--border-medium)', borderRadius: '4px', background: 'transparent',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1
                  }}
                >
                  &gt;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
