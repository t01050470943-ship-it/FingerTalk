function Card({ children, className = '', hover = true, ...props }) {
    return (
        <div
            className={`
        card
        ${hover ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : ''}
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
}

export default Card;
