import { Unstable_SankeyChart as SankeyChart } from '@mui/x-charts-pro/SankeyChart';

export default function SankeyBasicDataStructure() {
  return (
    <SankeyChart
      height={250}
      series={{
        data: {
          links: [
            { source: 'A', target: 'B', value: 10 },
            { source: 'A', target: 'C', value: 5 },
            { source: 'B', target: 'D', value: 8 },
            { source: 'C', target: 'D', value: 3 },
          ],
        },
      }}
    />
  );
}
