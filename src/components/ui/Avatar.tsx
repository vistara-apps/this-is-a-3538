import React from 'react';
import { generateAvatarColor } from '../../utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'withStatus';
  status?: 'online' | 'offline' | 'busy';
  className?: string;
}

export function Avatar({ 
  src, 
  alt, 
  name, 
  size = 'md', 
  variant = 'default',
  status,
  className = '' 
}: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500'
  };

  const statusSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4'
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarColor = name ? generateAvatarColor(name) : 'bg-gray-500';

  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`
        ${sizeClasses[size]} 
        rounded-full 
        flex 
        items-center 
        justify-center 
        font-medium 
        text-white 
        overflow-hidden
        ${!src ? avatarColor : ''}
      `}>
        {src ? (
          <img 
            src={src} 
            alt={alt || name || 'Avatar'} 
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{name ? getInitials(name) : '?'}</span>
        )}
      </div>
      
      {variant === 'withStatus' && status && (
        <div className={`
          absolute 
          bottom-0 
          right-0 
          ${statusSizes[size]} 
          ${statusColors[status]} 
          rounded-full 
          border-2 
          border-white
        `} />
      )}
    </div>
  );
}
