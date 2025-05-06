import type * as React from 'react';
import { ChartBaseCommonProps } from '@mui/x-charts/models';

export type ChartBaseTooltipProps = ChartBaseCommonProps & {
  children: React.ReactElement<any, any>;
  enterDelay?: number;
  title: React.ReactNode;
};

export type ChartBaseIconButtonProps = ChartBaseCommonProps & {
  ref?: React.Ref<HTMLButtonElement>;
};
