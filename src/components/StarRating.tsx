'use client';

import { useState, useCallback, MouseEvent } from 'react';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  allowHalf?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export function StarRating({
  value,
  onChange,
  max = 5,
  size = 'md',
  readOnly = false,
  allowHalf = true,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue ?? value;

  const getStarValue = useCallback(
    (star: number, event: MouseEvent<HTMLButtonElement>) => {
      if (!allowHalf) return star;
      
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const isLeftHalf = x < rect.width / 2;
      
      return isLeftHalf ? star - 0.5 : star;
    },
    [allowHalf]
  );

  const handleClick = useCallback(
    (star: number, event: MouseEvent<HTMLButtonElement>) => {
      if (readOnly) return;
      const newValue = getStarValue(star, event);
      onChange(newValue);
    },
    [readOnly, getStarValue, onChange]
  );

  const handleMouseMove = useCallback(
    (star: number, event: MouseEvent<HTMLButtonElement>) => {
      if (readOnly) return;
      const newValue = getStarValue(star, event);
      setHoverValue(newValue);
    },
    [readOnly, getStarValue]
  );

  const handleMouseLeave = useCallback(() => {
    if (!readOnly) {
      setHoverValue(null);
    }
  }, [readOnly]);

  // Determine fill state for each star
  const getStarFill = (star: number): 'full' | 'half' | 'empty' => {
    if (displayValue >= star) return 'full';
    if (displayValue >= star - 0.5) return 'half';
    return 'empty';
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => {
        const fill = getStarFill(star);

        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={(e) => handleClick(star, e)}
            onMouseMove={(e) => handleMouseMove(star, e)}
            onMouseLeave={handleMouseLeave}
            className={`${readOnly ? 'cursor-default' : 'cursor-pointer'} 
                       transition-transform duration-150 hover:scale-110
                       disabled:hover:scale-100 relative`}
            aria-label={`Rate ${star} out of ${max}`}
          >
            {/* Background star (empty) */}
            <svg
              className={`${sizeClasses[size]} text-zinc-600`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            
            {/* Filled star overlay */}
            {fill !== 'empty' && (
              <svg
                className={`${sizeClasses[size]} text-amber-400 absolute top-0 left-0 transition-colors duration-150`}
                fill="currentColor"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{
                  clipPath: fill === 'half' ? 'inset(0 50% 0 0)' : undefined,
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            )}
          </button>
        );
      })}
      {value > 0 ? (
        <span className="ml-2 text-zinc-400 text-sm">
          {value} / {max}
        </span>
      ) : !readOnly ? (
        <span className="ml-2 text-zinc-500 text-sm">
          Click to rate
        </span>
      ) : null}
    </div>
  );
}
