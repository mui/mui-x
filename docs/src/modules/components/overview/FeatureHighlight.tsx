import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';

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

type InfoCardProps = { title: string; description: string; icon?: React.ReactNode };
function InfoCard({ title, description, icon: Icon }: InfoCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={(theme) => ({
        p: 2.5,
        height: '100%',
        flexGrow: '1',
        background: `${(theme.vars || theme).palette.gradients.linearSubtle}`,
        ...theme.applyDarkStyles({
          bgcolor: alpha(theme.palette.primaryDark[800], 0.25),
          background: `${(theme.vars || theme).palette.gradients.linearSubtle}`,
          borderColor: 'primaryDark.700',
        }),
      })}
    >
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        {Icon}
        <Typography
          gutterBottom
          fontWeight="semiBold"
          component="h3"
          color="text.primary"
          variant="body2"
        >
          {title}
        </Typography>
      </Stack>
      <Typography color="text.secondary" variant="body2">
        {description}
      </Typography>
    </Paper>
  );
}

export default function FeatureHighlight() {
  return (
    <Stack spacing={4} py={4}>
      <Divider />
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
          An adaptable and reliable suite of date and time components
        </Typography>
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        {featuredItems.map(({ title, description, icon }, index) => (
          <InfoCard title={title} description={description} icon={icon} key={index} />
        ))}
      </Stack>
    </Stack>
  );
}
