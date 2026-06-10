import * as React from 'react';
import { type IconType } from './weatherForecast';

export function WeatherIcon({ type }: { type: IconType }) {
  const isRain = type === 'rain';
  const isMoon = type === 'moon-cloud';
  const isSun = type === 'partly-cloudy';

  return (
    <g>
      {isSun && (
        <g transform="translate(-7 -7)">
          <circle r={5} fill="#ffd54f" stroke="#f57f17" strokeWidth={1.2} />
          <path
            d="M 0 -10 V -7 M 0 7 V 10 M -10 0 H -7 M 7 0 H 10 M -7 -7 L -5 -5 M 7 -7 L 5 -5"
            stroke="#f57f17"
            strokeWidth={1.2}
            strokeLinecap="round"
          />
        </g>
      )}
      {isMoon && (
        <path d="M -7 -10 A 3 3 0 0 0 -7 4 A 15 15 0 0 1 -7 -10 Z" fill="#90a4ae" />
      )}
      <path
        d="M -8 1 A 7 7 0 0 1 5 -3 A 5 5 0 0 1 9 7 H -9 A 5 5 0 0 1 -8 1 Z"
        fill={isRain ? '#bbdefb' : '#cfd8dc'}
        stroke={isRain ? '#1976d2' : '#78909c'}
        strokeWidth={1.4}
      />
      {isRain && (
        <path
          d="M -5 11 L -7 15 M 0 11 L -2 15 M 5 11 L 3 15"
          stroke="#1976d2"
          strokeWidth={1.2}
          strokeLinecap="round"
        />
      )}
    </g>
  );
}
