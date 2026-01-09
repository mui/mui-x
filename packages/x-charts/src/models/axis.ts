import type {
  ScaleBand,
  ScaleLinear,
  ScaleLogarithmic,
  ScaleOrdinal,
  ScalePoint,
  ScalePower,
  ScaleSequential,
  ScaleThreshold,
  ScaleTime,
  ScaleSymLog,
  NumberValue,
} from '@mui/x-charts-vendor/d3-scale';
import { type SxProps } from '@mui/system/styleFunctionSx';
import { type HasProperty, type MakeOptional, type MakeRequired } from '@mui/x-internals/types';
import type { DefaultizedZoomOptions } from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import { type ChartsAxisClasses } from '../ChartsAxis/axisClasses';
import type { TickParams } from '../hooks/useTicks';
import type { ChartsTextProps } from '../ChartsText';
import type {
  ContinuousColorConfig,
  OrdinalColorConfig,
  PiecewiseColorConfig,
} from './colorMapping';
import type { OrdinalTimeTicks } from './timeTicks';
import { type ChartsTypeFeatureFlags } from './featureFlags';

export type AxisId = string | number;

export type D3Scale<
  Domain extends { toString(): string } = { toString(): string },
  Range = number,
  Output = number,
> =
  | ScaleBand<Domain>
  | ScaleSymLog<Range, Output>
  | ScaleLogarithmic<Range, Output>
  | ScalePoint<Domain>
  | ScalePower<Range, Output>
  | ScaleTime<Range, Output>
  | ScaleLinear<Range, Output>;

export type D3ContinuousScale<Range = number, Output = number> =
  | ScaleSymLog<Range, Output>
  | ScaleLogarithmic<Range, Output>
  | ScalePower<Range, Output>
  | ScaleTime<Range, Output>
  | ScaleLinear<Range, Output>;

export type D3OrdinalScale<Domain extends { toString(): string } = { toString(): string }> =
  | ScaleBand<Domain>
  | ScalePoint<Domain>;

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
   * The minimum space between ticks when using an ordinal scale. It defines the minimum distance in pixels between two ticks.
   * @default 0
   */
  tickSpacing?: number;
  /**
   * The label of the axis.
   */
  label?: string;
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
  axis?: 'y';
}

export interface ChartsXAxisProps extends ChartsAxisProps {
  axis?: 'x';
  /**
   * The minimum gap in pixels between two tick labels.
   * If two tick labels are closer than this minimum gap, one of them will be hidden.
   * @default 4
   */
  tickLabelMinGap?: number;
}

type AxisSideConfig<AxisProps extends ChartsAxisProps> = AxisProps extends ChartsXAxisProps
  ? {
      /**
       * Position of the axis.
       *
       * When set, the space for the axis is reserved, even if the axis is not displayed due to missing data.
       *
       * Set to 'none' to hide the axis.
       *
       * The first axis in the list will always have a default position.
       */
      position?: 'top' | 'bottom' | 'none';
      /**
       * The height of the axis.
       * @default 45 if an axis label is provided, 25 otherwise.
       */
      height?: number;
    }
  : AxisProps extends ChartsYAxisProps
    ? {
        /**
         * Position of the axis.
         *
         * When set, the space for the axis is reserved, even if the axis is not displayed due to missing data.
         *
         * Set to 'none' to hide the axis.
         *
         * The first axis in the list will always have a default position.
         */
        position?: 'left' | 'right' | 'none';
        /**
         * The width of the axis.
         * @default 65 if an axis label is provided, 45 otherwise.
         */
        width?: number;
      }
    : {
        position?: 'top' | 'bottom' | 'left' | 'right' | 'none';
        height?: number;
        width?: number;
      };

export interface ChartsRotationAxisProps extends ChartsAxisProps {
  /**
   * The start angle (in deg).
   */
  startAngle?: number;
  /**
   * The end angle (in deg).
   */
  endAngle?: number;
  /**
   * The gap between the axis and the label.
   */
  labelGap?: number;
}

export interface ChartsRadiusAxisProps extends ChartsAxisProps {
  /**
   * The minimal radius.
   */
  minRadius?: number;
  /**
   * The maximal radius.
   */
  maxRadius?: number;
}

export type ScaleName = keyof AxisScaleConfig;
export type ContinuousScaleName = 'linear' | 'log' | 'symlog' | 'pow' | 'sqrt' | 'time' | 'utc';

export type AxisGroup = {
  /**
   * The function used to return the value for this group.
   *
   * @param {any} value The value of the axis item.
   * @param {number} dataIndex  The index of the data item.
   * @returns {string | number | Date} The value that will be used to group the axis items.
   */
  getValue: (value: any, dataIndex: number) => string | number | Date;
  /**
   * The size of the tick in pixels.
   * @default 6
   */
  tickSize?: number;
  /**
   * The style applied to ticks text.
   */
  tickLabelStyle?: ChartsTextProps['style'];
};

export type AxisGroups = {
  /**
   * Each group will have a label that is the stringified value of the group.
   *
   * @example
   * If the axis is grouped by day, month and year.
   *
   * ```tsx
   * [
   *   { getValue: getDate },
   *   { getValue: getMonth },
   *   { getValue: getFullYear }
   * ]
   * ```
   *
   * Then the axis will have three rows, one for each group.
   *
   * ```bash
   * | 31   | 1    | 2    |
   * | Jan  | Feb         |
   * | 2021               |
   * ```
   */
  groups?: AxisGroup[];
};

export interface AxisScaleConfig {
  band: {
    scaleType: 'band';
    /**
     * Definition of the tick placements with date data.
     */
    ordinalTimeTicks?: OrdinalTimeTicks;
    scale: ScaleBand<{ toString(): string }>;
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
  } & AxisGroups &
    Pick<TickParams, 'tickPlacement' | 'tickLabelPlacement'>;
  point: {
    scaleType: 'point';
    /**
     * Definition of the tick placements with date data.
     */
    ordinalTimeTicks?: OrdinalTimeTicks;
    scale: ScalePoint<{ toString(): string }>;
    colorMap?: OrdinalColorConfig | ContinuousColorConfig | PiecewiseColorConfig;
  } & AxisGroups;
  log: {
    scaleType: 'log';
    scale: ScaleLogarithmic<number, number>;
    colorMap?: ContinuousColorConfig | PiecewiseColorConfig;
  };
  symlog: {
    scaleType: 'symlog';
    scale: ScaleSymLog<number, number>;
    colorMap?: ContinuousColorConfig | PiecewiseColorConfig;
    /**
     * The constant used to define the zero point of the symlog scale.
     * @default 1
     */
    constant?: number;
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
  symlog: {
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

export type AxisValueFormatterContext<S extends ScaleName = ScaleName> =
  | {
      /**
       * Location indicates where the value will be displayed.
       * - `'tick'` The value is displayed on the axis ticks.
       * - `'tooltip'` The value is displayed in the tooltip when hovering the chart.
       * - `'legend'` The value is displayed in the legend when using color legend.
       * - `'zoom-slider-tooltip'` The value is displayed in the zoom slider tooltip.
       */
      location: 'legend';
    }
  | {
      /**
       * Location indicates where the value will be displayed.
       * - `'tick'` The value is displayed on the axis ticks.
       * - `'tooltip'` The value is displayed in the tooltip when hovering the chart.
       * - `'legend'` The value is displayed in the legend when using color legend.
       * - `'zoom-slider-tooltip'` The value is displayed in the zoom slider tooltip.
       */
      location: 'tooltip' | 'zoom-slider-tooltip';
      /**
       * The d3-scale instance associated to the axis.
       */
      scale: AxisScaleConfig[S]['scale'];
    }
  | {
      /**
       * Location indicates where the value will be displayed.
       * - `'tick'` The value is displayed on the axis ticks.
       * - `'tooltip'` The value is displayed in the tooltip when hovering the chart.
       * - `'legend'` The value is displayed in the legend when using color legend.
       * - `'zoom-slider-tooltip'` The value is displayed in the zoom slider tooltip.
       */
      location: 'tick';
      /**
       * The d3-scale instance associated to the axis.
       */
      scale: AxisScaleConfig[S]['scale'];
      /**
       * The tick label shown by default if the value isn't formatted.
       * This value might be an empty string if no tick label should be displayed, which is particularly useful in log
       * scales where we want to show ticks to demonstrate it's a log scale, but not labels to avoid them overlapping.
       * @see See {@link https://d3js.org/d3-scale/log#log_tickFormat D3 log scale docs} for more details.
       */
      defaultTickLabel: string;
      /**
       * A suggestion of the number of ticks to show.
       * Can be provided to the scale's `ticks` method to compute the ticks, or to `tickFormat` to format the ticks.
       * Can be `undefined` if the scale doesn't support it, e.g., band, point scales.
       */
      tickNumber?: number;
    };

type MinMaxConfig<S extends ScaleName = ScaleName> = S extends ContinuousScaleName
  ? S extends 'utc' | 'time'
    ? {
        /**
         * The minimal value of the domain.
         * If not provided, it gets computed to display the entire chart data.
         */
        min?: NumberValue;
        /**
         * The maximal value of the domain.
         * If not provided, it gets computed to display the entire chart data.
         */
        max?: NumberValue;
      }
    : {
        /**
         * The minimal value of the domain.
         * If not provided, it gets computed to display the entire chart data.
         */
        min?: number;
        /**
         * The maximal value of the domain.
         * If not provided, it gets computed to display the entire chart data.
         */
        max?: number;
      }
  : {};

/**
 * Config that is shared between cartesian and polar axes.
 */
type CommonAxisConfig<S extends ScaleName = ScaleName, V = any> = {
  /**
   * ID used to identify the axis.
   *
   * The ID must be unique across all axes in this chart.
   */
  id: AxisId;
  /**
   * The data used by `'band'` and `'point'` scales.
   */
  data?: readonly V[];
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
  valueFormatter?: <TScaleName extends S>(
    value: V,
    context: AxisValueFormatterContext<TScaleName>,
  ) => string;
  /**
   * If `true`, hide this value in the tooltip
   */
  hideTooltip?: boolean;
  /**
   * If `true`, Reverse the axis scaleBand.
   */
  reverse?: boolean;
  /**
   * Defines the axis scale domain based on the min/max values of series linked to it.
   * - 'nice': Rounds the domain at human friendly values.
   * - 'strict': Set the domain to the min/max value provided. No extra space is added.
   * - function: Receives the calculated extremums as parameters, and should return the axis domain.
   */
  domainLimit?: 'nice' | 'strict' | ((min: number, max: number) => { min: number; max: number });
  /**
   * If `true`, the axis will be ignored by the tooltip with `trigger='axis'`.
   */
  ignoreTooltip?: boolean;
};

export type PolarAxisConfig<
  S extends ScaleName = ScaleName,
  V = any,
  AxisProps extends ChartsAxisProps = ChartsRotationAxisProps | ChartsRadiusAxisProps,
> = {
  /**
   * The offset of the axis in pixels. It can be used to move the axis from its default position.
   * X-axis: A top axis will move up, and a bottom axis will move down.
   * Y-axis: A left axis will move left, and a right axis will move right.
   * @default 0
   */
  offset?: number;
} & CommonAxisConfig<S, V> &
  MinMaxConfig<S> &
  Omit<Partial<AxisProps>, 'axisId'> &
  Partial<Omit<AxisScaleConfig[S], 'scale'>> &
  AxisConfigExtension;

/**
 * Use this type for advanced typing. For basic usage, use `XAxis`, `YAxis`, `RotationAxis` or `RadiusAxis`.
 */
export type AxisConfig<
  S extends ScaleName = ScaleName,
  V = any,
  AxisProps extends ChartsAxisProps = ChartsXAxisProps | ChartsYAxisProps,
> = {
  /**
   * The offset of the axis in pixels. It can be used to move the axis from its default position.
   * X-axis: A top axis will move up, and a bottom axis will move down.
   * Y-axis: A left axis will move left, and a right axis will move right.
   * @default 0
   */
  offset?: number;
} & CommonAxisConfig<S, V> &
  MinMaxConfig<S> &
  Omit<Partial<AxisProps>, 'axisId'> &
  Partial<Omit<AxisScaleConfig[S], 'scale'>> &
  AxisSideConfig<AxisProps> &
  TickParams &
  AxisConfigExtension;

export interface AxisConfigExtension {}

export type PolarAxisDefaultized<
  S extends ScaleName = ScaleName,
  V = any,
  AxisProps extends ChartsAxisProps = ChartsRotationAxisProps | ChartsRadiusAxisProps,
> = Omit<PolarAxisConfig<S, V, AxisProps>, 'scaleType'> &
  AxisScaleConfig[S] &
  AxisScaleComputedConfig[S] & {
    /**
     * If true, the contents of the axis will be displayed by a tooltip with `trigger='axis'`.
     */
    triggerTooltip?: boolean;
  };

export type ComputedAxis<
  S extends ScaleName = ScaleName,
  V = any,
  AxisProps extends ChartsAxisProps = ChartsXAxisProps | ChartsYAxisProps,
> = MakeRequired<Omit<DefaultedAxis<S, V, AxisProps>, 'scaleType'>, 'offset'> &
  AxisScaleConfig[S] &
  AxisScaleComputedConfig[S] & {
    /**
     * An indication of the expected number of ticks.
     */
    tickNumber: number;
    /**
     * Indicate if the axis should be consider by a tooltip with `trigger='axis'`.
     */
    triggerTooltip?: boolean;
  } & (AxisProps extends ChartsXAxisProps
    ? MakeRequired<AxisSideConfig<AxisProps>, 'height'>
    : AxisProps extends ChartsYAxisProps
      ? MakeRequired<AxisSideConfig<AxisProps>, 'width'>
      : AxisSideConfig<AxisProps>);
export type ComputedXAxis<S extends ScaleName = ScaleName, V = any> = ComputedAxis<
  S,
  V,
  ChartsXAxisProps
>;
export type ComputedYAxis<S extends ScaleName = ScaleName, V = any> = ComputedAxis<
  S,
  V,
  ChartsYAxisProps
>;

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

export function isContinuousScaleConfig(
  scaleConfig: AxisConfig<ScaleName>,
): scaleConfig is AxisConfig<ContinuousScaleName> {
  return scaleConfig.scaleType !== 'point' && scaleConfig.scaleType !== 'band';
}

export function isSymlogScaleConfig(
  scaleConfig: AxisConfig<ScaleName>,
): scaleConfig is AxisConfig<'symlog'> & { scaleType: 'symlog' } {
  return scaleConfig.scaleType === 'symlog';
}

/**
 * The data format returned by onAxisClick.
 */
export interface ChartsAxisData {
  /**
   * The index in the axis' data property.
   */
  dataIndex: number;
  /**
   * Tha value associated to the axis item.
   */
  axisValue: number | Date | string;
  /**
   * The mapping of series ids to their value for this particular axis index.
   */
  seriesValues: Record<
    string,
    HasProperty<ChartsTypeFeatureFlags, 'seriesValueOverride'> extends true
      ? // @ts-ignore this property is added through module augmentation
        ChartsTypeFeatureFlags['seriesValuesOverride']
      : number | null | undefined
  >;
}

export type CartesianDirection = 'x' | 'y';
export type PolarDirection = 'rotation' | 'radius';

/**
 * Identifies a data point within an axis.
 */
export interface AxisItemIdentifier {
  /**
   * The axis id.
   */
  axisId: AxisId;
  /**
   * The data index.
   */
  dataIndex: number;
}

export type XAxis<S extends ScaleName = ScaleName, V = any> = S extends ScaleName
  ? MakeOptional<AxisConfig<S, V, ChartsXAxisProps>, 'id'>
  : never;
export type YAxis<S extends ScaleName = ScaleName, V = any> = S extends ScaleName
  ? MakeOptional<AxisConfig<S, V, ChartsYAxisProps>, 'id'>
  : never;
export type RotationAxis<S extends ScaleName = ScaleName, V = any> = S extends ScaleName
  ? AxisConfig<S, V, ChartsRotationAxisProps>
  : never;
export type RadiusAxis<S extends 'linear' = 'linear', V = any> = S extends 'linear'
  ? AxisConfig<S, V, ChartsRadiusAxisProps>
  : never;

/**
 * The axis configuration with missing values filled with default values.
 */
export type DefaultedAxis<
  S extends ScaleName = ScaleName,
  V = any,
  AxisProps extends ChartsAxisProps = ChartsXAxisProps | ChartsYAxisProps,
> = AxisConfig<S, V, AxisProps> & {
  zoom: DefaultizedZoomOptions | undefined;
};
/**
 * The x-axis configuration with missing values filled with default values.
 */
export type DefaultedXAxis<S extends ScaleName = ScaleName, V = any> = S extends ScaleName
  ? DefaultedAxis<S, V, ChartsXAxisProps>
  : never;

/**
 * The y-axis configuration with missing values filled with default values.
 */
export type DefaultedYAxis<S extends ScaleName = ScaleName, V = any> = DefaultedAxis<
  S,
  V,
  ChartsYAxisProps
>;
