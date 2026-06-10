

export default function Button({ children, variant = 'primary', size = 'lg', fullWidth = false, onClick, className = '', type = 'button' }) {
  const classes = `btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${className}`;
  
  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
