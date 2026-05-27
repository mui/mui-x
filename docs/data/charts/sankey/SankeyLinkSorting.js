import Stack from '@mui/material/Stack';
import { SankeyChart } from '@mui/x-charts-pro/SankeyChart';
import Typography from '@mui/material/Typography';

const data = {
  links: [
    { source: 'C', target: 'Y', value: 10 },
    { source: 'B', target: 'X', value: 10 },
    { source: 'B', target: 'Y', value: 5 },
    { source: 'X', target: 'Z', value: 25 },
    { source: 'Y', target: 'Z', value: 8 },
    { source: 'A', target: 'X', value: 25 },
  ],
};

// Sort links by value (descending)
const linkSortFunction = (a, b) => b.value - a.value;

export default function SankeyLinkSorting() {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={3}
      sx={{ width: '100%', '&>div': { flex: '1 0 0' } }}
    >
      <div style={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          auto (default)
        </Typography>
        <SankeyChart
          height={300}
          series={{
            data,
            linkOptions: {
              sort: 'auto',
            },
          }}
        />
      </div>

      <div style={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          fixed
        </Typography>
        <SankeyChart
          height={300}
          series={{
            data,
            linkOptions: {
              sort: 'fixed',
            },
          }}
        />
      </div>

      <div style={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          Custom Function
        </Typography>
        <SankeyChart
          height={300}
          series={{
            data,
            linkOptions: {
              sort: linkSortFunction,
            },
          }}
        />
      </div>
    </Stack>
  );
}
