import { ChartsTextBaseline, ChartsTextStyle } from '../internals/getWordsByLines';
import { AxisId } from '../models/axis';

export type AnchorX = 'left' | 'right' | 'middle';
export type AnchorY = 'top' | 'bottom' | 'middle';

export type AnchorPosition = { horizontal: AnchorX; vertical: AnchorY };

export type Direction = 'row' | 'column';

export interface ColorLegendSelector {
  /**
   * The axis direction containing the color configuration to represent.
   * @default 'z'
   */
  axisDirection?: 'x' | 'y' | 'z';
  /**
   * The id of the axis item with the color configuration to represent.
   * @default The first axis item.
   */
  axisId?: AxisId;
}

export interface LegendPlacement {
  /**
   * The position of the legend.
   */
  position?: AnchorPosition;
  /**
   * The direction of the legend layout.
   * The default depends on the chart.
   */
  direction?: Direction;
}

export type BoundingBox = {
  width: number;
  height: number;
};

export interface Position {
  x: number;
  y: number;
}
export interface TextPosition extends Position {
  dominantBaseline: ChartsTextBaseline;
  textAnchor: ChartsTextStyle['textAnchor'];
}

export type PiecewiseLabelFormatterParams = {
  /**
   * The min value of the piece. `null` is infinite.
   */
  min: number | Date | null;
  /**
   * The max value of the piece. `null` is infinite.
   */
  max: number | Date | null;
  /**
   * The formatted min value of the piece. `null` is infinite.
   */
  formattedMin: string | null;
  /**
   * The formatted max value of the piece. `null` is infinite.
   */
  formattedMax: string | null;
};
