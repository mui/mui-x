import * as React from 'react';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, TreeItemContent, TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { UseTreeItemContentSlotOwnProps } from '@mui/x-tree-view/useTreeItem';
import { MUI_X_PRODUCTS } from './products';
import DemoWrapper from '../../DemoWrapper';

function CustomContent(props: UseTreeItemContentSlotOwnProps & { itemId: string }) {
  if (props?.itemId === 'grid-community' && !props.status?.editing) {
    return (
      <Tooltip placement="left" open arrow title="Double click to edit">
        <TreeItemContent {...props} />
      </Tooltip>
    );
  }
  return <TreeItemContent {...props} />;
}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{ content: CustomContent }}
      slotProps={{
        content: {
          itemId: props.itemId,
        } as any,
      }}
    />
  );
});

export default function LabelEditingDemo() {
  const brandingTheme = useTheme();
  const theme = createTheme({ palette: { mode: brandingTheme.palette.mode } });

  return (
    <DemoWrapper link="/x/react-tree-view/rich-tree-view/editing/">
      <Stack
        spacing={1}
        sx={{ width: '100%', padding: 2, minHeight: '600px' }}
        justifyContent="space-between"
      >
        <Box
          sx={{
            minHeight: 352,
            minWidth: 260,
            padding: 2,
            width: 'fit-content',
            alignSelf: 'center',
            position: 'relative',
          }}
        >
          <ThemeProvider theme={theme}>
            <RichTreeView
              items={MUI_X_PRODUCTS}
              isItemEditable
              defaultExpandedItems={['grid', 'pickers']}
              defaultSelectedItems={'grid-community'}
              slots={{ item: CustomTreeItem }}
            />
          </ThemeProvider>
        </Box>

        <HighlightedCode
          code={'<RichTreeView\n  items={MUI_X_PRODUCTS}\n  isItemEditable\n/>'}
          language="js"
          sx={{ overflowX: 'hidden' }}
        />
      </Stack>
    </DemoWrapper>
  );
}
