import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export function Card(props) {
  const { children, ...other } = props;
  return (
    <Stack direction="row" gap={2} alignItems="center" height="100%" {...other}>
      {children}
    </Stack>
  );
}

export function CardMedia(props) {
  const { children, ...other } = props;
  return (
    <Stack
      sx={{ flexShrink: 0, alignItems: 'center', ...(other.sx || {}) }}
      {...other}
    >
      {children}
    </Stack>
  );
}

export function CardContent(props) {
  const { children, ...other } = props;
  return (
    <Stack gap={0.25} {...other}>
      {children}
    </Stack>
  );
}

export function CardTitle(props) {
  const { children, ...other } = props;
  return (
    <Typography variant="body2" {...other}>
      {children}
    </Typography>
  );
}

export function CardDetailList(props) {
  const { children, ...other } = props;
  return (
    <Stack direction="row" flexWrap="wrap" gap={1} {...other}>
      {children}
    </Stack>
  );
}

export function CardDetail(props) {
  const { children, ...other } = props;
  return (
    <Typography variant="caption" color="text.secondary" {...other}>
      {children}
    </Typography>
  );
}
