import { Link } from 'react-router-dom';
import SectionHeader from '../ui/SectionHeader';
import ps5Img from '../../assets/ps5-slim-goedkope-playstation_large 1.png';
import womanImg from '../../assets/attractive-woman-wearing-hat-posing-black-background 1.png';
import speakerImg from '../../assets/69-694768_amazon-echo-png-clipart-transparent-amazon-echo-png 1.png';
import perfumeImg from '../../assets/652e82cd70aa6522dd785109a455904c.png';
import './NewArrivals.css';

export default function NewArrivals() {
  return (
    <section className="section new-arrivals">
      <div className="container">
        <SectionHeader subtitle="Featured" title="New Arrival" />
        
        <div className="bento-grid">
          {/* Main Left - PS5 */}
          <div className="bento-item bento-item--large">
            <div className="bento-item__bg">
              <div className="bento-item__image-placeholder">
                <img src={ps5Img} alt="" />
              </div>
            </div>
            <div className="bento-item__content">
              <h3 className="bento-item__title">PlayStation 5</h3>
              <p className="bento-item__desc">Black and White version of the PS5 coming out on sale.</p>
              <Link to="/product/17" className="bento-item__link">Shop Now</Link>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="bento-right">
            {/* Top Right - Women's Collections */}
            <div className="bento-item bento-item--wide">
              <div className="bento-item__bg">
                <div className="bento-item__image-placeholder">
                  <img src={womanImg} alt="" />
                </div>
              </div>
              <div className="bento-item__content">
                <h3 className="bento-item__title">Women's Collections</h3>
                <p className="bento-item__desc">Featured woman collections that give you another vibe.</p>
                <Link to="/products" className="bento-item__link">Shop Now</Link>
              </div>
            </div>
            
            {/* Bottom Right Row */}
            <div className="bento-bottom-row">
              {/* Bottom Left - Speakers */}
              <div className="bento-item bento-item--small">
                <div className="bento-item__bg">
                  <div className="bento-item__image-placeholder">
                    <img src={speakerImg} alt="" />
                  </div>
                </div>
                <div className="bento-item__content">
                  <h3 className="bento-item__title">Speakers</h3>
                  <p className="bento-item__desc">Amazon wireless speakers</p>
                  <Link to="/products" className="bento-item__link">Shop Now</Link>
                </div>
              </div>
              
              {/* Bottom Right - Perfume */}
              <div className="bento-item bento-item--small">
                <div className="bento-item__bg">
                  <div className="bento-item__image-placeholder">
                    <img src={perfumeImg} alt="" />
                  </div>
                </div>
                <div className="bento-item__content">
                  <h3 className="bento-item__title">Perfume</h3>
                  <p className="bento-item__desc">GUCCI INTENSE OUD EDP</p>
                  <Link to="/products" className="bento-item__link">Shop Now</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
