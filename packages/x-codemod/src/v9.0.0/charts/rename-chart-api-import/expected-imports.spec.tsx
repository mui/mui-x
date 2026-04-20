// @ts-nocheck
import { ChartApi } from '@mui/x-charts/context';
import { ChartApi as ChartsApiPro } from '@mui/x-charts-pro/context';
// Should only move ChartApi, not ChartsContainerProps
import { ChartsContainerProps } from '@mui/x-charts/ChartsContainer';
import { ChartApi as ChartApiRenamed } from '@mui/x-charts/context';
// Should not be affected at all (no ChartApi import)
import { ChartsContainerProps as MyProps } from '@mui/x-charts/ChartsContainer';

const api: ChartApi = {};
type MyChartApi = {} & ChartApi;
interface ChartApiProps extends ChartApi {}
const apiPro: ChartsApiPro = {};
