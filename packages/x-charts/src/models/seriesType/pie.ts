import { PieArcDatum as D3PieArcDatum } from 'd3-shape';
import { DefaultizedProps } from '../helpers';
import { CommonDefaultizedProps, CommonSeriesType } from './common';

export type PieValueType = { id: string | number; value: number; label?: string; color?: string };

export type DefaultizedPieValueType = PieValueType &
  D3PieArcDatum<any> & { color: string; formattedValue: string };

export type ChartsPieSorting = 'none' | 'asc' | 'desc' | ((a: number, b: number) => number);

export interface PieSeriesType<Tdata = PieValueType> extends CommonSeriesType<Tdata> {
  type: 'pie';
  data: Tdata[];
  /**
   * The radius between circle center and the begining of the arc.
   * @default 0
   */
  innerRadius?: number;
  /**
   * The radius between circle center and the end of the arc.
   * @default R_max The maximal radius that fit into the drawing area.
   */
  outerRadius?: number;
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
  sortingValues?: ChartsPieSorting;
  /**
   * The label displayed into the arc.
   */
  arcLabel?: 'formattedValue' | 'label' | 'value' | ((item: DefaultizedPieValueType) => string);
  /**
   * The minimal angle required to display the arc label.
   */
  arcLabelMinAngle?: number;
  /**
   * The x coordinate of the pie center.
   * @default width/2 the center of the drawing area.
   */
  cx?: number;
  /**
   * The y coordinate of the pie center.
   * @default height/2 the center of the drawing area.
   */
  cy?: number;
  /**
   * Override the arc attibutes when it is highlighted.
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
  };
  /**
   * Override the arc attibutes when it is faded.
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
  };
}

/**
 * An object that allows to identify a single pie slice.
 * Used for item interaction
 */
export type PieItemIdentifier = {
  type: 'pie';
  seriesId: DefaultizedPieSeriesType['id'];
  dataIndex: number;
};

export interface DefaultizedPieSeriesType
  extends DefaultizedProps<PieSeriesType, CommonDefaultizedProps> {
  data: DefaultizedPieValueType[];
}
