import Box from '@mui/material/Box';
import { styled, alpha } from '@mui/material/styles';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { MUI_X_PRODUCTS } from '../../datasets/products';

const CONNECTOR_LINE_WIDTH = 1;
const CONNECTOR_LINE_CENTER = 17.5;
const CONNECTOR_LINE_LEFT = CONNECTOR_LINE_CENTER - CONNECTOR_LINE_WIDTH / 2;
const CONNECTOR_GAP = 16;

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.grey[200],
  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
    [`& .${treeItemClasses.label}`]: {
      fontSize: '0.8rem',
      fontWeight: 500,
    },
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.dark,
    padding: theme.spacing(0, 1.2),
    ...theme.applyStyles('light', {
      backgroundColor: alpha(theme.palette.primary.main, 0.25),
    }),
    ...theme.applyStyles('dark', {
      color: theme.palette.primary.contrastText,
    }),
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: CONNECTOR_LINE_LEFT,
    paddingLeft: CONNECTOR_GAP,
    borderLeft: `${CONNECTOR_LINE_WIDTH}px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
  ...theme.applyStyles('light', {
    color: theme.palette.grey[800],
  }),
}));

export default function CustomStyling() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView
        defaultExpandedItems={['grid']}
        slots={{ item: CustomTreeItem }}
        items={MUI_X_PRODUCTS}
      />
    </Box>
  );
}
