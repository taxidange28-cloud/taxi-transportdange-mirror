import React from 'react';

/**
 * Logo component for Transport DanGE - Taxi Dunois
 * @param {Object} props
 * @param {string} props.size - Size of logo: 'sm' (32px), 'md' (48px), 'lg' (64px), 'xl' (120px)
 * @param {boolean} props.showText - Whether to show text beside logo (default: true)
 * @param {string} props.className - Additional CSS classes
 */
const Logo = ({ size = 'md', showText = true, className = '' }) => {
  // Size mappings
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-32 w-32'
  };

  const textSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-xl',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl'
  };

  const logoSize = sizes[size] || sizes.md;
  const textSize = textSizes[size] || textSizes.md;

  return (
    <div className={`flex items-center space-x-2 sm:space-x-3 ${className}`}>
      <img 
        src="/logo.svg" 
        alt="Transport DanGE Logo" 
        className={`${logoSize} object-contain flex-shrink-0`}
      />
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSize} font-bold text-primary leading-tight`}>
            <span className="hidden sm:inline">Transport </span>DanGE
          </h1>
          <span className="text-xs text-gray-500 hidden sm:block">
            Taxi Dunois
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
