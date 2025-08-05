import {
  sankeyLeft,
  sankeyRight,
  sankeyCenter,
  sankeyJustify,
} from '@mui/x-charts-vendor/d3-sankey';
import type { SankeySeriesType } from './sankey.types';

export const getNodeAlignFunction = (align: SankeySeriesType['nodeAlign']) => {
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
