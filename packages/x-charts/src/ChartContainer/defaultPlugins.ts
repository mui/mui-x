import { plugin as barPlugin } from '../BarChart/plugin';
import { plugin as scatterPlugin } from '../ScatterChart/plugin';
import { plugin as linePlugin } from '../LineChart/plugin';
import { plugin as piePlugin } from '../PieChart/plugin';
import { ChartSeriesType } from '../models/seriesType/config';
import { ChartsPluginType } from '../models';

export const defaultPlugins: ChartsPluginType<ChartSeriesType>[] = [
  barPlugin,
  scatterPlugin,
  linePlugin,
  piePlugin,
];
