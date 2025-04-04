import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function DemoWrapper({
  children,
  controls: ToolbarControls,
  link,
}: {
  children: React.ReactNode;
  controls?: React.ReactNode;
  link: string;
}) {
  return (
    <Box
      component="div"
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        flexGrow: 1,
        width: '100%',
        justifyContent: 'space-between',
        background: (theme.vars || theme).palette.gradients.linearSubtle,
      })}
    >
      {children}

      <Paper
        component="div"
        elevation={0}
        sx={(theme) => ({
          width: '100%',
          border: '1px solid transparent',
          borderTopColor: 'divider',
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          display: 'flex',
          padding: theme.spacing(1),
          justifyContent: 'flex-end',
          alignItems: { md: 'center' },
          gap: 2,
        })}
      >
        {ToolbarControls}
        {/* eslint-disable-next-line material-ui/no-hardcoded-labels */}
        <Button size="small" href={link} endIcon={<ArrowForwardIcon />}>
          More info
        </Button>
      </Paper>
    </Box>
  );
}
