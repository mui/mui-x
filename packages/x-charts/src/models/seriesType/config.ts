import { ScatterSeriesType, DefaultizedScatterSeriesType } from './scatter';
import { LineSeriesType, DefaultizedLineSeriesType } from './line';
import { BarSeriesType, DefaultizedBarSeriesType } from './bar';
import { AxisConfig } from '../axis';

interface ChartsSeriesConfig {
  bar: {
    seriesInput: BarSeriesType & { color: string };
    series: DefaultizedBarSeriesType;
    canBeStacked: true;
  };
  line: {
    seriesInput: LineSeriesType & { color: string };
    series: DefaultizedLineSeriesType;
    canBeStacked: true;
  };
  scatter: {
    seriesInput: ScatterSeriesType & { color: string };
    series: DefaultizedScatterSeriesType;
  };
}

export type ChartSeriesType = 'bar' | 'line' | 'scatter';

export type ChartSeries<T extends ChartSeriesType> = ChartsSeriesConfig[T] extends {
  canBeStacked: true;
}
  ? ChartsSeriesConfig[T]['seriesInput'] & { stackedData: [number, number][] }
  : ChartsSeriesConfig[T]['seriesInput'];

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
  series: { [id: string]: ChartSeries<T> };
  seriesOrder: string[];
} & (ChartsSeriesConfig[T] extends {
  canBeStacked: true;
}
  ? { stackingGroups: string[][] }
  : {});

export type Formatter<T extends ChartSeriesType> = (
  params: FormatterParams<T>,
) => FormatterResult<T>;
