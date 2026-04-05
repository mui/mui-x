import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import SpeedIcon from '@mui/icons-material/Speed';
import ForumIcon from '@mui/icons-material/Forum';
import TuneIcon from '@mui/icons-material/Tune';
import InfoCard from '../InfoCard';

const featuredItems = [
  {
    title: 'Real-time streaming',
    description:
      'Display assistant responses token-by-token as they are generated, for a smooth and interactive experience.',
    icon: <SpeedIcon fontSize="small" color="primary" />,
  },
  {
    title: 'Multi-conversation',
    description:
      'Manage multiple conversations with a sidebar, thread switching, and per-conversation message state.',
    icon: <ForumIcon fontSize="small" color="primary" />,
  },
  {
    title: 'Flexible and customizable',
    description:
      'Connect to any backend, override slots, and apply theme overrides for full control of your chat UI.',
    icon: <TuneIcon fontSize="small" color="primary" />,
  },
];

export default function ChatFeaturesHighlight() {
  return (
    <React.Fragment>
      <Divider />
      <Stack spacing={4} py={8} alignItems="center">
        <Stack spacing={1} sx={{ maxWidth: { xs: '500px', md: '100%' } }}>
          <Typography variant="body2" color="primary" fontWeight="semiBold" textAlign="center">
            Using MUI X Chat
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            fontWeight="semiBold"
            color="text.primary"
            textAlign="center"
          >
            Build powerful chat experiences
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            A fully styled, theme-aware chat interface with best-in-class developer experience.
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
