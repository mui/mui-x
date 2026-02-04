import Box from '@mui/material/Box';
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';

// datasource: https://ourworldindata.org/grapher/distribution-of-population-between-different-poverty-thresholds-stacke-bar-2011-ppp?country=~OWID_WRL&tableSearch=world

export default function PyramidSegmentLinear() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        series={[
          {
            curve: 'pyramid',
            data: [
              { label: 'Above $30 a day', value: 16 },
              { label: '$10-$30 a day', value: 25 },
              { label: '$1.90-$10 a day', value: 50 },
              { label: 'Below $1.90 a day', value: 9 },
            ],
            funnelDirection: 'increasing',
          },
        ]}
        categoryAxis={{ scaleType: 'linear' }}
        height={300}
      />
    </Box>
  );
}
