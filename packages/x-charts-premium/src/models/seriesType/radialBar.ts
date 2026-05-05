import type {
  CommonSeriesType,
  CommonBarSeriesType,
  RadialSeriesType,
  StackableSeriesType,
  SeriesId,
  CommonDefaultizedProps,
} from '@mui/x-charts/internals';
import type { StackOffsetType } from '@mui/x-charts/models';
import type { DefaultizedProps } from '@mui/x-internals/types';

export interface RadialBarSeriesType
  extends
    CommonSeriesType<number | null, 'bar'>,
    RadialSeriesType,
    StackableSeriesType,
    CommonBarSeriesType {
  type: 'radialBar';
  /**
   * Defines how stacked series handle negative values.
   * @default 'diverging'
   */
  stackOffset?: StackOffsetType;
}
/**
 * An object that allows to identify a single bar.
 * Used for item interaction
 */
export type RadialBarItemIdentifier = {
  type: 'radialBar';
  seriesId: SeriesId;
  dataIndex: number;
};

export interface DefaultizedRadialBarSeriesType extends DefaultizedProps<
  RadialBarSeriesType,
  CommonDefaultizedProps | 'color' | 'layout' | 'minBarSize'
> {
  hidden: boolean;
}
