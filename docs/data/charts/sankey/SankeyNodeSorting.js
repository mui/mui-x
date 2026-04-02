import Stack from '@mui/material/Stack';
import { SankeyChart } from '@mui/x-charts-pro/SankeyChart';
import Typography from '@mui/material/Typography';

const data = {
  nodes: [
    { id: 'C' },
    { id: 'B' },
    { id: 'A' },
    { id: 'X' },
    { id: 'Y' },
    { id: 'Z' },
  ],
  links: [
    { source: 'C', target: 'Y', value: 10 },
    { source: 'A', target: 'X', value: 25 },
    { source: 'B', target: 'X', value: 10 },
    { source: 'X', target: 'Z', value: 25 },
    { source: 'Y', target: 'Z', value: 8 },
    { source: 'B', target: 'Y', value: 5 },
  ],
};

// Sort nodes alphabetically by label
const nodeSortFunction = (a, b) => {
  const labelA = a.label || a.id;
  const labelB = b.label || b.id;
  return labelB.localeCompare(labelA);
};

export default function SankeyNodeSorting() {
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
            nodeOptions: {
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
            nodeOptions: {
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
            nodeOptions: {
              sort: nodeSortFunction,
            },
          }}
        />
      </div>
    </Stack>
  );
}
