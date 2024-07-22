import * as React from 'react';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import InfoCard from './InfoCard';

const featuredItems = [
  {
    title: 'Highly customizable',
    description: 'Comes with Material Design out-of-the box, with support for every design system',
    icon: <FormatPaintIcon fontSize="small" color="primary" />,
  },
  {
    title: 'Accessibility',
    description:
      'Build for all users, the Date and Time pickers are fully compliant with a11y standards',
    icon: <FormatPaintIcon fontSize="small" color="primary" />,
  },
  {
    title: 'Internationalization',
    description: 'Built-in support for multiple time zones, languages, and date formats',
    icon: <FormatPaintIcon fontSize="small" color="primary" />,
  },
];

export default function FeatureHighlight() {
  return (
    <React.Fragment>
      <Divider />
      <Stack spacing={4} py={8}>
        <Stack spacing={1}>
          <Typography variant="body2" color="primary" fontWeight="semiBold" textAlign="center">
            Using MUI X Date Pickers
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            fontWeight="semiBold"
            color="text.primary"
            textAlign="center"
          >
            Select dates and times without confusion
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            An adaptable and reliable suite of date and time components.
          </Typography>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          {featuredItems.map(({ title, description, icon }, index) => (
            <InfoCard
              title={title}
              description={description}
              icon={icon}
              key={index}
              backgroundColor="subtle"
            />
          ))}
        </Stack>
      </Stack>
    </React.Fragment>
  );
}
