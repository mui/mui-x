import type {
  CommonSeriesType,
  CommonLineSeriesType,
  RadialSeriesType,
  StackableSeriesType,
  SeriesId,
  CommonDefaultizedProps,
} from '@mui/x-charts/internals';
import type { CurveType, StackOffsetType } from '@mui/x-charts/models';
import type { DefaultizedProps } from '@mui/x-internals/types';

export interface RadialLineSeriesType
  extends
    CommonSeriesType<number | null, 'line'>,
    RadialSeriesType,
    StackableSeriesType,
    CommonLineSeriesType {
  type: 'radialLine';
  /**
   * Defines how stacked series handle negative values.
   * @default 'none'
   */
  stackOffset?: StackOffsetType;
  /**
   * The type of curve to use for the line.
   * Read more about curves at [line interpolation](https://mui.com/x/react-charts/lines/#interpolation).
   * @default 'linear'
   */
  curve?: CurveType;
}
/**
 * An object that allows to identify a single line.
 * Used for item interaction
 */
export type RadialLineItemIdentifier = {
  type: 'radialLine';
  seriesId: SeriesId;
  /**
   * `dataIndex` can be `undefined` if the mouse is over the area and not a specific item.
   */
  dataIndex?: number;
};

export interface DefaultizedRadialLineSeriesType extends DefaultizedProps<
  RadialLineSeriesType,
  CommonDefaultizedProps | 'color'
> {
  hidden: boolean;
}
