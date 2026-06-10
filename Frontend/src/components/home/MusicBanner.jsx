import CountdownTimer from '../ui/CountdownTimer';
import Button from '../ui/Button';
import jblImg from '../../assets/JBL_BOOMBOX_2_HERO_020_x1 (1) 1.png';
import './MusicBanner.css';

export default function MusicBanner() {
  // Target date set 5 days in future for demo
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 5);

  return (
    <section className="section">
      <div className="container">
        <div className="music-banner">
          <div className="music-banner__content">
            <span className="music-banner__category">Categories</span>
            <h2 className="music-banner__title">Enhance Your<br/>Music Experience</h2>
            
            <div className="music-banner__timer">
              <CountdownTimer targetDate={targetDate} variant="circular" />
            </div>
            
            <Button variant="success">Buy Now!</Button>
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
