import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { useTreeItem2, UseTreeItem2Parameters } from '@mui/x-tree-view/useTreeItem2';
import {
  TreeItem2Content,
  TreeItem2IconContainer,
  TreeItem2GroupTransition,
  TreeItem2Label,
  TreeItem2Root,
  TreeItem2Checkbox,
} from '@mui/x-tree-view/TreeItem2';
import { TreeItem2Icon } from '@mui/x-tree-view/TreeItem2Icon';
import { TreeItem2Provider } from '@mui/x-tree-view/TreeItem2Provider';
import { TreeItem2DragAndDropOverlay } from '@mui/x-tree-view/TreeItem2DragAndDropOverlay';
import { TreeItem2LabelInput } from '@mui/x-tree-view/TreeItem2LabelInput';

type Editable = {
  editable?: boolean;
  id: string;
  label: string;
};
const ITEMS: TreeViewBaseItem<Editable>[] = [
  {
    id: '1',
    label: 'An item',
    children: [
      { id: '1.1', label: 'An editable child', editable: true },
      { id: '1.2', label: 'Another child' },
    ],
  },
];

const AnnotationText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontSize: theme.typography.pxToRem(11),
}));

const CustomTreeItem2Transition = styled(TreeItem2GroupTransition)(({ theme }) => ({
  padding: 6,
  border: '1px solid transparent',
  '&:hover:not(:has(:hover))': {
    borderColor: theme.palette.primary.main,
  },
}));

const CustomTreeItem2LabelInput = styled(TreeItem2LabelInput)(({ theme }) => ({
  color: theme.palette.text.primary,
  border: '1px solid transparent',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));
const CustomTreeItem2Content = styled(TreeItem2Content)(({ theme }) => ({
  border: '1px solid transparent',
  '&:hover:not(:has(:hover))': {
    borderColor: theme.palette.primary.main,
  },
}));
const CustomTreeItem2IconContainer = styled(TreeItem2IconContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: '1px solid transparent',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));
const CustomTreeItem2Label = styled(TreeItem2Label)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: '1px solid transparent',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));
const CustomTreeItem2Checkbox = styled(TreeItem2Checkbox)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: '1px solid transparent',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

interface CustomTreeItemProps
  extends Omit<UseTreeItem2Parameters, 'rootRef'>,
    Omit<React.HTMLAttributes<HTMLLIElement>, 'onFocus'> {}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: CustomTreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const { id, itemId, label, disabled, children, ...other } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleMouseOver = (event: React.MouseEvent) => {
    setAnchorEl(event.target as HTMLElement);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getGroupTransitionProps,
    getDragAndDropOverlayProps,
    getLabelInputProps,
    status,
  } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });

  return (
    <React.Fragment>
      <TreeItem2Provider itemId={itemId}>
        <TreeItem2Root
          {...getRootProps({
            ...other,
            onMouseOver: handleMouseOver,
            onMouseLeave: handleMouseLeave,
            'data-name': 'TreeItem2Root',
          })}
        >
          <CustomTreeItem2Content
            {...getContentProps({
              'data-name': 'TreeItem2Content',
            })}
          >
            <CustomTreeItem2IconContainer
              {...getIconContainerProps({
                'data-name': 'TreeItem2IconContainer',
              })}
            >
              <TreeItem2Icon status={status} data-name="TreeItem2Icon" />
            </CustomTreeItem2IconContainer>
            <CustomTreeItem2Checkbox
              {...getCheckboxProps({
                'data-name': 'TreeItem2Checkbox',
              })}
            />
            {status?.editable ? (
              <CustomTreeItem2LabelInput
                {...getLabelInputProps({
                  'data-name': 'TreeItem2LabelInput',
                })}
              />
            ) : (
              <CustomTreeItem2Label
                {...getLabelProps({
                  'data-name': 'TreeItem2Label',
                })}
              />
            )}

            <TreeItem2DragAndDropOverlay
              {...getDragAndDropOverlayProps({
                'data-name': 'TreeItem2DragAndDropOverlay',
              })}
            />
          </CustomTreeItem2Content>
          {children && (
            <CustomTreeItem2Transition
              {...getGroupTransitionProps({
                'data-name': 'TreeItem2GroupTransition',
              })}
            />
          )}
        </TreeItem2Root>
      </TreeItem2Provider>
      <Popover
        slotProps={{
          root: {
            slotProps: {
              backdrop: { id: 'backdrop', invisible: true, sx: { display: 'none' } },
              root: { style: { width: 'fit-content', height: 'fit-content' } },
            },
          },
          paper: {
            elevation: 0,
            sx: (theme) => ({
              maxWidth: 'initial',
              maxHeight: 'initial',
              minHeight: 0,
              backgroundColor: theme.palette.primary.main,
              padding: '0 4px',
              display: 'flex',
            }),
          },
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <AnnotationText variant="caption">
          {anchorEl &&
            (anchorEl.closest('[data-name]') as HTMLElement)?.dataset.name}
        </AnnotationText>
      </Popover>
    </React.Fragment>
  );
});

export default function CustomTreeItemDemo() {
  return (
    <Box sx={{ minHeight: 120, minWidth: 350 }}>
      <RichTreeView
        defaultExpandedItems={['1']}
        items={ITEMS}
        slots={{ item: CustomTreeItem }}
        defaultSelectedItems="1.1"
        checkboxSelection
        experimentalFeatures={{ labelEditing: true }}
        isItemEditable={(item) => Boolean(item?.editable)}
      />
    </Box>
  );
}
