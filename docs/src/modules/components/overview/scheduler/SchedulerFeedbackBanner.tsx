import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const FEEDBACK_FORM_URL = 'https://forms.gle/Ksbc91D3PcMiiK5x9';
const DISMISSED_STORAGE_KEY = 'mui-x-scheduler-feedback-dismissed';

export default function SchedulerFeedbackBanner() {
  const [open, setOpen] = React.useState(true);

  React.useEffect(() => {
    if (window.localStorage.getItem(DISMISSED_STORAGE_KEY) === 'true') {
      setOpen(false);
    }
  }, []);

  const handleDismiss = () => {
    setOpen(false);
    window.localStorage.setItem(DISMISSED_STORAGE_KEY, 'true');
  };

  if (!open) {
    return null;
  }

  const content = (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{ alignItems: 'center', justifyContent: 'space-between' }}
    >
      <Typography
        variant="body2"
        sx={(theme) => ({
          color: 'primary.900',
          ...theme.applyDarkStyles({ color: 'primary.100' }),
        })}
      >
        🚀 The Scheduler is in alpha — we&apos;d love your input.{' '}
        <Link
          href={FEEDBACK_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          sx={(theme) => ({
            fontWeight: 'semiBold',
            color: 'primary.700',
            textDecorationColor: alpha(theme.palette.primary[700], 0.4),
            '&:hover': { textDecorationColor: 'currentColor' },
            ...theme.applyDarkStyles({
              color: 'primary.200',
              textDecorationColor: alpha(theme.palette.primary[200], 0.4),
            }),
          })}
        >
          Share your feedback →
        </Link>
      </Typography>
      <IconButton
        size="small"
        aria-label="Dismiss feedback banner"
        onClick={handleDismiss}
        sx={(theme) => ({
          color: 'primary.700',
          '&:hover': { bgcolor: alpha(theme.palette.primary[200], 0.4) },
          ...theme.applyDarkStyles({
            color: 'primary.200',
            '&:hover': { bgcolor: alpha(theme.palette.primary[800], 0.4) },
          }),
        })}
      >
        <CloseRoundedIcon fontSize="small" />
      </IconButton>
    </Stack>
  );

  const innerSx = { px: 3, py: 1.25 };

  return (
    <React.Fragment>
      <Box inert aria-hidden sx={{ ...innerSx, visibility: 'hidden', mb: 3 }}>
        {content}
      </Box>
      <Box
        sx={(theme) => ({
          ...innerSx,
          position: 'fixed',
          top: 'var(--MuiDocs-header-height, 0px)',
          left: { xs: 0, lg: 'var(--MuiDocs-navDrawer-width, 0px)' },
          right: 0,
          zIndex: theme.zIndex.appBar - 1,
          bgcolor: 'primary.50',
          borderBottom: '1px solid',
          borderColor: 'divider',
          ...theme.applyDarkStyles({
            bgcolor: alpha(theme.palette.primary[900], 0.4),
          }),
        })}
      >
        {content}
      </Box>
    </React.Fragment>
  );
}
