import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';

const FEEDBACK_FORM_URL = 'https://forms.gle/Ksbc91D3PcMiiK5x9';
const DISMISSED_STORAGE_KEY = 'mui-x-scheduler-feedback-dismissed';

export default function SchedulerFeedbackWidget() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const dismissed = window.localStorage.getItem(DISMISSED_STORAGE_KEY) === 'true';
    if (!dismissed) {
      setOpen(true);
    }
  }, []);

  const handleDismiss = () => {
    setOpen(false);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DISMISSED_STORAGE_KEY, 'true');
    }
  };

  if (!open) {
    return null;
  }

  return (
    <Paper
      variant="outlined"
      sx={(theme) => ({
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: theme.zIndex.snackbar,
        width: 320,
        maxWidth: 'calc(100vw - 32px)',
        p: 2.5,
        bgcolor: 'background.paper',
        boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.12)}, 0 2px 6px ${alpha(theme.palette.common.black, 0.08)}`,
        ...theme.applyDarkStyles({
          bgcolor: 'primaryDark.900',
          borderColor: 'primaryDark.700',
          boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.5)}, 0 2px 6px ${alpha(theme.palette.common.black, 0.3)}`,
        }),
      })}
    >
      <IconButton
        size="small"
        aria-label="Dismiss feedback widget"
        onClick={handleDismiss}
        sx={{ position: 'absolute', top: 6, right: 6, color: 'text.tertiary' }}
      >
        <CloseRoundedIcon fontSize="small" />
      </IconButton>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1, pr: 3 }}>
        <Box
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 1,
            bgcolor: 'primary.50',
            color: 'primary.600',
            ...theme.applyDarkStyles({
              bgcolor: alpha(theme.palette.primary[900], 0.4),
              color: 'primary.300',
            }),
          })}
        >
          <ChatBubbleOutlineRoundedIcon fontSize="small" />
        </Box>
        <Typography
          component="h3"
          variant="body2"
          sx={{ fontWeight: 'semiBold', color: 'text.primary' }}
        >
          Help shape the Scheduler
        </Typography>
      </Stack>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        The Scheduler is in alpha. Share your feedback to help us prioritize what comes next.
      </Typography>
      <Button
        variant="outlined"
        size="small"
        fullWidth
        href={FEEDBACK_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Share your feedback
      </Button>
    </Paper>
  );
}
