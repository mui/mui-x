'use client';
import * as React from 'react';

import { GridMenu, useGridSelector } from '@mui/x-data-grid-pro';
import useId from '@mui/utils/useId';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { FieldTransferObject } from './GridPivotPanelBody';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { gridPivotModelSelector } from '../../hooks/features/pivoting/gridPivotingSelectors';
import type { DropPosition } from '../../hooks/features/pivoting/gridPivotingInterfaces';

interface GridPivotPanelFieldMenuProps {
  field: string;
  modelKey: FieldTransferObject['modelKey'];
}

type MenuAction = {
  key: 'up' | 'down' | 'top' | 'bottom' | 'rows' | 'columns' | 'values' | null;
  label: string;
  icon?: React.ReactElement;
  disabled?: boolean;
};

type MenuDivider = {
  divider: true;
};

function GridPivotPanelFieldMenu(props: GridPivotPanelFieldMenuProps) {
  const { field, modelKey } = props;
  const { slots, slotProps } = useGridRootProps();
  const [open, setOpen] = React.useState(false);
  const apiRef = useGridPrivateApiContext();
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

  const getMenuItems = React.useCallback((): (MenuAction | MenuDivider)[] => {
    if (isAvailableField) {
      return [
        { key: 'rows', label: apiRef.current.getLocaleText('pivotMenuAddToRows') },
        { key: 'columns', label: apiRef.current.getLocaleText('pivotMenuAddToColumns') },
        { key: 'values', label: apiRef.current.getLocaleText('pivotMenuAddToValues') },
      ];
    }

    return [
      {
        key: 'up',
        label: apiRef.current.getLocaleText('pivotMenuMoveUp'),
        icon: <slots.pivotMenuMoveUpIcon />,
        disabled: !canMoveUp,
      },
      {
        key: 'down',
        label: apiRef.current.getLocaleText('pivotMenuMoveDown'),
        icon: <slots.pivotMenuMoveDownIcon />,
        disabled: !canMoveDown,
      },
      { divider: true },
      {
        key: 'top',
        label: apiRef.current.getLocaleText('pivotMenuMoveToTop'),
        icon: <slots.pivotMenuMoveToTopIcon />,
        disabled: !canMoveUp,
      },
      {
        key: 'bottom',
        label: apiRef.current.getLocaleText('pivotMenuMoveToBottom'),
        icon: <slots.pivotMenuMoveToBottomIcon />,
        disabled: !canMoveDown,
      },
      { divider: true },
      {
        key: 'rows',
        label: apiRef.current.getLocaleText('pivotMenuRows'),
        icon: modelKey === 'rows' ? <slots.pivotMenuCheckIcon /> : <span />,
      },
      {
        key: 'columns',
        label: apiRef.current.getLocaleText('pivotMenuColumns'),
        icon: modelKey === 'columns' ? <slots.pivotMenuCheckIcon /> : <span />,
      },
      {
        key: 'values',
        label: apiRef.current.getLocaleText('pivotMenuValues'),
        icon: modelKey === 'values' ? <slots.pivotMenuCheckIcon /> : <span />,
      },
      { divider: true },
      {
        key: null,
        label: apiRef.current.getLocaleText('pivotMenuRemove'),
        icon: <slots.pivotMenuRemoveIcon />,
      },
    ];
  }, [isAvailableField, apiRef, slots, canMoveUp, canMoveDown, modelKey]);

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

    apiRef.current.updatePivotModel({
      field,
      targetField,
      targetFieldPosition,
      targetSection,
      originSection: modelKey,
    });
  };

  return (
    <React.Fragment>
      <slots.baseIconButton
        size="small"
        {...slotProps?.baseIconButton}
        id={triggerId}
        aria-haspopup="true"
        aria-controls={open ? menuId : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-label={apiRef.current.getLocaleText('pivotMenuOptions')}
        onClick={handleClick}
        ref={triggerRef}
      >
        {isAvailableField ? (
          <slots.pivotMenuAddIcon fontSize="small" />
        ) : (
          <slots.columnMenuIcon fontSize="small" />
        )}
      </slots.baseIconButton>

      <GridMenu
        target={triggerRef.current}
        open={open}
        onClose={handleClose}
        position="bottom-start"
      >
        <slots.baseMenuList
          id={menuId}
          aria-labelledby={triggerId}
          autoFocusItem
          {...slotProps?.baseMenuList}
        >
          {getMenuItems().map((item, index) =>
            'divider' in item ? (
              <slots.baseDivider key={`divider-${index}`} />
            ) : (
              <slots.baseMenuItem
                key={item.key}
                disabled={item.disabled}
                onClick={() => handleMove(item.key)}
                iconStart={item.icon}
                {...slotProps?.baseMenuItem}
              >
                {item.label}
              </slots.baseMenuItem>
            ),
          )}
        </slots.baseMenuList>
      </GridMenu>
    </React.Fragment>
  );
}

export { GridPivotPanelFieldMenu };
