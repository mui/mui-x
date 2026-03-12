import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import MovingIcon from '@mui/icons-material/Moving';
import InfoCard from '../InfoCard';

const featuredItems = [
  {
    title: 'Flexible scheduling views',
    description:
      'From day and week calendars to full timeline visualizations, display events the way your users need them.',
    icon: <CalendarViewMonthIcon fontSize="small" color="primary" />,
  },
  {
    title: 'Rich event interactions',
    description:
      'Drag to reschedule, resize to adjust duration, and click to edit—all with smooth, built-in interactions.',
    icon: <TouchAppIcon fontSize="small" color="primary" />,
  },
  {
    title: 'Performant and scalable',
    description:
      'Handle large datasets with virtualization and lazy loading to keep your scheduling UI fast and responsive.',
    icon: <MovingIcon fontSize="small" color="primary" />,
  },
];

export default function SchedulerFeaturesHighlight() {
  return (
    <React.Fragment>
      <Divider />
      <Stack spacing={4} py={8} alignItems="center">
        <Stack spacing={1} sx={{ maxWidth: { xs: '500px', md: '100%' } }}>
          <Typography variant="body2" color="primary" fontWeight="semiBold" textAlign="center">
            Using the MUI X Scheduler
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            fontWeight="semiBold"
            color="text.primary"
            textAlign="center"
          >
            Scheduling that adapts to your workflow
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            A feature-rich, customizable React scheduling solution with intuitive interactions and
            best-in-class developer experience.
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
