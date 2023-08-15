import { ScatterSeriesType, DefaultizedScatterSeriesType, ScatterItemIdentifier } from './scatter';
import { LineSeriesType, DefaultizedLineSeriesType, LineItemIdentifier } from './line';
import { BarItemIdentifier, BarSeriesType, DefaultizedBarSeriesType } from './bar';
import { PieSeriesType, DefaultizedPieSeriesType, PieItemIdentifier, PieValueType } from './pie';
import { AxisConfig } from '../axis';
import { DefaultizedProps, MakeOptional } from '../helpers';
import { StackingGroupsType } from '../../internals/stackSeries';

interface ChartsSeriesConfig {
  bar: {
    seriesInput: DefaultizedProps<BarSeriesType, 'id'> & { color: string };
    series: DefaultizedBarSeriesType;
    canBeStacked: true;
    itemIdentifier: BarItemIdentifier;
  };
  line: {
    seriesInput: DefaultizedProps<LineSeriesType, 'id'> & { color: string };
    series: DefaultizedLineSeriesType;
    canBeStacked: true;
    itemIdentifier: LineItemIdentifier;
  };
  scatter: {
    seriesInput: DefaultizedProps<ScatterSeriesType, 'id'> & { color: string };
    series: DefaultizedScatterSeriesType;
    itemIdentifier: ScatterItemIdentifier;
  };
  pie: {
    seriesInput: Omit<DefaultizedProps<PieSeriesType, 'id'>, 'data'> & {
      data: (MakeOptional<PieValueType, 'id'> & { color: string })[];
    };
    series: DefaultizedPieSeriesType;
    itemIdentifier: PieItemIdentifier;
  };
}

export type CartesianChartSeriesType = 'bar' | 'line' | 'scatter';
export type ChartSeriesType = 'bar' | 'line' | 'scatter' | 'pie';

export type ChartSeries<T extends ChartSeriesType> = ChartsSeriesConfig[T] extends {
  canBeStacked: true;
}
  ? ChartsSeriesConfig[T]['seriesInput'] & { stackedData: [number, number][] }
  : ChartsSeriesConfig[T]['seriesInput'];

export type ChartSeriesDefaultized<T extends ChartSeriesType> = ChartsSeriesConfig[T]['series'] &
  ChartSeries<T>;

export type ChartItemIdentifier<T extends ChartSeriesType> =
  ChartsSeriesConfig[T]['itemIdentifier'];

type ExtremumGetterParams<T extends ChartSeriesType> = {
  series: { [id: string]: ChartSeries<T> };
  axis: AxisConfig;
  isDefaultAxis: boolean;
};

export type ExtremumGetterResult = [number, number] | [null, null];

export type ExtremumGetter<T extends ChartSeriesType> = (
  params: ExtremumGetterParams<T>,
) => ExtremumGetterResult;

export type FormatterParams<T extends ChartSeriesType> = {
  series: { [id: string]: ChartsSeriesConfig[T]['seriesInput'] };
  seriesOrder: string[];
};

export type FormatterResult<T extends ChartSeriesType> = {
  series: { [id: string]: ChartSeriesDefaultized<T> };
  seriesOrder: string[];
} & (ChartsSeriesConfig[T] extends {
  canBeStacked: true;
}
  ? { stackingGroups: StackingGroupsType }
  : {});

export type DatasetType<T extends number | string | Date = number | string | Date> = {
  [key: string]: T;
}[];

export type Formatter<T extends ChartSeriesType> = (
  params: FormatterParams<T>,
  dataset?: DatasetType<number>,
) => FormatterResult<T>;

export type LegendParams = {
  /**
   * The color used in the legend
   */
  color: string;
  /**
   * The label displayed in the legend
   */
  label: string;
  /**
   * The identifier of the legend element.
   * Used for internal purpose such as `key` props
   */
  id: string;
};

export type LegendGetter<T extends ChartSeriesType> = (
  series: FormatterResult<T>,
) => LegendParams[];
