import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import appleLogo from '../../assets/1200px-Apple_gray_logo 1.png';
import heroImage from '../../assets/hero_endframe__cvklg0xk3w6e_large 2.png';
import ps5Image from '../../assets/ps5-slim-goedkope-playstation_large 1.png';
import jblImage from '../../assets/JBL_BOOMBOX_2_HERO_020_x1 (1) 1.png';
import echoImage from '../../assets/69-694768_amazon-echo-png-clipart-transparent-amazon-echo-png 1.png';
import womanImage from '../../assets/attractive-woman-wearing-hat-posing-black-background 1.png';
import { sidebarCategories } from '../../data/products';
import './HeroBanner.css';

const slides = [
  {
    id: 0,
    logo: appleLogo,
    subtitle: 'iPhone 14 Series',
    title: <>Up to 10%<br/>off Voucher</>,
    link: '/category/electronics',
    image: heroImage,
    bg: '#000000',
  },
  {
    id: 1,
    logo: null,
    subtitle: 'PlayStation 5',
    title: <>Next-Gen<br/>Gaming Console</>,
    link: '/category/gaming',
    image: ps5Image,
    bg: '#1a1a2e',
  },
  {
    id: 2,
    logo: null,
    subtitle: 'JBL Boombox',
    title: <>Music to<br/>Move You</>,
    link: '/products',
    image: jblImage,
    bg: '#16213e',
  },
  {
    id: 3,
    logo: null,
    subtitle: 'Women\'s Collection',
    title: <>New Season<br/>Arrivals</>,
    link: '/category/womens-fashion',
    image: womanImage,
    bg: '#1b1b1b',
  },
  {
    id: 4,
    logo: null,
    subtitle: 'Smart Home',
    title: <>Your Home<br/>Made Smart</>,
    link: '/category/electronics',
    image: echoImage,
    bg: '#0f3460',
  },
];

const AUTO_PLAY_INTERVAL = 4000; // 4 seconds per slide

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, goToSlide]);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(nextSlide, AUTO_PLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = slides[currentSlide];

  return (
    <section className="hero-banner">
      <div className="container hero-banner__inner">
        {/* Sidebar */}
        <div className="hero-banner__sidebar">
          <ul className="hero-banner__menu">
            {sidebarCategories.map((category, index) => (
              <li key={index} className="hero-banner__menu-item">
                <Link to={`/category/${category.slug}`} className="hero-banner__menu-link">
                  {category.name}
                  {category.hasDropdown && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Carousel / Banner */}
        <div className="hero-banner__carousel">
          <div
            className="hero-banner__slide"
            style={{ backgroundColor: slide.bg }}
            key={slide.id}
          >
            <div className={`hero-banner__content hero-banner__fade-in`}>
              <div className="hero-banner__logo-row">
                {slide.logo && (
                  <img src={slide.logo} alt="Logo" style={{ width: '40px', objectFit: 'contain' }} />
                )}
                <span className="hero-banner__subtitle">{slide.subtitle}</span>
              </div>
              <h1 className="hero-banner__title">{slide.title}</h1>
              <Link to={slide.link} className="hero-banner__cta">
                Shop Now
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Link>
            </div>
            <div className="hero-banner__image hero-banner__fade-in">
              <div className="hero-banner__image-placeholder">
                <img src={slide.image} alt={slide.subtitle} />
              </div>
            </div>
          </div>
          
          <div className="hero-banner__dots">
            {slides.map((s, i) => (
              <span
                key={s.id}
                className={`hero-banner__dot ${i === currentSlide ? 'hero-banner__dot--active' : ''}`}
                onClick={() => goToSlide(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
