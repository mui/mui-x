import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function ChatGetStarted() {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{ py: 8, alignItems: 'center', justifyContent: 'center' }}
    >
      <Button variant="contained" href="/x/react-chat/quickstart/" endIcon={<ArrowForwardIcon />}>
        Get started
      </Button>
      <Button
        variant="outlined"
        href="/x/react-chat/all-components/"
        endIcon={<ArrowForwardIcon />}
      >
        Explore all components
      </Button>
    </Stack>
  );
}
