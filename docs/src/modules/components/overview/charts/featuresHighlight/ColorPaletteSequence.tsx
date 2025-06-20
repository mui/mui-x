/* eslint-disable material-ui/no-hardcoded-labels */
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { blackAndWhite, colorFull } from './colors';

const Circle = styled('div')({
  display: 'inline-block',
  borderRadius: '50%',
  width: 24,
  height: 24,
  marginRight: -8,
});

export default function ColorPaletteSequence() {
  return (
    <Box
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
      {colorFull.map((color, index) => (
        <Circle
          key={color}
          sx={{
            backgroundColor: `var(--palette-color-${index}, ${color})`,
            transition: 'background-color 0.5s',
          }}
        />
      ))}
      <Typography variant="subtitle2">Customization and styling</Typography>
      <Typography variant="body2" color="text.secondary">
        Fine-grained control over appearance to match your brand and style.
      </Typography>
    </Box>
  );
}
