import {
  sankeyLeft,
  sankeyRight,
  sankeyCenter,
  sankeyJustify,
} from '@mui/x-charts-vendor/d3-sankey';
import type { SankeyNodeOptions } from './sankey.types';

export const getNodeAlignFunction = (align: SankeyNodeOptions['align']) => {
  switch (align) {
    case 'left':
      return sankeyLeft;
    case 'right':
      return sankeyRight;
    case 'center':
      return sankeyCenter;
    case 'justify':
    default:
      return sankeyJustify;
  }
};
