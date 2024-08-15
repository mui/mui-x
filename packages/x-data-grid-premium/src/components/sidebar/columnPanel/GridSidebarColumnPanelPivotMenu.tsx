import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import { PivotModel } from '../../../hooks/features/pivoting/useGridPivoting';
import { useGridRootProps } from '../../../typeOverloads/reexports';
import type {
  DropPosition,
  FieldTransferObject,
  UpdatePivotModel,
} from './GridSidebarColumnPanelBody';

export function GridSidebarColumnPanelPivotMenu(props: {
  field: string;
  modelKey: FieldTransferObject['modelKey'];
  pivotModel: PivotModel;
  updatePivotModel: UpdatePivotModel;
}) {
  const { field, modelKey, updatePivotModel } = props;
  const rootProps = useGridRootProps();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const isAvailableField = modelKey === null;
  const fieldIndexInModel = !isAvailableField
    ? props.pivotModel[modelKey].findIndex((item) => item.field === field)
    : -1;
  const modelLength = !isAvailableField ? props.pivotModel[modelKey].length : 0;
  const canMoveUp = fieldIndexInModel > 0;
  const canMoveDown = !isAvailableField && fieldIndexInModel < modelLength - 1;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMove = (direction: 'up' | 'down' | 'top' | 'bottom') => {
    handleClose();

    let targetField: string | undefined;
    let targetFieldPosition: DropPosition;

    switch (direction) {
      case 'up':
        targetField = props.pivotModel[modelKey!][fieldIndexInModel - 1].field;
        targetFieldPosition = 'top';
        break;
      case 'down':
        targetField = props.pivotModel[modelKey!][fieldIndexInModel + 1].field;
        targetFieldPosition = 'bottom';
        break;
      case 'top':
        targetField = props.pivotModel[modelKey!][0].field;
        targetFieldPosition = 'top';
        break;
      case 'bottom':
        targetField = props.pivotModel[modelKey!][modelLength - 1].field;
        targetFieldPosition = 'bottom';
        break;
      default:
        targetField = undefined;
        targetFieldPosition = null;
        break;
    }

    updatePivotModel({
      field,
      targetField,
      targetFieldPosition,
      targetSection: modelKey,
      originSection: modelKey,
    });
  };

  const handleMoveSection = (section: FieldTransferObject['modelKey']) => {
    handleClose();

    if (section === modelKey) {
      return;
    }

    updatePivotModel({
      field,
      targetSection: section,
      originSection: modelKey!,
    });
  };

  const menuProps = {
    id: 'pivot-menu',
    anchorEl,
    open,
    onClose: handleClose,
    MenuListProps: {
      'aria-labelledby': 'pivot-menu-button',
    },
  };

  return (
    <div>
      <rootProps.slots.baseIconButton
        size="small"
        {...rootProps.slotProps?.baseIconButton}
        id="pivot-menu-button"
        aria-controls={open ? 'pivot-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {isAvailableField ? (
          <rootProps.slots.pivotMenuAddIcon fontSize="small" />
        ) : (
          <rootProps.slots.columnMenuIcon fontSize="small" />
        )}
      </rootProps.slots.baseIconButton>

      {isAvailableField ? (
        <Menu {...menuProps}>
          <MenuItem dense onClick={() => handleMoveSection('rows')}>
            Add to Rows
          </MenuItem>
          <MenuItem dense onClick={() => handleMoveSection('columns')}>
            Add to Columns
          </MenuItem>
          <MenuItem dense onClick={() => handleMoveSection('values')}>
            Add to Values
          </MenuItem>
        </Menu>
      ) : (
        <Menu {...menuProps}>
          <MenuItem dense disabled={!canMoveUp} onClick={() => handleMove('up')}>
            <ListItemIcon>
              <rootProps.slots.pivotMenuMoveUpIcon />
            </ListItemIcon>
            <ListItemText>Move up</ListItemText>
          </MenuItem>
          <MenuItem dense disabled={!canMoveDown} onClick={() => handleMove('down')}>
            <ListItemIcon>
              <rootProps.slots.pivotMenuMoveDownIcon />
            </ListItemIcon>
            <ListItemText>Move down</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem dense disabled={!canMoveUp} onClick={() => handleMove('top')}>
            <ListItemIcon>
              <rootProps.slots.pivotMenuMoveToTopIcon />
            </ListItemIcon>
            <ListItemText>Move to top</ListItemText>
          </MenuItem>
          <MenuItem dense disabled={!canMoveDown} onClick={() => handleMove('bottom')}>
            <ListItemIcon>
              <rootProps.slots.pivotMenuMoveToBottomIcon />
            </ListItemIcon>
            <ListItemText>Move to bottom</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem dense onClick={() => handleMoveSection('rows')}>
            <ListItemIcon>
              {modelKey === 'rows' ? <rootProps.slots.pivotMenuCheckIcon /> : null}
            </ListItemIcon>
            <ListItemText>Rows</ListItemText>
          </MenuItem>
          <MenuItem dense onClick={() => handleMoveSection('columns')}>
            <ListItemIcon>
              {modelKey === 'columns' ? <rootProps.slots.pivotMenuCheckIcon /> : null}
            </ListItemIcon>
            <ListItemText>Columns</ListItemText>
          </MenuItem>
          <MenuItem dense onClick={() => handleMoveSection('values')}>
            <ListItemIcon>
              {modelKey === 'values' ? <rootProps.slots.pivotMenuCheckIcon /> : null}
            </ListItemIcon>
            <ListItemText>Values</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem dense onClick={() => handleMoveSection(null)}>
            <ListItemIcon>
              <rootProps.slots.pivotMenuRemoveIcon />
            </ListItemIcon>
            <ListItemText>Remove</ListItemText>
          </MenuItem>
        </Menu>
      )}
    </div>
  );
}
