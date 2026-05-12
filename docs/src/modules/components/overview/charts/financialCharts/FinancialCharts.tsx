import * as React from 'react';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InfoCard from '../../InfoCard';
import CandlestickDemo from '../advancedCharts/CandlestickDemo';

const financialChartHighlights = [
  {
    title: 'OHLC market data',
    description: 'Track open, high, low, and close values for each trading interval.',
  },
  {
    title: 'Price direction',
    description: 'Read upward and downward movement instantly with semantic candle colors.',
  },
  {
    title: 'Premium charting',
    description: 'Use a purpose-built chart family for finance, trading, and market dashboards.',
    iconLink: '/static/x/premium.svg',
  },
];

export default function FinancialCharts() {
  return (
    <React.Fragment>
      <Divider />
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 1, md: 6 }}
        sx={{ py: 8, alignItems: 'start' }}
      >
        <Stack spacing={2} sx={{ width: '100%', minWidth: '260px', maxWidth: { md: 300 } }}>
          <div>
            <Typography
              variant="overline"
              sx={(theme) => ({
                display: 'block',
                mb: 1,
                color: (theme.vars || theme).palette.primary.main,
              })}
            >
              Financial Charts
            </Typography>
            <Typography variant="h2" sx={{ fontSize: '1.625rem' }}>
              Candlestick charts
            </Typography>
          </div>
          <Stack
            direction={{ xs: 'row', md: 'column' }}
            spacing={{ xs: 1, md: 2 }}
            sx={{ overflow: 'auto' }}
          >
            {financialChartHighlights.map(({ title, description, iconLink }) => (
              <Stack key={title} sx={{ minWidth: 150 }}>
                <InfoCard
                  title={title}
                  description={description}
                  backgroundColor="subtle"
                  icon={iconLink ? <img src={iconLink} width={16} height={16} alt="" /> : null}
                />
              </Stack>
            ))}
          </Stack>
        </Stack>

        <Stack
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            minHeight: 0,
            minWidth: 0,
          }}
        >
          <CandlestickDemo />
        </Stack>
      </Stack>
    </React.Fragment>
  );
}
