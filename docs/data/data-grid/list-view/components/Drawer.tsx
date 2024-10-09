import * as React from 'react';
import MUISwipeableDrawer, {
  SwipeableDrawerProps as MUISwipeableDrawerProps,
} from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import Stack, { StackProps } from '@mui/material/Stack';
import { grey } from '@mui/material/colors';

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

export interface DrawerHeaderProps extends StackProps {}

export function DrawerHeader(props: DrawerHeaderProps) {
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

export interface DrawerProps extends Omit<MUISwipeableDrawerProps, 'onOpen'> {
  width?: number;
  container?: () => HTMLElement;
}

export function Drawer(props: DrawerProps) {
  const { children, anchor, width = 320, container, ...other } = props;
  const isBottomDrawer = anchor === 'bottom';

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
              }
            : {
                width,
              }),
        },
      }}
      disableSwipeToOpen
      onOpen={() => {}} // required by SwipeableDrawer but not used in this demo
    >
      {isBottomDrawer && <SwipeIndicator />}
      {children}
    </MUISwipeableDrawer>
  );
}
