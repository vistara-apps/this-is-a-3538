import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  variant?: 'interactive' | 'static';
  size?: 'sm' | 'md' | 'lg';
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export function RatingStars({
  rating,
  maxRating = 5,
  variant = 'static',
  size = 'md',
  onRatingChange,
  className = ''
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleClick = (starRating: number) => {
    if (variant === 'interactive' && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleMouseEnter = (starRating: number) => {
    if (variant === 'interactive') {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (variant === 'interactive') {
      setHoverRating(0);
    }
  };

  const getStarColor = (starIndex: number): string => {
    const currentRating = variant === 'interactive' && hoverRating > 0 ? hoverRating : rating;
    
    if (starIndex <= currentRating) {
      return 'text-yellow-400 fill-current';
    } else if (starIndex - 0.5 <= currentRating) {
      return 'text-yellow-400 fill-current opacity-50';
    } else {
      return 'text-gray-300';
    }
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starIndex = index + 1;
        return (
          <button
            key={starIndex}
            type="button"
            className={`
              ${variant === 'interactive' ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
              ${sizeClasses[size]}
            `}
            onClick={() => handleClick(starIndex)}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onMouseLeave={handleMouseLeave}
            disabled={variant === 'static'}
          >
            <Star
              className={`${sizeClasses[size]} ${getStarColor(starIndex)} transition-colors`}
            />
          </button>
        );
      })}
      
      {variant === 'static' && (
        <span className="ml-2 text-sm text-gray-400">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
