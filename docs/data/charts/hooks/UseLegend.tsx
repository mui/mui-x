import { useLegend } from '@mui/x-charts/hooks';
import { PieChart } from '@mui/x-charts/PieChart';

const data = [
  { id: 0, value: 10, label: 'Series A' },
  { id: 1, value: 15, label: 'Series B' },
  { id: 2, value: 20, label: 'Series C' },
];

function BasicUseLegendExample() {
  const { items } = useLegend();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <h4>Legend Items from useLegend:</h4>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {items.map((item) => (
          <li
            key={`${item.seriesId}-${item.dataIndex}`}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                backgroundColor: item.color,
                borderRadius: 4,
                transform: 'rotate(45deg) skew(-10deg, -10deg)',
              }}
            />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function UseLegend() {
  return (
    <PieChart
      series={[{ data }]}
      height={200}
      slots={{ legend: BasicUseLegendExample }}
    />
  );
}
