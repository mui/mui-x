import * as React from 'react';
import MUISwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { grey } from '@mui/material/colors';
import { useMediaQuery } from '@mui/system';

function SwipeIndicator() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        pt: 2,
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 4,
          backgroundColor: grey[300],
          borderRadius: 4,
        }}
      />
    </Box>
  );
}

export function DrawerHeader(props) {
  const { children, ...other } = props;

  return (
    <Stack
      direction="row"
      px={2}
      py={2}
      gap={3}
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        alignItems: 'center',
        backgroundColor: 'background.paper',
      }}
      {...other}
    >
      {children}
    </Stack>
  );
}

export function Drawer(props) {
  const { children, anchor, width = 320, container, ...other } = props;
  const isBottomDrawer = anchor === 'bottom';
  const isTouch = useMediaQuery('(hover: none)');

  return (
    <MUISwipeableDrawer
      {...other}
      anchor={anchor}
      container={container}
      sx={{
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          ...(isBottomDrawer
            ? {
                pb: 1,
                maxHeight: 'calc(100% - 100px)',
              }
            : {
                width,
              }),
        },
      }}
      disableSwipeToOpen
      onOpen={() => {}} // required by SwipeableDrawer but not used in this demo
    >
      {isTouch && isBottomDrawer && <SwipeIndicator />}
      {children}
    </MUISwipeableDrawer>
  );
}
