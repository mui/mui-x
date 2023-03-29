import { ScatterSeriesType } from './scatter';
import { LineSeriesType } from './line';
import { BarSeriesType } from './bar';
import { AxisConfig } from '../axis';

interface ChartsSeriesConfig {
  bar: {
    series: BarSeriesType;
    canBeStacked: true;
  };
  line: {
    series: LineSeriesType;
    canBeStacked: true;
  };
  scatter: {
    series: ScatterSeriesType;
  };
}

export type ChartSeriesType = keyof ChartsSeriesConfig;

export type ChartSeries<T extends ChartSeriesType> = ChartsSeriesConfig[T] extends {
  canBeStacked: true;
}
  ? ChartsSeriesConfig[T]['series'] & { stackedData: [number, number][] }
  : ChartsSeriesConfig[T]['series'];

type ExtremumGetterParams<T extends ChartSeriesType> = {
  series: { [id: string]: ChartSeries<T> };
  axis: AxisConfig;
};

export type ExtremumGetterResult = [number, number] | [null, null];

export type ExtremumGetter<T extends ChartSeriesType> = (
  params: ExtremumGetterParams<T>,
) => ExtremumGetterResult;

type FormatterParams<T extends ChartSeriesType> = {
  series: { [id: string]: ChartsSeriesConfig[T]['series'] };
  seriesOrder: string[];
};

type FormatterResult<T extends ChartSeriesType> = {
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
