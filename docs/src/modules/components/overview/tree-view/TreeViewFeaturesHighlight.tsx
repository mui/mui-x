import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import MovingIcon from '@mui/icons-material/Moving';
import InfoCard from '../InfoCard';

const featuredItems = [
  {
    title: 'Customizable and  flexible',
    description:
      'Easily adapt the look and feel and behavior to fit any brand, no matter your use case.',
    icon: <FormatPaintIcon fontSize="small" color="primary" />,
  },
  {
    title: 'Inclusive by design',
    description:
      'Built to meet accessibility standards, ensuring a seamless experience for every user.',
    icon: <AccessibilityNewIcon fontSize="small" color="primary" />,
  },
  {
    title: 'Performant and scalable',
    description:
      'Leverage features like virtualization and lazy loading to deliver lightning-fast performance at any scale.',
    icon: <MovingIcon fontSize="small" color="primary" />,
  },
];

export default function TreeViewFeaturesHighlight() {
  return (
    <React.Fragment>
      <Divider />
      <Stack spacing={4} py={8} alignItems="center">
        <Stack spacing={1} sx={{ maxWidth: { xs: '500px', md: '100%' } }}>
          {/* eslint-disable-next-line material-ui/no-hardcoded-labels */}
          <Typography variant="body2" color="primary" fontWeight="semiBold" textAlign="center">
            Using MUI X Tree View
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            fontWeight="semiBold"
            color="text.primary"
            textAlign="center"
            // eslint-disable-next-line material-ui/no-hardcoded-labels
          >
            Create stunning tree structures
          </Typography>
          {/* eslint-disable-next-line material-ui/no-hardcoded-labels */}
          <Typography variant="body1" color="text.secondary" textAlign="center">
            A high-performance, customizable React component with the best possible developer
            experience.
          </Typography>
        </Stack>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ maxWidth: { xs: '500px', md: '100%' } }}
        >
          {featuredItems.map(({ title, description, icon }, index) => (
            <Box sx={{ flexBasis: '33%' }} key={index}>
              <InfoCard
                title={title}
                description={description}
                icon={icon}
                backgroundColor="subtle"
              />
            </Box>
          ))}
        </Stack>
      </Stack>
    </React.Fragment>
  );
}
