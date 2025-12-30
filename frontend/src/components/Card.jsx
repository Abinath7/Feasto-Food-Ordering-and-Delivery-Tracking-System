import React from 'react';

const Card = ({ children, className = '', title = '', footer = null }) => {
  return (
    <div className={`card ${className}`}>
      {title && <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>}
      <div>{children}</div>
      {footer && <div className="mt-4 pt-4 border-t border-gray-200">{footer}</div>}
    </div>
  );
};

export default Card;
