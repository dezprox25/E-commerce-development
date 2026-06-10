import './ServiceFeatures.css';

export default function ServiceFeatures() {
  const features = [
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13"></rect>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
          <circle cx="5.5" cy="18.5" r="2.5"></circle>
          <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
      ),
      title: "FREE AND FAST DELIVERY",
      desc: "Free delivery for all orders over $140"
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
        </svg>
      ),
      title: "24/7 CUSTOMER SERVICE",
      desc: "Friendly 24/7 customer support"
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <polyline points="9 12 11 14 15 10"></polyline>
        </svg>
      ),
      title: "MONEY BACK GUARANTEE",
      desc: "We return money within 30 days"
    }
  ];

  return (
    <section className="section service-features">
      <div className="container">
        <div className="service-features__grid">
          {features.map((feature, index) => (
            <div key={index} className="service-feature">
              <div className="service-feature__icon-wrapper">
                <div className="service-feature__icon">
                  {feature.icon}
                </div>
              </div>
              <h4 className="service-feature__title">{feature.title}</h4>
              <p className="service-feature__desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
