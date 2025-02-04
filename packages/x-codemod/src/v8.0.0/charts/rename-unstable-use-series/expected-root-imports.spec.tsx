/* eslint-disable no-restricted-imports */
import {
  useSeries,
  usePieSeries,
  useLineSeries,
  useBarSeries,
  useScatterSeries,
} from '@mui/x-charts';
import { useHeatmapSeries } from '@mui/x-charts-pro';

function useThings() {
  const series = useSeries();
  const pieSeries = usePieSeries();
  const lineSeries = useLineSeries();
  const barSeries = useBarSeries();
  const scatterSeries = useScatterSeries();
  const heatmapSeries = useHeatmapSeries();
}
