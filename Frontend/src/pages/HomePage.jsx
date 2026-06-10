import { useEffect } from 'react';
import HeroBanner from '../components/home/HeroBanner';
import FlashSales from '../components/home/FlashSales';
import Categories from '../components/home/Categories';
import BestSelling from '../components/home/BestSelling';
import MusicBanner from '../components/home/MusicBanner';
import ExploreProducts from '../components/home/ExploreProducts';
import NewArrivals from '../components/home/NewArrivals';
import ServiceFeatures from '../components/home/ServiceFeatures';

export default function HomePage() {
  // Scroll handled by ScrollToTop globally

  return (
    <main>
      <HeroBanner />
      <FlashSales />
      <Categories />
      <BestSelling />
      <MusicBanner />
      <ExploreProducts />
      <NewArrivals />
      <ServiceFeatures />
      
      {/* Scroll to Top Button */}
      <button 
        className="scroll-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
      </button>
    </main>
  );
}
