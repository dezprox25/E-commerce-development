import { Link } from 'react-router-dom';
import CountdownTimer from '../ui/CountdownTimer';
import Button from '../ui/Button';
import jblImg from '../../assets/JBL_BOOMBOX_2_HERO_020_x1 (1) 1.png';
import './MusicBanner.css';

export default function MusicBanner() {
  return (
    <section className="section">
      <div className="container">
        <div className="music-banner">
          <div className="music-banner__content">
            <span className="music-banner__category">Categories</span>
            <h2 className="music-banner__title">Enhance Your<br/>Music Experience</h2>
            
            <div className="music-banner__timer">
              <CountdownTimer variant="circular" storageKey="music-banner-timer" durationDays={5} />
            </div>
            
            <Link to="/category/electronics" style={{ textDecoration: 'none' }}>
              <Button variant="success">Buy Now!</Button>
            </Link>
          </div>
          
          <div className="music-banner__image-wrapper">
            <div className="music-banner__glow"></div>
            <div className="music-banner__image-placeholder">
              <img src={jblImg} alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
