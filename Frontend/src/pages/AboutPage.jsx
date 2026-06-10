import Breadcrumb from '../components/layout/Breadcrumb';
import ServiceFeatures from '../components/home/ServiceFeatures';
import { teamMembers, stats } from '../data/products';
import './AboutPage.css';

export default function AboutPage() {
  return (
    <div className="about-page">
      <Breadcrumb />
      
      <div className="container">
        {/* Story Section */}
        <div className="about-page__story">
          <div className="about-page__story-content">
            <h1 className="about-page__title">Our Story</h1>
            <p className="about-page__text">
              Launced in 2015, Exclusive is South Asia's premier online shopping makterplace with an active presense in Bangladesh. Supported by wide range of tailored marketing, data and service solutions, Exclusive has 10,500 sallers and 300 brands and serves 3 millioons customers across the region.
            </p>
            <p className="about-page__text">
              Exclusive has more than 1 Million products to offer, growing at a very fast. Exclusive offers a diverse assotment in categories ranging from consumer.
            </p>
          </div>
          <div className="about-page__story-image">
            <div className="about-page__image-placeholder">Side Image</div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="about-page__stats">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-card__icon-wrapper">
                <div className="stat-card__icon">
                  {/* Map icon names to SVGs later, using a generic box here */}
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
                </div>
              </div>
              <h3 className="stat-card__value">{stat.value}</h3>
              <p className="stat-card__label">{stat.label}</p>
            </div>
          ))}
        </div>
        
        {/* Team Section */}
        <div className="about-page__team">
          {teamMembers.map(member => (
            <div key={member.id} className="team-card">
              <div className="team-card__image">
                <div className="team-card__image-placeholder">Image</div>
              </div>
              <div className="team-card__info">
                <h3 className="team-card__name">{member.name}</h3>
                <p className="team-card__role">{member.role}</p>
                <div className="team-card__social">
                  <a href="#"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>
                  <a href="#"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
                  <a href="#"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="about-page__dots">
          <span className="about-page__dot"></span>
          <span className="about-page__dot"></span>
          <span className="about-page__dot about-page__dot--active"></span>
          <span className="about-page__dot"></span>
          <span className="about-page__dot"></span>
        </div>
      </div>
      
      <ServiceFeatures />
    </div>
  );
}
