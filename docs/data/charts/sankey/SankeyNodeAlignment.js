import { Unstable_SankeyChart as SankeyChart } from '@mui/x-charts-pro/SankeyChart';
import { Stack } from '@mui/system';
import Typography from '@mui/material/Typography';

export default function SankeyNodeAlignment() {
  return (
    <Stack spacing={2} width={'100%'}>
      <Stack flex={1} direction={['column', 'column', 'row']} spacing={2}>
        <Stack width={'100%'}>
          <Typography>Left</Typography>
          <SankeyChart
            height={200}
            series={{
              data,
              nodeOptions: {
                align: 'left',
                sort: nodeSortFunction,
              },
            }}
          />
        </Stack>
        <Stack width={'100%'}>
          <Typography>Right</Typography>
          <SankeyChart
            height={200}
            series={{
              data,
              nodeOptions: {
                align: 'right',
                sort: nodeSortFunction,
              },
            }}
          />
        </Stack>
      </Stack>
      <Stack flex={1} direction={['column', 'column', 'row']} spacing={2}>
        <Stack width={'100%'}>
          <Typography>Justify</Typography>
          <SankeyChart
            height={200}
            series={{
              data,
              nodeOptions: {
                align: 'justify',
                sort: nodeSortFunction,
              },
            }}
          />
        </Stack>
        <Stack width={'100%'}>
          <Typography>Center</Typography>
          <SankeyChart
            height={200}
            series={{
              data,
              nodeOptions: {
                align: 'center',
                sort: nodeSortFunction,
              },
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}

const data = {
  nodes: [],
  links: [
    { source: 'A', target: 'B', value: 2 },
    { source: 'B', target: 'D', value: 4 },
    { source: 'E', target: 'D', value: 4 },
    { source: 'D', target: 'F', value: 1 },
    { source: 'D', target: 'G', value: 7 },
    { source: 'G', target: 'H', value: 2 },
    { source: 'G', target: 'I', value: 5 },
    { source: 'I', target: 'J', value: 3 },
    { source: 'I', target: 'K', value: 2 },
  ],
};

// Sort nodes alphabetically by label
const nodeSortFunction = (a, b) => {
  const labelA = a.label || a.id;
  const labelB = b.label || b.id;
  return labelA.localeCompare(labelB);
};
