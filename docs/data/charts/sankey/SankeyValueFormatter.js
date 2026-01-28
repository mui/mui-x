import { SankeyChart } from '@mui/x-charts-pro/SankeyChart';

const data = {
  nodes: [
    { id: 'Coal', label: 'Coal' },
    { id: 'Natural Gas', label: 'Natural Gas' },
    { id: 'Nuclear', label: 'Nuclear' },
    { id: 'Hydro', label: 'Hydro' },
    { id: 'Wind', label: 'Wind' },
    { id: 'Solar', label: 'Solar' },
    { id: 'Electricity', label: 'Electricity' },
    { id: 'Residential', label: 'Residential' },
    { id: 'Commercial', label: 'Commercial' },
    { id: 'Industrial', label: 'Industrial' },
  ],
  links: [
    { source: 'Coal', target: 'Electricity', value: 300 },
    { source: 'Natural Gas', target: 'Electricity', value: 400 },
    { source: 'Nuclear', target: 'Electricity', value: 200 },
    { source: 'Hydro', target: 'Electricity', value: 100 },
    { source: 'Wind', target: 'Electricity', value: 150 },
    { source: 'Solar', target: 'Electricity', value: 80 },
    { source: 'Electricity', target: 'Residential', value: 450 },
    { source: 'Electricity', target: 'Commercial', value: 350 },
    { source: 'Electricity', target: 'Industrial', value: 430 },
  ],
};

export default function SankeyValueFormatter() {
  return (
    <SankeyChart
      height={300}
      series={{
        data,
        valueFormatter: (value, context) => {
          // Format the value as energy units
          const formatted = value >= 1000 ? `${(value / 1000).toFixed(1)} GWh` : `${value} MWh`;

          // You can customize formatting based on context type
          if (context.type === 'link') {
            return `${formatted}`;
          }

          return `${formatted} total`;
        },
        linkOptions: {
          showValues: true,
        },
      }}
    />
  );
}
