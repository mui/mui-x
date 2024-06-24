import * as React from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ViewInArOutlinedIcon from '@mui/icons-material/ViewInArOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import {
  unstable_useTreeItem2 as useTreeItem2,
  UseTreeItem2Parameters,
  UseTreeItem2ContentSlotOwnProps,
} from '@mui/x-tree-view/useTreeItem2';
import {
  TreeItem2Content,
  TreeItem2IconContainer,
  TreeItem2Label,
  TreeItem2Root,
  TreeItem2GroupTransition,
} from '@mui/x-tree-view/TreeItem2';
import { TreeItem2Icon } from '@mui/x-tree-view/TreeItem2Icon';
import { TreeItem2Provider } from '@mui/x-tree-view/TreeItem2Provider';
import { useTreeItem2Utils } from '@mui/x-tree-view/hooks';
import { ThreeDItem } from './SceneObjects';

interface CustomTreeItemProps extends Omit<UseTreeItem2Parameters, 'rootRef'> {
  toggleVisibility: (itemId: string) => void;
  sceneObjects: ThreeDItem[];
}

export const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: CustomTreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const { id, itemId, label, children, sceneObjects, toggleVisibility, ...other } =
    props;

  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getLabelProps,
    getGroupTransitionProps,
    status,
    publicAPI,
  } = useTreeItem2({ id, itemId, children, label, rootRef: ref });

  const { interactions } = useTreeItem2Utils({
    itemId: props.itemId,
    children: props.children,
  });

  const item = publicAPI.getItem(itemId);

  const handleVisibilityIconClick = (
    event: React.MouseEvent & { defaultMuiPrevented?: boolean },
  ) => {
    event.defaultMuiPrevented = true;
    toggleVisibility(itemId);
  };

  const handleContentClick: UseTreeItem2ContentSlotOwnProps['onClick'] = (event) => {
    if (event.defaultMuiPrevented) {
      return;
    }

    event.defaultMuiPrevented = true;
    interactions.handleSelection(event);
  };

  const handleIconContainerClick = (event: React.MouseEvent) => {
    interactions.handleExpansion(event);
  };

  let itemIcon: React.ReactNode;
  switch (item.type) {
    case 'mesh':
      itemIcon = <ViewInArOutlinedIcon style={{ color: 'darkolivegreen' }} />;
      break;
    case 'light':
      itemIcon = <LightbulbOutlinedIcon style={{ color: 'yellow' }} />;
      break;
    case 'collection':
      itemIcon = <FolderOutlinedIcon style={{ color: 'gray' }} />;
      break;
    default:
      itemIcon = null;
  }

  return (
    <TreeItem2Provider itemId={itemId}>
      <TreeItem2Root {...getRootProps(other)}>
        <TreeItem2Content
          {...getContentProps({
            onClick: handleContentClick,
            sx: { gap: '12px' },
          })}
        >
          <TreeItem2IconContainer
            {...getIconContainerProps({ onClick: handleIconContainerClick })}
          >
            <TreeItem2Icon status={status} />
          </TreeItem2IconContainer>
          <TreeItem2IconContainer onClick={handleVisibilityIconClick}>
            {item.visibility ? (
              <VisibilityIcon color="primary" />
            ) : (
              <VisibilityOffIcon sx={{ color: '#555' }} />
            )}
          </TreeItem2IconContainer>
          {itemIcon}
          <TreeItem2Label
            {...getLabelProps({
              sx: {
                opacity: item.visibility ? 1 : 0.5,
              },
            })}
          />
        </TreeItem2Content>
        {children && <TreeItem2GroupTransition {...getGroupTransitionProps()} />}
      </TreeItem2Root>
    </TreeItem2Provider>
  );
});
