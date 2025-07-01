/* eslint-disable material-ui/no-hardcoded-labels */
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { SelectOptions } from './types';
import AdvancedFeaturesToggle from './AdvancedFeaturesToggle';
import BarChartDemo from './BarChartDemo';
import { sxColors } from '../colors';

export default function BarChartToggle() {
  const [selectedAdvancedFeature, setSelectedAdvancedFeature] =
    React.useState<SelectOptions>('stacking');

  return (
    <Stack spacing={1} sx={sxColors}>
      <Typography variant="subtitle2">Advanced data visualization</Typography>
      <Typography variant="body2" color="text.secondary">
        Compare and analyze data across categories by layering data series.
      </Typography>
      <AdvancedFeaturesToggle
        selected={selectedAdvancedFeature}
        onToggleChange={setSelectedAdvancedFeature}
      />
      <Box
        sx={{
          width: '100%',
          height: '100%',
          minHeight: '100px',
        }}
      >
        <BarChartDemo selected={selectedAdvancedFeature} />
      </Box>
    </Stack>
  );
}
