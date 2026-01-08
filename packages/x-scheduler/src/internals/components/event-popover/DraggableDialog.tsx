'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper, { PaperProps } from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { useDraggableDialog } from '@mui/x-scheduler-headless/use-draggabble-dialog';

function PaperComponent(props: PaperProps & { anchorEl?: HTMLElement | null }) {
  const nodeRef = React.useRef<HTMLDivElement>(null);

  const mutateStyle = React.useCallback((style: string) => {
    if (nodeRef.current) {
      nodeRef.current.style.transform = style;
    }
  }, []);

  const resetDrag = useDraggableDialog(nodeRef, mutateStyle);
  const { anchorEl, ...other } = props;

  const calculatePosition = React.useCallback(
    (shouldResetDrag = false) => {
      const element = nodeRef.current;
      if (!element || !anchorEl) {
        return;
      }

      const anchorRect = anchorEl.getBoundingClientRect();
      const elemRect = element.getBoundingClientRect();
      const margin = 16;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let top = 0;
      let left = 0;

      // Helper to clamp values to viewport
      const clamp = (value: number, min: number, max: number) =>
        Math.max(min, Math.min(value, max));

      // Determine available space
      const spaceRight = windowWidth - anchorRect.right;
      const spaceLeft = anchorRect.left;
      const spaceBottom = windowHeight - anchorRect.bottom;
      const spaceTop = anchorRect.top;

      if (spaceRight >= elemRect.width + margin) {
        // Position Right
        left = anchorRect.right + margin;
        // Align Top, but clamp to viewport
        top = anchorRect.top;
        top = clamp(top, margin, windowHeight - elemRect.height - margin);
      } else if (spaceLeft >= elemRect.width + margin) {
        // Position Left
        left = anchorRect.left - elemRect.width - margin;
        // Align Top, but clamp to viewport
        top = anchorRect.top;
        top = clamp(top, margin, windowHeight - elemRect.height - margin);
      } else if (spaceBottom >= elemRect.height + margin) {
        // Position Bottom
        top = anchorRect.bottom + margin;
        // Align Left, clamp
        left = anchorRect.left;
        left = clamp(left, margin, windowWidth - elemRect.width - margin);
      } else if (spaceTop >= elemRect.height + margin) {
        // Position Top
        top = anchorRect.top - elemRect.height - margin;
        // Align Left, clamp
        left = anchorRect.left;
        left = clamp(left, margin, windowWidth - elemRect.width - margin);
      } else {
        // Fallback: Center on screen
        left = (windowWidth - elemRect.width) / 2;
        top = (windowHeight - elemRect.height) / 2;
      }

      element.style.top = `${top}px`;
      element.style.left = `${left}px`;

      if (shouldResetDrag) {
        // Reset transform when position is recalculated
        resetDrag();
      }
    },
    [anchorEl, resetDrag],
  );

  React.useLayoutEffect(() => {
    calculatePosition(true);
  }, [calculatePosition]);

  React.useEffect(() => {
    const handleResize = () => {
      calculatePosition(false);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [calculatePosition]);

  return (
    <Paper
      {...other}
      ref={nodeRef}
      sx={{
        position: 'relative',
        inset: 0,
        p: 2,
        borderWidth: 0,
        borderTopWidth: 1,
        height: 'fit-content',
        m: 0,
      }}
    />
  );
}

export interface SimpleDialogProps {
  open: boolean;
  onClose: (event: React.SyntheticEvent) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, open } = props;

  return (
    <Fade appear={false} in={open}>
      <Paper
        role="dialog"
        aria-modal="false"
        aria-label="Cookie banner"
        square
        variant="outlined"
        tabIndex={-1}
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          m: '8px',
          borderRadius: 1,
          p: 2,
          borderWidth: 0,
          borderTopWidth: 1,
        }}
      >
        <Typography variant="body1" sx={{ mb: 2 }}>
          This is a nested child that sticks to the bottom.
        </Typography>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </Paper>
    </Fade>
  );
}

export default function DraggableDialog() {
  const [open, setOpen] = React.useState(false);
  const [childOpen, setChildOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClickOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setChildOpen(false);
    setOpen(false);
  };

  const handleOpenChild = () => {
    setChildOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open draggable dialog
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        aria-modal="false"
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'transparent',
            },
          },
          container: {
            sx: { width: '100%', justifyContent: 'unset', alignItems: 'unset' },
          },
          paper: { sx: { m: 0 }, anchorEl },
        }}
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Subscribe
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleOpenChild}>Subscribe</Button>
        </DialogActions>
        <SimpleDialog open={childOpen} onClose={(_e) => setChildOpen(false)} />
      </Dialog>
    </Box>
  );
}
