import './StarRating.css';

export default function StarRating({ rating = 0, maxStars = 5 }) {
  return (
    <div className="star-rating">
      {Array.from({ length: maxStars }, (_, i) => {
        const fillLevel = Math.min(Math.max(rating - i, 0), 1);
        return (
          <svg key={i} width="16" height="16" viewBox="0 0 16 16" className="star-rating__star">
            <defs>
              <linearGradient id={`star-fill-${i}-${rating}`}>
                <stop offset={`${fillLevel * 100}%`} stopColor="var(--star)" />
                <stop offset={`${fillLevel * 100}%`} stopColor="var(--star-empty)" />
              </linearGradient>
            </defs>
            <path
              d="M8 0.5L9.79 5.62H15.09L10.8 8.89L12.39 14.17L8 11.01L3.61 14.17L5.2 8.89L0.91 5.62H6.21L8 0.5Z"
              fill={`url(#star-fill-${i}-${rating})`}
            />
          </svg>
        );
      })}
    </div>
  );
}
