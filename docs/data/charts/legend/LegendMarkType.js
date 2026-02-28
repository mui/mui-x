import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { BarChart } from '@mui/x-charts/BarChart';

const series = [
  { id: 'id-0', data: [10], label: 'Series A' },
  { id: 'id-1', data: [15], label: 'Series B' },
  { id: 'id-2', data: [20], label: 'Series C' },
  { id: 'id-3', data: [10], label: 'Series D' },
];

export default function LegendMarkType() {
  return (
    <ChartsUsageDemo
      componentName="Legend"
      data={{
        markType: {
          knob: 'select',
          defaultValue: 'square',
          options: ['square', 'circle', 'line'],
        },
      }}
      renderDemo={(props) => (
        <BarChart
          series={series.map((seriesItem) => ({
            ...seriesItem,
            labelMarkType: props.markType,
          }))}
          xAxis={[{ data: ['A'] }]}
          height={200}
        />
      )}
      getCode={({ props }) => {
        return `import { BarChart } from '@mui/x-charts/BarChart';

<BarChart
  {/** ... */}
  series={
    series.map((seriesItem) => ({
      ...seriesItem,
      labelMarkType: '${props.markType}',
    }))
  }
/>
`;
      }}
    />
  );
}
