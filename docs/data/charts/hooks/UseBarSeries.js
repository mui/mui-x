import { useBarSeries } from '@mui/x-charts/hooks';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';

const dataset = [
  { month: 'Jan', revenue: 4000, expenses: 2400 },
  { month: 'Feb', revenue: 3000, expenses: 1398 },
  { month: 'Mar', revenue: 5000, expenses: 2800 },
  { month: 'Apr', revenue: 7000, expenses: 3908 },
  { month: 'May', revenue: 6000, expenses: 4800 },
  { month: 'Jun', revenue: 3000, expenses: 8000 },
];

const inUSD = (value) => {
  if (value == null) {
    return '';
  }
  return `$${value.toLocaleString()}`;
};

function BarSeriesInfo() {
  const barSeries = useBarSeries();
  const theme = useTheme();

  const revenue = barSeries
    .find((s) => s.id === 'revenue')
    ?.data.reduce((acc, v) => acc + (v ?? 0), 0);

  const expenses = barSeries
    .find((s) => s.id === 'expenses')
    ?.data.reduce((acc, v) => acc + (v ?? 0), 0);

  const profit = (revenue ?? 0) - (expenses ?? 0);

  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        left: 70,
        background: `color(from ${theme.palette.text.primary} srgb r g b / ${theme.palette.mode === 'dark' ? 0.2 : 0.1})`,
        padding: 12,
        borderRadius: 4,
        fontSize: '12px',
        border: '1px solid #e0e0e0',
        zIndex: 10,
      }}
    >
      <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Half Year Details</h4>
      {barSeries.map((series) => (
        <div key={series.id}>
          <span style={{ fontWeight: 600 }}>
            {typeof series.label === 'function'
              ? series.label('legend')
              : series.label}
          </span>
          <span> {inUSD(series.data.reduce((a, b) => (a ?? 0) + (b ?? 0), 0))}</span>
        </div>
      ))}
      <div>
        <span style={{ fontWeight: 600 }}>Profit</span>
        <span> {inUSD(profit)}</span>
      </div>
    </div>
  );
}

export default function UseBarSeries() {
  return (
    <div>
      <BarChart
        dataset={dataset}
        xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
        sx={{ position: 'relative', height: '100%', width: '100%' }}
        yAxis={[
          {
            scaleType: 'linear',
            valueFormatter: (v) => `${inUSD(v).slice(0, 2)}k`,
          },
        ]}
        series={[
          {
            id: 'revenue',
            dataKey: 'revenue',
            label: 'Revenue',
            color: '#8884d8',
            valueFormatter: inUSD,
          },
          {
            id: 'expenses',
            dataKey: 'expenses',
            label: 'Expenses',
            color: '#82ca9d',
            valueFormatter: inUSD,
          },
        ]}
        width={500}
        height={350}
        slots={{ legend: BarSeriesInfo }}
      />
    </div>
  );
}
