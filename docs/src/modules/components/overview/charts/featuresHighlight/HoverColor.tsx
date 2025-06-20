import * as React from 'react';
import Box from '@mui/material/Box';
import { blackAndWhite, colorFull } from './colors';

export default function HoverColor(props: React.PropsWithChildren) {
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
      {props.children}
    </Box>
  );
}
