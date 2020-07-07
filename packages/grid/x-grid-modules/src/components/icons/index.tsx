import * as React from 'react';
import { createSvgIcon } from '@material-ui/core/utils';

export const ArrowUpward = createSvgIcon(
  <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />,
  'ArrowUpward',
);

export const ArrowDownward = createSvgIcon(
  <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />,
  'ArrowDownward',
);

const Remove = createSvgIcon(<path d="M19 13H5v-2h14v2z" />, 'Remove');
export const SeparatorIcon = (props: any) => (
  <Remove style={{ transform: 'rotate(90deg)' }} {...props} />
);
