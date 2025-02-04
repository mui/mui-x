import {
  useSeries,
  usePieSeries,
  useLineSeries,
  useBarSeries,
  useScatterSeries,
} from '@mui/x-charts/hooks';

function useThings() {
  const series = useSeries();
  const pieSeries = usePieSeries();
  const lineSeries = useLineSeries();
  const barSeries = useBarSeries();
  const scatterSeries = useScatterSeries();
}
