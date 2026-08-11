import * as React from 'react';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function SchedulerCommunityOrPremium() {
  return (
    <React.Fragment>
      <Divider />
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          alignItems: { md: 'flex-end', xs: 'space-between' },
          justifyContent: { md: 'space-between', xs: 'flex-end' },
          flexGrow: 1,
          maxWidth: { xs: '500px', md: '100%' },
          width: '100%',
          mt: 6,
          mb: 12,
        }}
      >
        <Stack
          spacing={1}
          sx={{ flexBasis: { xs: '100%', md: '65%' }, marginBottom: { xs: '16px', md: 0 } }}
        >
          <Typography variant="body2" color="primary" sx={{ fontWeight: 'semiBold' }}>
            Plans & licensing
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            sx={{ fontWeight: 'semiBold', color: 'text.primary', fontSize: '1.625rem' }}
          >
            Two packages for every need
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Community is MIT-licensed and free forever. Premium is licensed per developer and adds
            advanced calendar features plus the Event Timeline.{' '}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button
            size="small"
            variant="contained"
            href="/pricing"
            endIcon={<ArrowForwardIcon />}
            sx={{ width: 'fit-content' }}
          >
            Compare plans
          </Button>
          <Button
            size="small"
            variant="outlined"
            href="/x/introduction/licensing/"
            endIcon={<ArrowForwardIcon />}
            sx={{ width: 'fit-content' }}
          >
            About licensing
          </Button>
        </Stack>
      </Stack>
    </React.Fragment>
  );
}
