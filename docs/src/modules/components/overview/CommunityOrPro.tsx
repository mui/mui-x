import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InfoCard from './InfoCard';

type CommunityOrProProps = {
  title: string;
  caption: string;
  description: string;
  communityDescription: string;
  proDescription: string;
};

export default function CommunityOrPro({
  title,
  caption,
  description,
  communityDescription,
  proDescription,
}: CommunityOrProProps) {
  return (
    <React.Fragment>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ md: 'flex-end', xs: 'space-between' }}
        justifyContent={{ md: 'space-between', xs: 'flex-end' }}
        flexGrow={1}
        sx={{ maxWidth: { xs: '500px', md: '100%' } }}
      >
        <Stack flexBasis={{ xs: '100%', md: '65%' }} sx={{ marginBottom: { xs: '16px', md: 0 } }}>
          <Typography variant="body2" color="primary" fontWeight="semiBold">
            {caption}
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            fontWeight="semiBold"
            color="text.primary"
            fontSize="1.625rem"
          >
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        </Stack>

        <Button
          size="small"
          href="/x/introduction/licensing/"
          endIcon={<ArrowForwardIcon />}
          sx={{ width: 'fit-content' }}
          // eslint-disable-next-line material-ui/no-hardcoded-labels
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
            description={[communityDescription]}
            backgroundColor="subtle"
            link="https://mui.com/pricing/"
          />
        </Box>
        <Box sx={{ flexBasis: '50%' }}>
          <InfoCard
            title="Pro"
            icon={<img src="/static/x/pro.svg" width={16} height={16} alt="" />}
            description={[proDescription]}
            backgroundColor="subtle"
            link="https://mui.com/pricing/"
          />
        </Box>
      </Stack>
    </React.Fragment>
  );
}
