import { reactBenchmark } from '@mui/internal-benchmark/page';
import type { Scenario } from '../utils/scenario';
import { barChart } from '../charts/BarChart/scenarios';
import { barChartPro } from '../charts/BarChartPro/scenarios';
import { candlestickChart } from '../charts/CandlestickChart/scenarios';
import { funnelChart } from '../charts/FunnelChart/scenarios';
import { heatmap } from '../charts/Heatmap/scenarios';
import { heatmapPremium } from '../charts/HeatmapPremium/scenarios';
import { lineChart } from '../charts/LineChart/scenarios';
import { lineChartPro } from '../charts/LineChartPro/scenarios';
import { pieChart } from '../charts/PieChart/scenarios';
import { radarChart } from '../charts/RadarChart/scenarios';
import { radialBarChart } from '../charts/RadialBarChart/scenarios';
import { radialLineChart } from '../charts/RadialLineChart/scenarios';
import { rangeBarChart } from '../charts/BarChartPremium/scenarios';
import { sankeyChart } from '../charts/SankeyChart/scenarios';
import { scatterChart } from '../charts/ScatterChart/scenarios';
import { scatterChartPremium } from '../charts/ScatterChartPremium/scenarios';
import { scatterChartPro } from '../charts/ScatterChartPro/scenarios';
import { sparkLineChartGrid } from '../charts/SparkLineChart/scenarios';
import { chatBox } from '../chat/scenarios';
import { dataGrid, dataGridPremium, dataGridPro } from '../dataGrid/scenarios';
import { dateCalendar, dateRangeCalendar } from '../datePickers/scenarios';
import { eventCalendar } from '../scheduler/scenarios';
import { richTreeView, richTreeViewPro } from '../treeView/scenarios';

// One benchmark or a few per product of MUI X, one per kind of chart, all in one file: the runner
// loads the file's page once per round and samples each of them there.

// The smoke benchmarks are there to catch big regressions. A round of the whole file is long, so
// they get few rounds: they alarm past 10%, which those rounds can settle, rather than the default
// 5%, which they mostly can't.
const SMOKE_OPTIONS = { sampleSize: 30, alarm: { error: 0.1 } };

/**
 * Registers a scenario as a smoke benchmark. A chart's keeps its name, so it reads as the same
 * benchmark as in its chart's file.
 */
function smokeBenchmark([name, render, interaction]: Scenario) {
  // Only an interaction is kept: the smoke options replace a scenario's own.
  reactBenchmark(
    name,
    render,
    typeof interaction === 'function' ? interaction : undefined,
    SMOKE_OPTIONS,
  );
}

smokeBenchmark(barChart);
smokeBenchmark(barChartPro);
smokeBenchmark(candlestickChart);
smokeBenchmark(funnelChart);
smokeBenchmark(heatmap);
smokeBenchmark(heatmapPremium);
smokeBenchmark(lineChart);
smokeBenchmark(lineChartPro);
smokeBenchmark(pieChart);
smokeBenchmark(radarChart);
smokeBenchmark(radialBarChart);
smokeBenchmark(radialLineChart);
smokeBenchmark(rangeBarChart);
smokeBenchmark(sankeyChart);
smokeBenchmark(scatterChart);
smokeBenchmark(scatterChartPro);
smokeBenchmark(scatterChartPremium);

smokeBenchmark(dataGrid);
smokeBenchmark(dataGridPro);
smokeBenchmark(dataGridPremium);
smokeBenchmark(dateCalendar);
smokeBenchmark(dateRangeCalendar);
smokeBenchmark(richTreeView);
smokeBenchmark(richTreeViewPro);
smokeBenchmark(eventCalendar);
smokeBenchmark(chatBox);
smokeBenchmark(sparkLineChartGrid);
