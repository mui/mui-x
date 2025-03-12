import * as React from 'react';

import { GridMenu, useGridSelector } from '@mui/x-data-grid-pro';
import useId from '@mui/utils/useId';
import { GridPivotModel } from '../../hooks/features/pivoting/gridPivotingInterfaces';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { DropPosition, FieldTransferObject, UpdatePivotModel } from './GridPivotPanelBody';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { gridPivotModelSelector } from '../../hooks/features/pivoting/gridPivotingSelectors';

function GridPivotFieldMenu(props: {
  field: string;
  modelKey: FieldTransferObject['modelKey'];
  pivotModel: GridPivotModel;
  updatePivotModel: UpdatePivotModel;
}) {
  const { field, modelKey, updatePivotModel } = props;
  const rootProps = useGridRootProps();
  const [open, setOpen] = React.useState(false);
  const apiRef = useGridApiContext();
  const isAvailableField = modelKey === null;
  const pivotModel = useGridSelector(apiRef, gridPivotModelSelector);
  const fieldIndexInModel = !isAvailableField
    ? pivotModel[modelKey].findIndex((item) => item.field === field)
    : -1;
  const modelLength = !isAvailableField ? pivotModel[modelKey].length : 0;
  const canMoveUp = fieldIndexInModel > 0;
  const canMoveDown = !isAvailableField && fieldIndexInModel < modelLength - 1;
  const menuId = useId();
  const triggerId = useId();
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
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
    id: menuId,
    target: triggerRef.current,
    open,
    onClose: handleClose,
    position: 'bottom-start',
  } as const;

  return (
    <div>
      <rootProps.slots.baseIconButton
        size="small"
        {...rootProps.slotProps?.baseIconButton}
        id={triggerId}
        aria-haspopup="true"
        aria-controls={open ? menuId : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-label={apiRef.current.getLocaleText('pivotMenuOptions')}
        onClick={handleClick}
        ref={triggerRef}
      >
        {isAvailableField ? (
          <rootProps.slots.pivotMenuAddIcon fontSize="small" />
        ) : (
          <rootProps.slots.columnMenuIcon fontSize="small" />
        )}
      </rootProps.slots.baseIconButton>

      {isAvailableField ? (
        <GridMenu {...menuProps}>
          <rootProps.slots.baseMenuList
            id={menuId}
            aria-labelledby={triggerId}
            autoFocusItem
            {...rootProps.slotProps?.baseMenuList}
          >
            <rootProps.slots.baseMenuItem
              onClick={() => handleMove('rows')}
              {...rootProps.slotProps?.baseMenuItem}
            >
              {apiRef.current.getLocaleText('pivotMenuAddToRows')}
            </rootProps.slots.baseMenuItem>
            <rootProps.slots.baseMenuItem
              onClick={() => handleMove('columns')}
              {...rootProps.slotProps?.baseMenuItem}
            >
              {apiRef.current.getLocaleText('pivotMenuAddToColumns')}
            </rootProps.slots.baseMenuItem>
            <rootProps.slots.baseMenuItem
              onClick={() => handleMove('values')}
              {...rootProps.slotProps?.baseMenuItem}
            >
              {apiRef.current.getLocaleText('pivotMenuAddToValues')}
            </rootProps.slots.baseMenuItem>
          </rootProps.slots.baseMenuList>
        </GridMenu>
      ) : (
        <GridMenu {...menuProps}>
          <rootProps.slots.baseMenuList
            id={menuId}
            aria-labelledby={triggerId}
            autoFocusItem
            {...rootProps.slotProps?.baseMenuList}
          >
            <rootProps.slots.baseMenuItem
              disabled={!canMoveUp}
              onClick={() => handleMove('up')}
              iconStart={<rootProps.slots.pivotMenuMoveUpIcon />}
              {...rootProps.slotProps?.baseMenuItem}
            >
              {apiRef.current.getLocaleText('pivotMenuMoveUp')}
            </rootProps.slots.baseMenuItem>
            <rootProps.slots.baseMenuItem
              disabled={!canMoveDown}
              onClick={() => handleMove('down')}
              iconStart={<rootProps.slots.pivotMenuMoveDownIcon />}
              {...rootProps.slotProps?.baseMenuItem}
            >
              {apiRef.current.getLocaleText('pivotMenuMoveDown')}
            </rootProps.slots.baseMenuItem>
            <rootProps.slots.baseDivider />
            <rootProps.slots.baseMenuItem
              disabled={!canMoveUp}
              onClick={() => handleMove('top')}
              iconStart={<rootProps.slots.pivotMenuMoveToTopIcon />}
              {...rootProps.slotProps?.baseMenuItem}
            >
              {apiRef.current.getLocaleText('pivotMenuMoveToTop')}
            </rootProps.slots.baseMenuItem>
            <rootProps.slots.baseMenuItem
              disabled={!canMoveDown}
              onClick={() => handleMove('bottom')}
              iconStart={<rootProps.slots.pivotMenuMoveToBottomIcon />}
              {...rootProps.slotProps?.baseMenuItem}
            >
              {apiRef.current.getLocaleText('pivotMenuMoveToBottom')}
            </rootProps.slots.baseMenuItem>
            <rootProps.slots.baseDivider />
            <rootProps.slots.baseMenuItem
              onClick={() => handleMove('rows')}
              iconStart={modelKey === 'rows' ? <rootProps.slots.pivotMenuCheckIcon /> : <span />}
              {...rootProps.slotProps?.baseMenuItem}
            >
              {apiRef.current.getLocaleText('pivotMenuRows')}
            </rootProps.slots.baseMenuItem>
            <rootProps.slots.baseMenuItem
              onClick={() => handleMove('columns')}
              iconStart={modelKey === 'columns' ? <rootProps.slots.pivotMenuCheckIcon /> : <span />}
              {...rootProps.slotProps?.baseMenuItem}
            >
              {apiRef.current.getLocaleText('pivotMenuColumns')}
            </rootProps.slots.baseMenuItem>
            <rootProps.slots.baseMenuItem
              onClick={() => handleMove('values')}
              iconStart={modelKey === 'values' ? <rootProps.slots.pivotMenuCheckIcon /> : <span />}
              {...rootProps.slotProps?.baseMenuItem}
            >
              {apiRef.current.getLocaleText('pivotMenuValues')}
            </rootProps.slots.baseMenuItem>
            <rootProps.slots.baseDivider />
            <rootProps.slots.baseMenuItem
              onClick={() => handleMove(null)}
              iconStart={<rootProps.slots.pivotMenuRemoveIcon />}
              {...rootProps.slotProps?.baseMenuItem}
            >
              {apiRef.current.getLocaleText('pivotMenuRemove')}
            </rootProps.slots.baseMenuItem>
          </rootProps.slots.baseMenuList>
        </GridMenu>
      )}
    </div>
  );
}

export { GridPivotFieldMenu };
