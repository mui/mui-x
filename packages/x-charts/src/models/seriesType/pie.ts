import { PieArcDatum as D3PieArcDatum } from '@mui/x-charts-vendor/d3-shape';
import { DefaultizedProps } from '../helpers';
import { CommonDefaultizedProps, CommonSeriesType, SeriesId } from './common';

export type PieItemId = string | number;

export type PieValueType = {
  /**
   * A unique identifier of the pie slice.
   */
  id: PieItemId;
  value: number;
  /**
   * The label to display on the tooltip, arc, or the legend. It can be a string or a function.
   */
  label?: string | ((location: 'tooltip' | 'legend' | 'arc') => string);
  color?: string;
};

export type DefaultizedPieValueType = PieValueType &
  Omit<D3PieArcDatum<any>, 'data'> & { color: string; formattedValue: string };

export type ChartsPieSorting = 'none' | 'asc' | 'desc' | ((a: number, b: number) => number);

export interface PieSeriesType<TData = PieValueType> extends CommonSeriesType<TData> {
  type: 'pie';
  data: TData[];
  /**
   * The radius between circle center and the beginning of the arc.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the maximal radius that fit into the drawing area.
   * @default 0
   */
  innerRadius?: number | string;
  /**
   * The radius between circle center and the end of the arc.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the maximal radius that fit into the drawing area.
   * @default '100%'
   */
  outerRadius?: number | string;
  /**
   * The radius between circle center and the arc label.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the maximal radius that fit into the drawing area.
   * @default (innerRadius - outerRadius) / 2
   */
  arcLabelRadius?: number | string;
  /**
   * The radius applied to arc corners (similar to border radius).
   * @default 0
   */
  cornerRadius?: number;
  /**
   * The start angle (deg) of the first item.
   * @default 0
   */
  startAngle?: number;
  /**
   * The end angle (deg) of the last item.
   * @default 360
   */
  endAngle?: number;
  /**
   * The padding angle (deg) between two arcs.
   * @default 0
   */
  paddingAngle?: number;
  /**
   * The sorting strategy used to order pie slices.
   * Can be 'none', 'asc', 'desc', or a sorting function.
   * @default 'none'
   */
  sortingValues?: ChartsPieSorting;
  /**
   * The label displayed into the arc.
   */
  arcLabel?:
    | 'formattedValue'
    | 'label'
    | 'value'
    | ((item: Omit<DefaultizedPieValueType, 'label'> & { label?: string }) => string);
  /**
   * The minimal angle required to display the arc label.
   * @default 0
   */
  arcLabelMinAngle?: number;
  /**
   * The x coordinate of the pie center.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the width the drawing area.
   * @default '50%'
   */
  cx?: number | string;
  /**
   * The y coordinate of the pie center.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the height the drawing area.
   * @default '50%'
   */
  cy?: number | string;
  /**
   * Override the arc attributes when it is highlighted.
   */
  highlighted?: {
    /**
     * Value added to the default `outerRadius`.
     * Can be negative. It is ignored if you provide a `highlighted.outerRadius` value.
     */
    additionalRadius?: number;
    innerRadius?: number;
    outerRadius?: number;
    cornerRadius?: number;
    paddingAngle?: number;
    arcLabelRadius?: number;
    color?: string;
  };
  /**
   * Override the arc attributes when it is faded.
   */
  faded?: {
    /**
     * Value added to the default `outerRadius`.
     * Can be negative. It is ignored if you provide a `faded.outerRadius` value.
     */
    additionalRadius?: number;
    innerRadius?: number;
    outerRadius?: number;
    cornerRadius?: number;
    paddingAngle?: number;
    arcLabelRadius?: number;
    color?: string;
  };
}

/**
 * An object that allows to identify a single pie slice.
 * Used for item interaction
 */
export type PieItemIdentifier = {
  type: 'pie';
  seriesId: SeriesId;
  dataIndex: number;
};

export interface DefaultizedPieSeriesType
  extends DefaultizedProps<PieSeriesType, CommonDefaultizedProps> {
  data: DefaultizedPieValueType[];
}

/**
 * Props received when the parent components has done the percentage conversion.
 */
export interface ComputedPieRadius {
  /**
   * The radius between circle center and the beginning of the arc.
   * @default 0
   */
  innerRadius?: number;
  /**
   * The radius between circle center and the end of the arc.
   */
  outerRadius: number;
  /**
   * The radius between circle center and the arc label in px.
   * @default (innerRadius - outerRadius) / 2
   */
  arcLabelRadius?: number;
}
