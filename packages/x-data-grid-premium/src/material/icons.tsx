import * as React from 'react';
import { createSvgIcon } from '@mui/material/utils';

export const GridWorkspacesIcon = createSvgIcon(
  <g>
    <path d="M6,13c-2.2,0-4,1.8-4,4s1.8,4,4,4s4-1.8,4-4S8.2,13,6,13z M12,3C9.8,3,8,4.8,8,7s1.8,4,4,4s4-1.8,4-4S14.2,3,12,3z M18,13 c-2.2,0-4,1.8-4,4s1.8,4,4,4s4-1.8,4-4S20.2,13,18,13z" />
  </g>,
  'Workspaces',
);

export const GridGroupWorkIcon = createSvgIcon(
  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8 17.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM9.5 8c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5S9.5 9.38 9.5 8zm6.5 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />,
  'GroupWork',
);

export const GridFunctionsIcon = createSvgIcon(
  <path d="M18 4H6v2l6.5 6L6 18v2h12v-3h-7l5-5-5-5h7z" />,
  'Functions',
);

export const GridSendPromptIcon = createSvgIcon(
  <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />,
  'SendPrompt',
);

export const GridRecordPromptIcon = createSvgIcon(
  <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3m5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72z" />,
  'RecordPrompt',
);

export const GridMoveToTopIcon = createSvgIcon(
  <path d="m7.41 18.205 4.59-4.59 4.59 4.59 1.41-1.41-6-6-6 6 1.41 1.41ZM6 7.795v-2h12v2H6Z" />,
  'MoveToTop',
);

export const GridMoveToBottomIcon = createSvgIcon(
  <path d="M16.59 5.795 12 10.385l-4.59-4.59L6 7.205l6 6 6-6-1.41-1.41ZM18 16.205v2H6v-2h12Z" />,
  'MoveToBottom',
);

export const GridExpandLessIcon = createSvgIcon(
  <path d="m12 8.295-6 6 1.41 1.41 4.59-4.58 4.59 4.58 1.41-1.41-6-6Z" />,
  'ExpandLess',
);

export const GridPivotIcon = createSvgIcon(
  <path d="M10 8h11V5c0-1.1-.9-2-2-2h-9zM3 8h5V3H5c-1.1 0-2 .9-2 2zm2 13h3V10H3v9c0 1.1.9 2 2 2m8 1-4-4 4-4zm1-9 4-4 4 4zm.58 6H13v-2h1.58c1.33 0 2.42-1.08 2.42-2.42V13h2v1.58c0 2.44-1.98 4.42-4.42 4.42" />,
  'Pivot',
);
