import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';

const emptySeries = {
  series: [],
  height: 150,
};

export default function Overlay() {
  return (
    <Stack direction={{ md: 'row', xs: 'column' }} sx={{ width: '100%' }}>
      {/* @focus-start */}
      <LineChart loading {...emptySeries} />
      <LineChart {...emptySeries} />
      {/* @focus-end */}
    </Stack>
  );
}
