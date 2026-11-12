// Every chart's benchmarks in one file, which CI runs. The runner loads a file's page once per round
// and samples each of its benchmarks there, so this samples them in a warm page, a lot faster and
// with less noise than their own files do. Those stay, to run a single chart.
import '../charts/BarChart/BarChart.bench';
import '../charts/BarChartPremium/BarChartPremium.bench';
import '../charts/BarChartPro/BarChartPro.bench';
import '../charts/CandlestickChart/CandlestickChart.bench';
import '../charts/FunnelChart/FunnelChart.bench';
import '../charts/Heatmap/Heatmap.bench';
import '../charts/HeatmapPremium/HeatmapPremium.bench';
import '../charts/LineChart/LineChart.bench';
import '../charts/LineChartPro/LineChartPro.bench';
import '../charts/PieChart/PieChart.bench';
import '../charts/RadarChart/RadarChart.bench';
import '../charts/RadialBarChart/RadialBarChart.bench';
import '../charts/RadialLineChart/RadialLineChart.bench';
import '../charts/SankeyChart/SankeyChart.bench';
import '../charts/ScatterChart/ScatterChart.bench';
import '../charts/ScatterChartPremium/ScatterChartPremium.bench';
import '../charts/ScatterChartPro/ScatterChartPro.bench';
import '../charts/SparkLineChart/SparkLineChart.bench';
