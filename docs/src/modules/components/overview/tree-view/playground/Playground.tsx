import * as React from 'react';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PlaygroundTreeView from './PlaygroundTreeView';

export default function MainDemo() {
  return (
    <React.Fragment>
      <Divider />
      <Stack spacing={4} py={8} alignItems="center">
        <Stack spacing={1} sx={{ width: '100%', maxWidth: { xs: '500px', md: '100%' } }}>
          {/* eslint-disable-next-line material-ui/no-hardcoded-labels */}
          <Typography variant="body2" color="primary" fontWeight="semiBold" textAlign="center">
            Customization
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            fontWeight="semiBold"
            color="text.primary"
            textAlign="center"
            // eslint-disable-next-line material-ui/no-hardcoded-labels
          >
            Superior developer experience for customization
          </Typography>
          {/* eslint-disable-next-line material-ui/no-hardcoded-labels */}
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Intuitive APIs, a modern customization approach, and detailed documentation make it
            effortless to tailor the component to your specific use case.
          </Typography>
        </Stack>

        <Paper
          component="div"
          variant="outlined"
          sx={(theme) => ({
            mb: 8,
            height: 640,
            width: '100%',
            overflow: 'hidden',
            backgroundImage: `linear-gradient(${theme.palette.divider} 1px, transparent 1px), linear-gradient(to right,${theme.palette.divider} 1px, ${theme.palette.background.paper} 1px)`,
          })}
        >
          <Stack
            pl={1}
            py={1}
            sx={(theme) => ({
              borderRight: { xs: 'none', md: `1px solid ${theme.palette.divider}` },
              height: '100%',
              minWidth: { xs: '100%', md: 'fit-content' },
              alignItems: 'center',
            })}
          >
            <PlaygroundTreeView />
          </Stack>
        </Paper>
      </Stack>
    </React.Fragment>
  );
}
