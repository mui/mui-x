import { styled } from '../internals/zero-styled';

/**
 * @ignore - internal component.
 */
const TreeItemLabelInput = styled('input', {
  name: 'MuiTreeItem',
  slot: 'LabelInput',
})(({ theme }) => ({
  ...theme.typography.body1,
  width: '100%',
  backgroundColor: (theme.vars || theme).palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  border: 'none',
  padding: '0 2px',
  boxSizing: 'border-box',
  // Kept on `:focus`, not `:focus-visible`. Core leaves its own Input/TextField
  // out of `focusVisible` because a field signals focus with its border, but this
  // is X's own `styled('input')` drawing a real ring, so the theme should reach
  // it. The selector stays as-is because the input is only mounted while renaming
  // and is focused programmatically — `:focus-visible` may not match a
  // mouse-initiated rename, which would drop the ring exactly when it is needed.
  '&:focus': theme.focusVisible
    ? theme.focusVisible
    : { outline: `1px solid ${(theme.vars || theme).palette.primary.main}` },
}));

export { TreeItemLabelInput };
