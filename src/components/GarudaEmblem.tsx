import React from 'react';

interface GarudaEmblemProps {
  className?: string;
  size?: number;
}

const GarudaEmblem: React.FC<GarudaEmblemProps> = ({ className = '', size = 80 }) => {
  return (
    <img
      src="/logo-emblem.png"
      alt="Garuda Dhhruvam Foundation Logo"
      width={size}
      height={size}
      className={className}
      style={{ 
        objectFit: 'contain',
        borderRadius: '50%',
        border: '2px solid rgba(255, 255, 255, 0.2)'
      }}
    />
  );
};

export default GarudaEmblem; 