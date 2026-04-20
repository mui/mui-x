// @ts-nocheck
import { ChartApi } from '@mui/x-charts/ChartsContainer';
import { ChartApi as ChartsApiPro } from '@mui/x-charts-pro/ChartsContainer';
// Should only move ChartApi, not ChartsContainerProps
import { ChartsContainerProps, ChartApi as ChartApiRenamed } from '@mui/x-charts/ChartsContainer';
// Should not be affected at all (no ChartApi import)
import { ChartsContainerProps as MyProps } from '@mui/x-charts/ChartsContainer';

const api: ChartApi = {};
type MyChartApi = {} & ChartApi;
interface ChartApiProps extends ChartApi {}
const apiPro: ChartsApiPro = {};
