import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InfoCard from './InfoCard';

export default function CommunityOrPro() {
  return (
    <React.Fragment>
      <Divider />
      <Stack direction="column" spacing={{ xs: 1, md: 2 }} py={8} alignItems="center">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ md: 'flex-end', xs: 'space-between' }}
          justifyContent={{ md: 'space-between', xs: 'flex-end' }}
          flexGrow={1}
          sx={{ maxWidth: { xs: '500px', md: '100%' } }}
        >
          <Stack flexBasis={{ xs: '100%', md: '65%' }} sx={{ marginBottom: { xs: '16px', md: 0 } }}>
            <Typography variant="body2" color="primary" fontWeight="semiBold">
              Community and Pro
            </Typography>
            <Typography
              variant="h4"
              component="h3"
              fontWeight="semiBold"
              color="text.primary"
              fontSize="1.625rem"
            >
              Two packages for every need
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Start with the free-forever Community version, then upgrade to Pro when you are ready
              for additional features and components.
            </Typography>
          </Stack>

          <Button
            size="small"
            href="/x/introduction/licensing/"
            endIcon={<ArrowForwardIcon />}
            sx={{ width: 'fit-content' }}
          >
            About licensing
          </Button>
        </Stack>
        <Stack
          spacing={2}
          direction={{ xs: 'column', md: 'row' }}
          sx={{ paddingTop: 2, maxWidth: { xs: '500px', md: '100%' } }}
        >
          <Box sx={{ flexBasis: '50%' }}>
            <InfoCard
              title="Community"
              icon={<img src="/static/x/community.svg" width={16} height={16} alt="" />}
              description={[
                'Free forever under an MIT license. Includes Date Pickers, Time Pickers, and Date Time Pickers.',
              ]}
              backgroundColor="subtle"
              link="https://mui.com/pricing/"
            />
          </Box>
          <Box sx={{ flexBasis: '50%' }}>
            <InfoCard
              title="Pro"
              icon={<img src="/static/x/pro.svg" width={16} height={16} alt="" />}
              description={[
                'Requires a commercial license. Includes all Community components plus the Date and Time Range Pickers.',
              ]}
              backgroundColor="subtle"
              link="https://mui.com/pricing/"
            />
          </Box>
        </Stack>
      </Stack>
    </React.Fragment>
  );
}
