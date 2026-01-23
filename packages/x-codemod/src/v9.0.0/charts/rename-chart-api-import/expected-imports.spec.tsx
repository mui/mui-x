// @ts-nocheck
import { ChartApi } from '@mui/x-charts/context';
import { ChartApi as ChartsApiPro } from '@mui/x-charts-pro/context';

const api: ChartApi = {};
type MyChartApi = {} & ChartApi;
interface ChartApiProps extends ChartApi { }
const apiPro: ChartsApiPro = {};