import * as React from 'react';
import Typography from '@mui/material/Typography';

interface SourceCaptionProps {
  children: React.ReactNode;
}

export default function SourceCaption(props: SourceCaptionProps) {
  return (
    <Typography
      variant="caption"
      sx={{
        color: 'text.disabled',
        fontWeight: 400,
        textAlign: 'end',
        '& a': {
          color: 'inherit',
          fontWeight: 400,
          textDecoration: 'none',
        },
        '& a:hover': {
          color: 'text.secondary',
          textDecoration: 'underline',
        },
      }}
    >
      {props.children}
    </Typography>
  );
}
