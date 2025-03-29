import * as React from 'react';
import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';

export function RectangularCornersIcon({ fontSize = 'medium' }: { fontSize: 'small' | 'medium' }) {
  return (
    <SvgIcon fontSize={fontSize} className="rectangular" viewBox="0 0 20 20" fill="currentColor">
      <path d="M15.6812 4.81884H2V2.5H18V18.5H15.6812V4.81884Z" />
    </SvgIcon>
  );
}
export function MediumCornersIcon({ fontSize = 'medium' }: { fontSize: 'small' | 'medium' }) {
  return (
    <SvgIcon fontSize={fontSize} className="medium" viewBox="0 0 20 20" fill="currentColor">
      <path d="M12.2029 4.31884H2V2H12.2029C15.4045 2 18 4.59545 18 7.7971V18H15.6812V7.7971C15.6812 5.87611 14.1239 4.31884 12.2029 4.31884Z" />
    </SvgIcon>
  );
}
export function RoundedCornersIcon({ fontSize = 'medium' }: { fontSize: 'small' | 'medium' }) {
  return (
    <SvgIcon fontSize={fontSize} className="rounded" viewBox="0 0 20 20" fill="currentColor">
      <path d="M15.6812 18C15.6812 10.4441 9.5559 4.31884 2 4.31884V2C10.8366 2 18 9.16344 18 18H15.6812Z" />
    </SvgIcon>
  );
}

export function ColorSwatch({ color }: { color: string }) {
  return (
    <Box
      sx={(theme) => ({
        width: '50px',
        height: '12px',
        background: color,
        borderRadius: theme.shape.borderRadius,
      })}
    />
  );
}
