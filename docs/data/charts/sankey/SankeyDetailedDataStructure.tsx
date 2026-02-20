import { SankeyChart } from '@mui/x-charts-pro/SankeyChart';

export default function SankeyDetailedDataStructure() {
  return (
    <SankeyChart
      height={250}
      series={{
        data: {
          nodes: [
            { id: 'source', label: 'Energy Source', color: '#e57373' },
            { id: 'oil', label: 'Oil Production', color: '#f06292' },
            { id: 'gas', label: 'Natural Gas', color: '#ba68c8' },
            { id: 'usage', label: 'Energy Usage', color: '#64b5f6' },
          ],
          links: [
            { source: 'source', target: 'oil', value: 30, color: '#e57373' },
            { source: 'source', target: 'gas', value: 20, color: '#e57373' },
            { source: 'oil', target: 'usage', value: 25, color: '#f06292' },
            { source: 'gas', target: 'usage', value: 15, color: '#ba68c8' },
          ],
        },
      }}
    />
  );
}
