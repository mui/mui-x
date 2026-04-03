import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

export default function BasicSparkLine() {
  return (
    <Stack
      direction="row"
      sx={{
        width: '100%',
        gap: 2,

        // For the examples page
        ['@container (width < 600px)']: {
          flexWrap: 'wrap',
          maxWidth: '70%',
        },
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
        }}
      >
        <SparkLineChart data={[1, 4, 2, 5, 7, 2, 4, 6]} height={100} />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
        }}
      >
        <SparkLineChart
          plotType="bar"
          data={[1, 4, 2, 5, 7, 2, 4, 6]}
          height={100}
        />
      </Box>
    </Stack>
  );
}
