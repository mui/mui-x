import { registerScenario } from '../utils/scenario';
import { barChart, barChartStacked } from './BarChart/scenarios';
import { rangeBarChart } from './BarChartPremium/scenarios';
import { barChartPro } from './BarChartPro/scenarios';
import { candlestickChart } from './CandlestickChart/scenarios';
import { funnelChart } from './FunnelChart/scenarios';
import { heatmap } from './Heatmap/scenarios';
import { heatmapPremium } from './HeatmapPremium/scenarios';
import {
  lineChart,
  areaChart,
  lineChartStackedArea,
  lineChartDateAxis,
} from './LineChart/scenarios';
import { lineChartPro } from './LineChartPro/scenarios';
import { pieChart } from './PieChart/scenarios';
import { radarChart } from './RadarChart/scenarios';
import { radialBarChart } from './RadialBarChart/scenarios';
import { radialLineChart } from './RadialLineChart/scenarios';
import { sankeyChart } from './SankeyChart/scenarios';
import { scatterChart } from './ScatterChart/scenarios';
import { scatterChartPremium, scatterChartPremiumZoomedIn } from './ScatterChartPremium/scenarios';
import {
  scatterChartPro,
  scatterChartProZoomedIn,
  scatterChartProBatch,
  scatterChartProBatchZoomedIn,
} from './ScatterChartPro/scenarios';
import { sparkLineChartGrid } from './SparkLineChart/scenarios';

// Every chart's benchmarks, in one file. The runner loads a file's page once per round and samples
// each of its benchmarks there, so they run in a warm page: a lot faster, and with less noise, than
// a page per chart. To run some of them, filter by name with `-t`.

registerScenario(barChart);
registerScenario(barChartStacked);
registerScenario(rangeBarChart);
registerScenario(barChartPro);
registerScenario(candlestickChart);
registerScenario(funnelChart);
registerScenario(heatmap);
registerScenario(heatmapPremium);
registerScenario(lineChart);
registerScenario(areaChart);
registerScenario(lineChartStackedArea);
registerScenario(lineChartDateAxis);
registerScenario(lineChartPro);
registerScenario(pieChart);
registerScenario(radarChart);
registerScenario(radialBarChart);
registerScenario(radialLineChart);
registerScenario(sankeyChart);
registerScenario(scatterChart);
registerScenario(scatterChartPremium);
registerScenario(scatterChartPremiumZoomedIn);
registerScenario(scatterChartPro);
registerScenario(scatterChartProZoomedIn);
registerScenario(scatterChartProBatch);
registerScenario(scatterChartProBatchZoomedIn);
registerScenario(sparkLineChartGrid);
