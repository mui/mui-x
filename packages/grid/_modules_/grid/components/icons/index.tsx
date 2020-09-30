import * as React from 'react';
import { createSvgIcon } from '@material-ui/core/utils';

export const ArrowUpwardIcon = createSvgIcon(
  <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />,
  'ArrowUpward',
);

export const ArrowDownwardIcon = createSvgIcon(
  <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />,
  'ArrowDownward',
);

export const FilterIcon = createSvgIcon(
  <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />,
  'FilterList',
);

export const SeparatorIcon = createSvgIcon(<path d="M11 19V5h2v14z" />, 'Separator');
