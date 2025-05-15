/* eslint-disable material-ui/no-hardcoded-labels */
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { SelectOptions } from './types';
import AdvancedFeaturesToggle from './AdvancedFeaturesToggle';
import BarChartDemo from './BarChartDemo';
import { blackAndWhite, colorFull } from '../colors';

export default function BarChartToggle() {
  const [selectedAdvancedFeature, setSelectedAdvancedFeature] =
    React.useState<SelectOptions>('stacking');

  return (
    <Stack
      spacing={1}
      sx={{
        '--palette-color-0': blackAndWhite[0],
        '--palette-color-1': blackAndWhite[1],
        '--palette-color-2': blackAndWhite[2],
        '--palette-color-3': blackAndWhite[3],
        '--palette-color-4': blackAndWhite[4],
        '--palette-color-5': blackAndWhite[5],
        '--palette-color-6': blackAndWhite[6],

        '&:hover': {
          '--palette-color-0': colorFull[0],
          '--palette-color-1': colorFull[1],
          '--palette-color-2': colorFull[2],
          '--palette-color-3': colorFull[3],
          '--palette-color-4': colorFull[4],
          '--palette-color-5': colorFull[5],
          '--palette-color-6': colorFull[6],
        },
      }}
    >
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
