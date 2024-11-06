import * as React from 'react';
import Typography from '@mui/material/Typography';
import IconImage from 'docs/src/components/icon/IconImage';

export default function XLogo() {
  return (
    <Typography
      variant="body2"
      sx={[
        {
          fontWeight: 'bold',
        },
        (theme) => ({
          color: 'primary.600',
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'center', md: 'flex-start' },
          '& > *': { mr: 1 },
          ...theme.applyDarkStyles({
            color: 'primary.400',
          }),
        }),
      ]}
    >
      <IconImage width={28} height={28} loading="eager" name="product-advanced" /> MUI X
    </Typography>
  );
}
