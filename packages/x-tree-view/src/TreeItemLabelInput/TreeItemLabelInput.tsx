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
  '&:focus': {
    outline: `1px solid ${(theme.vars || theme).palette.primary.main}`,
  },
}));

export { TreeItemLabelInput };
