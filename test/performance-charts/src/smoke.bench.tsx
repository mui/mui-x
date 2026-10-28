import { reactBenchmark } from '@mui/internal-benchmark/page';
import type { Scenario } from './utils/scenario';
import { barChart } from './scenarios/BarChart';
import { barChartPro } from './scenarios/BarChartPro';
import { candlestickChart } from './scenarios/CandlestickChart';
import { funnelChart } from './scenarios/FunnelChart';
import { heatmap } from './scenarios/Heatmap';
import { heatmapPremium } from './scenarios/HeatmapPremium';
import { lineChart } from './scenarios/LineChart';
import { lineChartPro } from './scenarios/LineChartPro';
import { pieChart } from './scenarios/PieChart';
import { radarChart } from './scenarios/RadarChart';
import { radialBarChart } from './scenarios/RadialBarChart';
import { radialLineChart } from './scenarios/RadialLineChart';
import { rangeBarChart } from './scenarios/RangeBarChart';
import { sankeyChart } from './scenarios/SankeyChart';
import { scatterChart } from './scenarios/ScatterChart';
import { scatterChartPremium } from './scenarios/ScatterChartPremium';
import { scatterChartPro } from './scenarios/ScatterChartPro';
import { sparkLineChartGrid } from './scenarios/SparkLineChart';

// One benchmark per kind of chart, all in one file: the runner loads the file's page once per round
// and samples each of them there. The pull request job runs only this file; the others are for
// manual runs.

// The smoke benchmarks are there to catch big regressions. A round of the whole file is long, so
// they get few rounds: they alarm past 10%, which those rounds can settle, rather than the default
// 5%, which they mostly can't.
const SMOKE_OPTIONS = { sampleSize: 30, alarm: { error: 0.1 } };

/** Registers a scenario again, under its own name and sampled as a smoke benchmark. */
function smokeBenchmark([name, render, interaction]: Scenario) {
  // Only an interaction is kept: the smoke options replace a scenario's own.
  reactBenchmark(
    `Smoke · ${name}`,
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
smokeBenchmark(sparkLineChartGrid);
