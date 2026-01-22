// @ts-nocheck
import { ChartApi } from '@mui/x-charts/ChartContainer';
import { ChartApi as ChartsApiPro } from '@mui/x-charts-pro/ChartContainer';

const api: ChartApi = {};
type MyChartApi = {} & ChartApi;
interface ChartApiProps extends ChartApi { }
const apiPro: ChartsApiPro = {};