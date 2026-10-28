import { registerScenario } from './utils/scenario';
import {
  lineChart,
  areaChart,
  lineChartStackedArea,
  lineChartDateAxis,
} from './scenarios/LineChart';

registerScenario(lineChart);
registerScenario(areaChart);
registerScenario(lineChartStackedArea);
registerScenario(lineChartDateAxis);
