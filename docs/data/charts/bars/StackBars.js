import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { addLabels, balanceSheet, valueFormatter } from './netflixsBalanceSheet';

export default function StackBars() {
  return (
    <div style={{ width: '100%' }}>
      <Typography>Netflix balance sheet</Typography>
      <BarChart
        dataset={balanceSheet}
        series={addLabels([
          { dataKey: 'currAss', stack: 'assets' },
          { dataKey: 'nCurrAss', stack: 'assets' },
          { dataKey: 'curLia', stack: 'liability' },
          { dataKey: 'nCurLia', stack: 'liability' },
          { dataKey: 'capStock', stack: 'equity' },
          { dataKey: 'retEarn', stack: 'equity' },
          { dataKey: 'treas', stack: 'equity' },
        ])}
        xAxis={[{ dataKey: 'year' }]}
        {...config}
      />
    </div>
  );
}

const config = {
  height: 350,
  margin: { left: 0 },
  yAxis: [{ width: 50, valueFormatter }],
  hideLegend: true,
};
