/**
 * Styles shared by the content of the scheduler dialogs. Each dialog spreads them into its own
 * styled component, so theming one dialog doesn't change the others.
 */
export const dialogContentBaseStyles = {
  cursor: 'default',
  userSelect: 'text',
  padding: 0,
  // Shrink to fit the paper (capped at the viewport) so the form doesn't overflow on mobile screens.
  maxWidth: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  maxHeight: '100%',
} as const;
