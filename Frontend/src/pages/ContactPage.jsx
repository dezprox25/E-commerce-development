import Breadcrumb from '../components/layout/Breadcrumb';
import Button from '../components/ui/Button';
import './ContactPage.css';

export default function ContactPage() {
  return (
    <div className="contact-page">
      <Breadcrumb />
      
      <div className="container">
        <div className="contact-page__inner">
          
          <div className="contact-info">
            <div className="contact-info__section">
              <div className="contact-info__header">
                <div className="contact-info__icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <h3 className="contact-info__title">Call To Us</h3>
              </div>
              <p className="contact-info__text">We are available 24/7, 7 days a week.</p>
              <p className="contact-info__text">Phone: +8801611112222</p>
            </div>
            
            <div className="contact-info__divider"></div>
            
            <div className="contact-info__section">
              <div className="contact-info__header">
                <div className="contact-info__icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <h3 className="contact-info__title">Write To US</h3>
              </div>
              <p className="contact-info__text">Fill out our form and we will contact you within 24 hours.</p>
              <p className="contact-info__text">Emails: customer@exclusive.com</p>
              <p className="contact-info__text">Emails: support@exclusive.com</p>
            </div>
          </div>
          
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="contact-form__row">
              <input type="text" className="input" placeholder="Your Name *" required />
              <input type="email" className="input" placeholder="Your Email *" required />
              <input type="tel" className="input" placeholder="Your Phone *" required />
            </div>
            
            <textarea className="textarea" placeholder="Your Message"></textarea>
            
            <div className="contact-form__submit">
              <Button type="submit">Send Message</Button>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
}
