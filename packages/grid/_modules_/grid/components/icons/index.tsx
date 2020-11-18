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

export const SeparatorIcon = createSvgIcon(<path d="M11 19V5h2v14z" />, 'Separator');

export const ViewHeadlineIcon = createSvgIcon(
  <path d="M4 15h16v-2H4v2zm0 4h16v-2H4v2zm0-8h16V9H4v2zm0-6v2h16V5H4z" />,
  'ViewHeadline',
);

export const TableRowsIcon = createSvgIcon(
  <path d="M21,8H3V4h18V8z M21,10H3v4h18V10z M21,16H3v4h18V16z" />,
  'TableRows',
);

export const ViewStreamIcon = createSvgIcon(
  <React.Fragment><path d="M0 0h24v24H0z" fill="none"/><path d="M4 18h17v-6H4v6zM4 5v6h17V5H4z"/></React.Fragment>,
  'ViewStream',
);
