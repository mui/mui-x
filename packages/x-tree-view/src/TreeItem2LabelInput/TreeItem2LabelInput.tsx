import { styled } from '../internals/zero-styled';

const TreeItem2LabelInput = styled('input', {
  name: 'MuiTreeItem2',
  slot: 'LabelInput',
  overridesResolver: (props, styles) => styles.labelInput,
})(({ theme }) => ({
  ...theme.typography.body1,
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  border: 'none',
  padding: '0 2px',
  boxSizing: 'border-box',
  '&:focus': {
    outline: `1px solid ${theme.palette.primary.main}`,
  },
}));

export { TreeItem2LabelInput };
