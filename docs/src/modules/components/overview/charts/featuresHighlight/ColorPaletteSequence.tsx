/* eslint-disable material-ui/no-hardcoded-labels */
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { blackAndWhite } from './colors';

const Circle = styled('div')({
  display: 'inline-block',
  borderRadius: '50%',
  width: 24,
  height: 24,
  marginRight: -8,
});

export default function ColorPaletteSequence() {
  return (
    <div>
      {blackAndWhite.map((c) => (
        <Circle key={c} sx={{ backgroundColor: c }} />
      ))}
      <Typography variant="subtitle2">Customization and styling</Typography>
      <Typography variant="body2" color="text.secondary">
        Fine-grained control over appearance to match your brand and style.
      </Typography>
    </div>
  );
}
