import { ScatterSeriesType, DefaultizedScatterSeriesType, ScatterItemIdentifier } from './scatter';
import { LineSeriesType, DefaultizedLineSeriesType, LineItemIdentifier } from './line';
import { BarItemIdentifier, BarSeriesType, DefaultizedBarSeriesType } from './bar';
import { AxisConfig } from '../axis';

interface ChartsSeriesConfig {
  bar: {
    seriesInput: BarSeriesType & { color: string };
    series: DefaultizedBarSeriesType;
    canBeStacked: true;
    itemIdentifier: BarItemIdentifier;
  };
  line: {
    seriesInput: LineSeriesType & { color: string };
    series: DefaultizedLineSeriesType;
    canBeStacked: true;
    itemIdentifier: LineItemIdentifier;
  };
  scatter: {
    seriesInput: ScatterSeriesType & { color: string };
    series: DefaultizedScatterSeriesType;
    itemIdentifier: ScatterItemIdentifier;
  };
}

export type ChartSeriesType = 'bar' | 'line' | 'scatter';

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
  ? { stackingGroups: string[][] }
  : {});

export type Formatter<T extends ChartSeriesType> = (
  params: FormatterParams<T>,
) => FormatterResult<T>;
