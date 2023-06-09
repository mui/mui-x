import type { HighlightScope } from '@mui/x-charts/context/HighlightProvider';
import type { StackOffset, StackOrder } from '../../internals/stackSeries';

export type CommonSeriesType<TValue> = {
  id?: string;
  color?: string;
  valueFormatter?: (value: TValue) => string;
  highlightScope?: Partial<HighlightScope>;
};

export type CommonDefaultizedProps = 'id' | 'color' | 'valueFormatter';

export type CartesianSeriesType = {
  xAxisKey?: string;
  yAxisKey?: string;
};

export type StackableSeriesType = {
  stack?: string;
  stackOffset?: StackOffsetType;
  stackOrder?: StackOrderType;
};

export type StackOrderType = keyof typeof StackOrder;
export type StackOffsetType = keyof typeof StackOffset;

export type DefaultizedCartesianSeriesType = Required<CartesianSeriesType>;
