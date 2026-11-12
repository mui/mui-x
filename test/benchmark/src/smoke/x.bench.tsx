import { reactBenchmark } from '@mui/internal-benchmark/page';
import type { Scenario } from '../utils/scenario';
import { barChart, barChartStacked } from '../charts/BarChart/scenarios';
import { rangeBarChart } from '../charts/BarChartPremium/scenarios';
import { barChartPro } from '../charts/BarChartPro/scenarios';
import { candlestickChart } from '../charts/CandlestickChart/scenarios';
import { funnelChart } from '../charts/FunnelChart/scenarios';
import { heatmap } from '../charts/Heatmap/scenarios';
import { heatmapPremium } from '../charts/HeatmapPremium/scenarios';
import {
  lineChart,
  areaChart,
  lineChartStackedArea,
  lineChartDateAxis,
} from '../charts/LineChart/scenarios';
import { lineChartPro } from '../charts/LineChartPro/scenarios';
import { pieChart } from '../charts/PieChart/scenarios';
import { radarChart } from '../charts/RadarChart/scenarios';
import { radialBarChart } from '../charts/RadialBarChart/scenarios';
import { radialLineChart } from '../charts/RadialLineChart/scenarios';
import { sankeyChart } from '../charts/SankeyChart/scenarios';
import { scatterChart } from '../charts/ScatterChart/scenarios';
import {
  scatterChartPremium,
  scatterChartPremiumZoomedIn,
} from '../charts/ScatterChartPremium/scenarios';
import {
  scatterChartPro,
  scatterChartProZoomedIn,
  scatterChartProBatch,
  scatterChartProBatchZoomedIn,
} from '../charts/ScatterChartPro/scenarios';
import { sparkLineChartGrid } from '../charts/SparkLineChart/scenarios';
import { chatBox } from '../chat/scenarios';
import { dataGrid, dataGridPremium, dataGridPro } from '../dataGrid/scenarios';
import { dateCalendar, dateRangeCalendar } from '../datePickers/scenarios';
import { eventCalendar } from '../scheduler/scenarios';
import { richTreeView, richTreeViewPro } from '../treeView/scenarios';

// The benchmarks of all of MUI X, in one file: the runner loads the file's page once per round and
// samples each of them there, so they run in a warm page, a lot faster and with less noise than in
// a page each. To run some of them, filter by name with `-t`.

// They are there to catch big regressions. A round of the whole file is long, so they get few
// rounds: they alarm past 10%, which those rounds can settle, rather than the default 5%, which
// they mostly can't.
const SMOKE_OPTIONS = { sampleSize: 30, alarm: { error: 0.1 } };

/** Registers a scenario as a smoke benchmark. */
function smokeBenchmark([name, render, interaction]: Scenario) {
  // Only an interaction is kept: the smoke options replace a scenario's own.
  reactBenchmark(
    name,
    render,
    typeof interaction === 'function' ? interaction : undefined,
    SMOKE_OPTIONS,
  );
}

// Charts
smokeBenchmark(barChart);
smokeBenchmark(barChartStacked);
smokeBenchmark(rangeBarChart);
smokeBenchmark(barChartPro);
smokeBenchmark(candlestickChart);
smokeBenchmark(funnelChart);
smokeBenchmark(heatmap);
smokeBenchmark(heatmapPremium);
smokeBenchmark(lineChart);
smokeBenchmark(areaChart);
smokeBenchmark(lineChartStackedArea);
smokeBenchmark(lineChartDateAxis);
smokeBenchmark(lineChartPro);
smokeBenchmark(pieChart);
smokeBenchmark(radarChart);
smokeBenchmark(radialBarChart);
smokeBenchmark(radialLineChart);
smokeBenchmark(sankeyChart);
smokeBenchmark(scatterChart);
smokeBenchmark(scatterChartPremium);
smokeBenchmark(scatterChartPremiumZoomedIn);
smokeBenchmark(scatterChartPro);
smokeBenchmark(scatterChartProZoomedIn);
smokeBenchmark(scatterChartProBatch);
smokeBenchmark(scatterChartProBatchZoomedIn);
smokeBenchmark(sparkLineChartGrid);

// Data Grid
smokeBenchmark(dataGrid);
smokeBenchmark(dataGridPro);
smokeBenchmark(dataGridPremium);

// Date and Time Pickers
smokeBenchmark(dateCalendar);
smokeBenchmark(dateRangeCalendar);

// Tree View
smokeBenchmark(richTreeView);
smokeBenchmark(richTreeViewPro);

// Scheduler
smokeBenchmark(eventCalendar);

// Chat
smokeBenchmark(chatBox);
