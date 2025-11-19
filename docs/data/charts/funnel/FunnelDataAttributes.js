import Box from '@mui/material/Box';
import { FunnelChart, funnelSectionClasses } from '@mui/x-charts-pro/FunnelChart';

export default function FunnelDataAttributes() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        {...funnelProps}
        sx={{
          [`[data-series="main"] .${funnelSectionClasses.root}:nth-of-type(1)`]: {
            fill: 'url(#pattern)',
          },
        }}
      >
        <defs>
          <pattern id="pattern" width="50" height="50" patternUnits="userSpaceOnUse">
            <rect width="100%" height="100%" fill="hotpink" />
            <circle fill="slateblue" cx="15" cy="15" r="10" />
            <circle fill="slateblue" cx="40" cy="40" r="10" />
          </pattern>
        </defs>
      </FunnelChart>
    </Box>
  );
}

const funnelProps = {
  height: 300,
  hideLegend: true,
  series: [
    {
      id: 'main',
      data: [{ value: 200 }, { value: 180 }, { value: 90 }, { value: 50 }],
    },
  ],
};
