import './SectionHeader.css';

export default function SectionHeader({ subtitle, title, rightContent, className = '' }) {
  return (
    <div className={`section-header ${className}`}>
      <div className="section-header__left">
        <div className="section-header__subtitle-row">
          <span className="section-header__indicator"></span>
          <span className="section-header__subtitle">{subtitle}</span>
        </div>
        <h2 className="section-header__title">{title}</h2>
      </div>
      {rightContent && (
        <div className="section-header__right">
          {rightContent}
        </div>
      )}
    </div>
  );
}
