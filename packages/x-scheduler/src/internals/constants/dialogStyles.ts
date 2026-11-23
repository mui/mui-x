import type { CSSObject, Theme } from '@mui/material/styles';
import { backdropClasses } from '@mui/material/Backdrop';
import { dialogClasses } from '@mui/material/Dialog';

// Styles shared by the scheduler dialogs. Each dialog spreads them into its own styled
// components, so theming one dialog doesn't change the others.

export const dialogRootBaseStyles: CSSObject = {
  [`& .${backdropClasses.root}`]: {
    backgroundColor: 'transparent',
  },
  [`& .${dialogClasses.container}`]: {
    width: '100%',
    justifyContent: 'unset',
    alignItems: 'unset',
  },
  [`& .${dialogClasses.paper}`]: {
    // `useAnchoredPosition` sets `top` and `left` in viewport coordinates. With the default
    // `position: relative`, they would offset the paper from the flex start, which is the right
    // edge in RTL.
    position: 'absolute',
    // Otherwise the width would shrink with the space left after `left`.
    width: 'max-content',
    margin: 0,
    // Never let the anchored dialog grow past the viewport on narrow (mobile) screens.
    maxWidth: '100%',
  },
};

export const getDialogPaperBaseStyles = (theme: Theme): CSSObject => ({
  borderWidth: 0,
  borderTopWidth: 1,
  height: 'fit-content',
  overflow: 'hidden',
  '&[data-dragging]': {
    outline: `1px solid ${(theme.vars || theme).palette.primary.light}`,
  },
});

export const getDialogHeaderBaseStyles = (theme: Theme): CSSObject => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  padding: theme.spacing(3),
  // A header without `data-draggable` (the drawer's) shows no move cursor.
  '&[data-draggable]': {
    cursor: 'move',
  },
});

export const dialogContentBaseStyles: CSSObject = {
  cursor: 'default',
  userSelect: 'text',
  padding: 0,
  // Shrink to fit the paper (capped at the viewport) so the form doesn't overflow on mobile screens.
  maxWidth: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  maxHeight: '100%',
};

export const dialogFormBaseStyles: CSSObject = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
};

export const getDialogFormActionsBaseStyles = (theme: Theme): CSSObject => ({
  padding: theme.spacing(3),
  gap: theme.spacing(2),
});
