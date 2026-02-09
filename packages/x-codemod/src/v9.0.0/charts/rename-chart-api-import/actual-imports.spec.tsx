// @ts-nocheck
import { ChartApi } from '@mui/x-charts/ChartContainer';
import { ChartApi as ChartsApiPro } from '@mui/x-charts-pro/ChartContainer';
// Should only move ChartApi, not ChartContainerProps
import { ChartContainerProps, ChartApi as ChartApiRenamed } from '@mui/x-charts/ChartContainer';
// Should not be affected at all (no ChartApi import)
import { ChartContainerProps as MyProps } from '@mui/x-charts/ChartContainer';

const api: ChartApi = {};
type MyChartApi = {} & ChartApi;
interface ChartApiProps extends ChartApi {}
const apiPro: ChartsApiPro = {};