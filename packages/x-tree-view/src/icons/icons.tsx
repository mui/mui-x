import { createSvgIcon } from '@mui/material/utils';
import * as React from 'react';

export const TreeViewExpandIcon = createSvgIcon(
  <path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />,
  'TreeViewExpandIcon',
);

export const TreeViewCollapseIcon = createSvgIcon(
  <path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z" />,
  'TreeViewCollapseIcon',
);
