import type {
  ScaleBand,
  ScaleLogarithmic,
  ScalePower,
  ScaleTime,
  ScaleLinear,
  ScalePoint,
  ScaleOrdinal,
  ScaleSequential,
  ScaleThreshold,
} from '@mui/x-charts-vendor/d3-scale';
import { SxProps } from '@mui/system';
import { ChartsAxisClasses } from '../ChartsAxis/axisClasses';
import type { TickParams } from '../hooks/useTicks';
import { ChartsTextProps } from '../ChartsText';
import { ContinuousColorConfig, OrdinalColorConfig, PiecewiseColorConfig } from './colorMapping';

export type AxisId = string | number;

export type D3Scale<
  Domain extends { toString(): string } = number | Date | string,
  Range = number,
  Output = number,
> =
  | ScaleBand<Domain>
  | ScaleLogarithmic<Range, Output>
  | ScalePoint<Domain>
  | ScalePower<Range, Output>
  | ScaleTime<Range, Output>
  | ScaleLinear<Range, Output>;

export type D3ContinuousScale<Range = number, Output = number> =
  | ScaleLogarithmic<Range, Output>
  | ScalePower<Range, Output>
  | ScaleTime<Range, Output>
  | ScaleLinear<Range, Output>;

export interface ChartsAxisSlots {
  /**
   * Custom component for the axis main line.
   * @default 'line'
   */
  axisLine?: React.JSXElementConstructor<React.SVGAttributes<SVGPathElement>>;
  /**
   * Custom component for the axis tick.
   * @default 'line'
   */
  axisTick?: React.JSXElementConstructor<React.SVGAttributes<SVGPathElement>>;
  /**
   * Custom component for tick label.
   * @default ChartsText
   */
  axisTickLabel?: React.JSXElementConstructor<ChartsTextProps>;
  /**
   * Custom component for axis label.
   * @default ChartsText
   */
  axisLabel?: React.JSXElementConstructor<ChartsTextProps>;
}

export interface ChartsAxisSlotProps {
  axisLine?: Partial<React.SVGAttributes<SVGPathElement>>;
  axisTick?: Partial<React.SVGAttributes<SVGPathElement>>;
  axisTickLabel?: Partial<ChartsTextProps>;
  axisLabel?: Partial<ChartsTextProps>;
}

export interface ChartsAxisProps extends TickParams {
  /**
   * The id of the axis to render.
   * If undefined, it will be the first defined axis.
   */
  axisId?: AxisId;
  /**
   * If true, the axis line is disabled.
   * @default false
   */
  disableLine?: boolean;
  /**
   * If true, the ticks are disabled.
   * @default false
   */
  disableTicks?: boolean;
  /**
   * The fill color of the axis text.
   * @default 'currentColor'
   */
  fill?: string;
  /**
   * The font size of the axis ticks text.
   * @default 12
   * @deprecated Consider using `tickLabelStyle.fontSize` instead.
   */
  tickFontSize?: number;
  /**
   * The style applied to ticks text.
   */
  tickLabelStyle?: ChartsTextProps['style'];
  /**
   * The style applied to the axis label.
   */
  labelStyle?: ChartsTextProps['style'];
  /**
   * Defines which ticks get its label displayed. Its value can be:
   * - 'auto' In such case, labels are displayed if they do not overlap with the previous one.
   * - a filtering function of the form (value, index) => boolean. Warning: the index is tick index, not data ones.
   * @default 'auto'
   */
  tickLabelInterval?: 'auto' | ((value: any, index: number) => boolean);
  /**
   * The label of the axis.
   */
  label?: string;
  /**
   * The font size of the axis label.
   * @default 14
   * @deprecated Consider using `labelStyle.fontSize` instead.
   */
  labelFontSize?: number;
  /**
   * The stroke color of the axis line.
   * @default 'currentColor'
   */
  stroke?: string;
  /**
   * The size of the ticks.
   * @default 6
   */
  tickSize?: number;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsAxisClasses>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: Partial<ChartsAxisSlots>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: Partial<ChartsAxisSlotProps>;
  sx?: SxProps;
}

export interface ChartsYAxisProps extends ChartsAxisProps {
  /**
   * Position of the axis.
   */
  position?: 'left' | 'right';
}

export interface ChartsXAxisProps extends ChartsAxisProps {
  /**
   * Position of the axis.
   */
  position?: 'top' | 'bottom';
}

export type ScaleName = keyof AxisScaleConfig;
export type ContinuousScaleName = 'linear' | 'log' | 'pow' | 'sqrt' | 'time' | 'utc';

export interface AxisScaleConfig {
  band: {
    scaleType: 'band';
    scale: ScaleBand<number | Date | string>;
    /**
     * The ratio between the space allocated for padding between two categories and the category width.
     * 0 means no gap, and 1 no data.
     * @default 0.2
     */
    categoryGapRatio: number;
    /**
     * The ratio between the width of a bar, and the gap between two bars.
     * 0 means no gap, and 1 no bar.
     * @default 0.1
     */
    barGapRatio: number;
    colorMap?: OrdinalColorConfig | ContinuousColorConfig | PiecewiseColorConfig;
  } & Pick<TickParams, 'tickPlacement' | 'tickLabelPlacement'>;
  point: {
    scaleType: 'point';
    scale: ScalePoint<number | Date | string>;
    colorMap?: OrdinalColorConfig | ContinuousColorConfig | PiecewiseColorConfig;
  };
  log: {
    scaleType: 'log';
    scale: ScaleLogarithmic<number, number>;
    colorMap?: ContinuousColorConfig | PiecewiseColorConfig;
  };
  pow: {
    scaleType: 'pow';
    scale: ScalePower<number, number>;
    colorMap?: ContinuousColorConfig | PiecewiseColorConfig;
  };
  sqrt: {
    scaleType: 'sqrt';
    scale: ScalePower<number, number>;
    colorMap?: ContinuousColorConfig | PiecewiseColorConfig;
  };
  time: {
    scaleType: 'time';
    scale: ScaleTime<number, number>;
    colorMap?: ContinuousColorConfig | PiecewiseColorConfig;
  };
  utc: {
    scaleType: 'utc';
    scale: ScaleTime<number, number>;
    colorMap?: ContinuousColorConfig | PiecewiseColorConfig;
  };
  linear: {
    scaleType: 'linear';
    scale: ScaleLinear<number, number>;
    colorMap?: ContinuousColorConfig | PiecewiseColorConfig;
  };
}

/**
 * Use this type instead of `AxisScaleConfig` when the values
 * shouldn't be provided by the user.
 */
export interface AxisScaleComputedConfig {
  band: {
    colorScale?:
      | ScaleOrdinal<string | number | Date, string, string | null>
      | ScaleOrdinal<number, string, string | null>
      | ScaleSequential<string, string | null>
      | ScaleThreshold<number | Date, string | null>;
  };
  point: {
    colorScale?:
      | ScaleOrdinal<string | number | Date, string, string | null>
      | ScaleOrdinal<number, string, string | null>
      | ScaleSequential<string, string | null>
      | ScaleThreshold<number | Date, string | null>;
  };
  log: {
    colorScale?: ScaleSequential<string, string | null> | ScaleThreshold<number, string | null>;
  };
  pow: {
    colorScale?: ScaleSequential<string, string | null> | ScaleThreshold<number, string | null>;
  };
  sqrt: {
    colorScale?: ScaleSequential<string, string | null> | ScaleThreshold<number, string | null>;
  };
  time: {
    colorScale?:
      | ScaleSequential<string, string | null>
      | ScaleThreshold<number | Date, string | null>;
  };
  utc: {
    colorScale?:
      | ScaleSequential<string, string | null>
      | ScaleThreshold<number | Date, string | null>;
  };
  linear: {
    colorScale?: ScaleSequential<string, string | null> | ScaleThreshold<number, string | null>;
  };
}

export type AxisValueFormatterContext = {
  /**
   * Location indicates where the value will be displayed.
   * - `'tick'` The value is displayed on the axis ticks.
   * - `'tooltip'` The value is displayed in the tooltip when hovering the chart.
   * - `'legend'` The value is displayed in the legend when using color legend.
   */
  location: 'tick' | 'tooltip' | 'legend';
};

export type AxisConfig<
  S extends ScaleName = ScaleName,
  V = any,
  AxisProps = ChartsXAxisProps | ChartsYAxisProps,
> = {
  /**
   * Id used to identify the axis.
   */
  id: AxisId;
  /**
   * The minimal value of the domain.
   * If not provided, it gets computed to display the entire chart data.
   */
  min?: number | Date;
  /**
   * The maximal value of the domain.
   * If not provided, it gets computed to display the entire chart data.
   */
  max?: number | Date;
  /**
   * The data used by `'band'` and `'point'` scales.
   */
  data?: V[];
  /**
   * The key used to retrieve `data` from the `dataset` prop.
   */
  dataKey?: string;
  /**
   * Formats the axis value.
   * @param {V} value The value to format.
   * @param {AxisValueFormatterContext} context The rendering context of the value.
   * @returns {string} The string to display.
   */
  valueFormatter?: (value: V, context: AxisValueFormatterContext) => string;
  /**
   * If `true`, hide this value in the tooltip
   */
  hideTooltip?: boolean;
  /**
   * If `true`, Reverse the axis scaleBand.
   */
  reverse?: boolean;
} & Omit<Partial<AxisProps>, 'axisId'> &
  Partial<Omit<AxisScaleConfig[S], 'scale'>> &
  TickParams &
  AxisConfigExtension;

export interface AxisConfigExtension {}

export type AxisDefaultized<
  S extends ScaleName = ScaleName,
  V = any,
  AxisProps = ChartsXAxisProps | ChartsYAxisProps,
> = Omit<AxisConfig<S, V, AxisProps>, 'scaleType'> &
  AxisScaleConfig[S] &
  AxisScaleComputedConfig[S] & {
    /**
     * An indication of the expected number of ticks.
     */
    tickNumber: number;
  };

export function isBandScaleConfig(
  scaleConfig: AxisConfig<ScaleName>,
): scaleConfig is AxisConfig<'band'> & { scaleType: 'band' } {
  return scaleConfig.scaleType === 'band';
}

export function isPointScaleConfig(
  scaleConfig: AxisConfig<ScaleName>,
): scaleConfig is AxisConfig<'point'> & { scaleType: 'point' } {
  return scaleConfig.scaleType === 'point';
}
