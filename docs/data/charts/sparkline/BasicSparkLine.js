import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

export default function BasicSparkLine() {
  return (
    <Stack
      width="100%"
      direction="row"
      sx={{
        // For the examples page
        ['@container (width < 600px)']: {
          flexWrap: 'wrap',
          maxWidth: '70%',
        },
      }}
      gap={2}
    >
      <Box flexGrow={1}>
        <SparkLineChart data={[1, 4, 2, 5, 7, 2, 4, 6]} height={100} />
      </Box>
      <Box flexGrow={1}>
        <SparkLineChart
          plotType="bar"
          data={[1, 4, 2, 5, 7, 2, 4, 6]}
          height={100}
        />
      </Box>
    </Stack>
  );
}
