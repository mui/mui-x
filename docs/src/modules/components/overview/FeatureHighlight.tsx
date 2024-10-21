import * as React from 'react';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import LanguageIcon from '@mui/icons-material/Language';
import InfoCard from './InfoCard';

const featuredItems = [
  {
    title: 'Highly customizable',
    description:
      'Start with our meticulous Material Design implementation, or go fully custom with your own design system.',
    icon: <FormatPaintIcon fontSize="small" color="primary" />,
  },
  {
    title: 'Accessibility',
    description:
      'We are committed to meeting or exceeding global standards for accessibility, and we provide thorough guidance on best practices in our documentation.',
    icon: <AccessibilityNewIcon fontSize="small" color="primary" />,
  },
  {
    title: 'Internationalization',
    description:
      'Serve the needs of users all around the world with built-in support for multiple time zones, languages, and date formats.',
    icon: <LanguageIcon fontSize="small" color="primary" />,
  },
];

export default function FeatureHighlight() {
  return (
    <React.Fragment>
      <Divider />
      <Stack spacing={4} py={8} alignItems="center">
        <Stack spacing={1} sx={{ maxWidth: { xs: '500px', md: '100%' } }}>
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
            First-class developer experience
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            MUI X Date and Time Pickers are designed to be delightful and intuitive for developers
            and users alike.
          </Typography>
        </Stack>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ maxWidth: { xs: '500px', md: '100%' } }}
        >
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
