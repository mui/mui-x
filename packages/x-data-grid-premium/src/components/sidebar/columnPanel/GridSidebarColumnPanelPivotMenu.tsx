import * as React from 'react';
import Menu from '@mui/material/Menu';

import { useGridSelector } from '@mui/x-data-grid-pro';
import { GridPivotModel } from '../../../hooks/features/pivoting/gridPivotingInterfaces';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import type {
  DropPosition,
  FieldTransferObject,
  UpdatePivotModel,
} from './GridSidebarColumnPanelBody';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { gridPivotModelSelector } from '../../../hooks/features/pivoting/gridPivotingSelectors';

export function GridSidebarColumnPanelPivotMenu(props: {
  field: string;
  modelKey: FieldTransferObject['modelKey'];
  pivotModel: GridPivotModel;
  updatePivotModel: UpdatePivotModel;
}) {
  const { field, modelKey, updatePivotModel } = props;
  const rootProps = useGridRootProps();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const apiRef = useGridApiContext();
  const isAvailableField = modelKey === null;
  const pivotModel = useGridSelector(apiRef, gridPivotModelSelector);
  const fieldIndexInModel = !isAvailableField
    ? pivotModel[modelKey].findIndex((item) => item.field === field)
    : -1;
  const modelLength = !isAvailableField ? pivotModel[modelKey].length : 0;
  const canMoveUp = fieldIndexInModel > 0;
  const canMoveDown = !isAvailableField && fieldIndexInModel < modelLength - 1;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMove = (to: 'up' | 'down' | 'top' | 'bottom' | FieldTransferObject['modelKey']) => {
    handleClose();

    // Do nothing if the field is already in the target section
    if (to === modelKey) {
      return;
    }

    let targetField: string | undefined;
    let targetFieldPosition: DropPosition = null;
    let targetSection: FieldTransferObject['modelKey'] = modelKey;

    switch (to) {
      case 'up':
        targetField = pivotModel[modelKey!][fieldIndexInModel - 1].field;
        targetFieldPosition = 'top';
        break;
      case 'down':
        targetField = pivotModel[modelKey!][fieldIndexInModel + 1].field;
        targetFieldPosition = 'bottom';
        break;
      case 'top':
        targetField = pivotModel[modelKey!][0].field;
        targetFieldPosition = 'top';
        break;
      case 'bottom':
        targetField = pivotModel[modelKey!][modelLength - 1].field;
        targetFieldPosition = 'bottom';
        break;
      case 'rows':
      case 'columns':
      case 'values':
      case null:
        targetSection = to;
        break;
      default:
        break;
    }

    updatePivotModel({
      field,
      targetField,
      targetFieldPosition,
      targetSection,
      originSection: modelKey,
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
        aria-label={apiRef.current.getLocaleText('pivotMenuOptions')}
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
          <rootProps.slots.baseMenuItem onClick={() => handleMove('rows')}>
            {apiRef.current.getLocaleText('pivotMenuAddToRows')}
          </rootProps.slots.baseMenuItem>
          <rootProps.slots.baseMenuItem onClick={() => handleMove('columns')}>
            {apiRef.current.getLocaleText('pivotMenuAddToColumns')}
          </rootProps.slots.baseMenuItem>
          <rootProps.slots.baseMenuItem onClick={() => handleMove('values')}>
            {apiRef.current.getLocaleText('pivotMenuAddToValues')}
          </rootProps.slots.baseMenuItem>
        </Menu>
      ) : (
        <Menu {...menuProps}>
          <rootProps.slots.baseMenuItem
            disabled={!canMoveUp}
            onClick={() => handleMove('up')}
            iconStart={<rootProps.slots.pivotMenuMoveUpIcon />}
          >
            {apiRef.current.getLocaleText('pivotMenuMoveUp')}
          </rootProps.slots.baseMenuItem>
          <rootProps.slots.baseMenuItem
            disabled={!canMoveDown}
            onClick={() => handleMove('down')}
            iconStart={<rootProps.slots.pivotMenuMoveDownIcon />}
          >
            {apiRef.current.getLocaleText('pivotMenuMoveDown')}
          </rootProps.slots.baseMenuItem>
          <rootProps.slots.baseDivider />
          <rootProps.slots.baseMenuItem
            disabled={!canMoveUp}
            onClick={() => handleMove('top')}
            iconStart={<rootProps.slots.pivotMenuMoveToTopIcon />}
          >
            {apiRef.current.getLocaleText('pivotMenuMoveToTop')}
          </rootProps.slots.baseMenuItem>
          <rootProps.slots.baseMenuItem
            disabled={!canMoveDown}
            onClick={() => handleMove('bottom')}
            iconStart={<rootProps.slots.pivotMenuMoveToBottomIcon />}
          >
            {apiRef.current.getLocaleText('pivotMenuMoveToBottom')}
          </rootProps.slots.baseMenuItem>
          <rootProps.slots.baseDivider />
          <rootProps.slots.baseMenuItem
            onClick={() => handleMove('rows')}
            iconStart={modelKey === 'rows' ? <rootProps.slots.pivotMenuCheckIcon /> : <span />}
          >
            {apiRef.current.getLocaleText('pivotMenuRows')}
          </rootProps.slots.baseMenuItem>
          <rootProps.slots.baseMenuItem
            onClick={() => handleMove('columns')}
            iconStart={modelKey === 'columns' ? <rootProps.slots.pivotMenuCheckIcon /> : <span />}
          >
            {apiRef.current.getLocaleText('pivotMenuColumns')}
          </rootProps.slots.baseMenuItem>
          <rootProps.slots.baseMenuItem
            onClick={() => handleMove('values')}
            iconStart={modelKey === 'values' ? <rootProps.slots.pivotMenuCheckIcon /> : <span />}
          >
            {apiRef.current.getLocaleText('pivotMenuValues')}
          </rootProps.slots.baseMenuItem>
          <rootProps.slots.baseDivider />
          <rootProps.slots.baseMenuItem
            onClick={() => handleMove(null)}
            iconStart={<rootProps.slots.pivotMenuRemoveIcon />}
          >
            {apiRef.current.getLocaleText('pivotMenuRemove')}
          </rootProps.slots.baseMenuItem>
        </Menu>
      )}
    </div>
  );
}
