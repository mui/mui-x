import { createSvgIcon } from '@mui/material/utils';
import * as React from 'react';

/**
 * @ignore - internal component.
 */
export const ArrowDropDown = createSvgIcon(<path d="M7 10l5 5 5-5z" />, 'ArrowDropDown');

/**
 * @ignore - internal component.
 */
export const ArrowLeft = createSvgIcon(
  <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />,
  'ArrowLeft',
);

/**
 * @ignore - internal component.
 */
export const ArrowRight = createSvgIcon(
  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />,
  'ArrowRight',
);

/**
 * @ignore - internal component.
 */
export const Calendar = createSvgIcon(
  <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />,
  'Calendar',
);

/**
 * @ignore - internal component.
 */
export const Clock = createSvgIcon(
  <React.Fragment>
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
    <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </React.Fragment>,
  'Clock',
);

/**
 * @ignore - internal component.
 */
export const DateRange = createSvgIcon(
  <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />,
  'DateRange',
);

/**
 * @ignore - internal component.
 */
export const Pen = createSvgIcon(
  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />,
  'Pen',
);

/**
 * @ignore - internal component.
 */
export const Time = createSvgIcon(
  <React.Fragment>
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
    <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </React.Fragment>,
  'Time',
);
