import * as React from 'react';
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
      <Stack direction="column" spacing={2} py={4} alignItems="center">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ md: 'flex-end', xs: 'space-between' }}
          justifyContent={{ md: 'space-between', xs: 'flex-end' }}
          flexGrow={1}
          sx={{ width: '100%' }}
        >
          <Stack>
            <Typography variant="body2" color="primary" fontWeight="semiBold">
              Community or Pro
            </Typography>
            <Typography
              variant="h4"
              component="h3"
              fontWeight="semiBold"
              color="text.primary"
              fontSize="1.625rem"
            >
              Available in two packages
            </Typography>
            <Typography variant="body1" color="text.secondary">
              An adaptable and reliable suite of date and time components
            </Typography>
          </Stack>

          <Button
            size="small"
            href="/x/introduction/licensing"
            endIcon={<ArrowForwardIcon />}
            variant="contained"
            sx={{ width: 'fit-content' }}
          >
            About licensing
          </Button>
        </Stack>
        <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ width: '100%' }}>
          <InfoCard
            title="Community"
            icon={<img src="/static/x/community.svg" width={16} height={16} alt="" />}
            description={[
              'MIT licensed, free forever',
              'Contains all components to edit dates and times',
            ]}
          />
          <InfoCard
            title="Pro"
            icon={<img src="/static/x/pro.svg" width={16} height={16} alt="" />}
            description={[
              'Commercially licensed',
              'Contains additional components to edit date and/or time ranges',
            ]}
          />
        </Stack>
      </Stack>
      <Divider />
    </React.Fragment>
  );
}
