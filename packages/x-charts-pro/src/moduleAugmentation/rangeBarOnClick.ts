import type * as React from 'react';
import { type RangeBarItemIdentifier } from '@mui/x-charts/internals';

declare module '@mui/x-charts/models' {
  interface ChartsTypeFeatureFlags {
    rangeBarOnClick: true;
  }
}

declare module '@mui/x-charts-pro/BarChartPro' {
  interface BarChartProProps {
    /**
     * Callback fired when a range bar item is clicked.
     * @param event The mouse event.
     * @param itemIdentifier The identifier of the clicked range bar item.
     */
    onItemClick?(
      event: React.MouseEvent<SVGElement, MouseEvent>,
      itemIdentifier: RangeBarItemIdentifier,
    ): void;
  }
}

// Required to make this file into a module
export default {};
