import * as React from 'react';

import { GridMenu, useGridSelector } from '@mui/x-data-grid-pro';
import useId from '@mui/utils/useId';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { FieldTransferObject } from './GridChartsConfigurationPanelBody';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { gridPivotModelSelector } from '../../hooks/features/pivoting/gridPivotingSelectors';
import type { DropPosition } from '../../hooks/features/pivoting/gridPivotingInterfaces';
import {
  gridChartsCategoriesSelector,
  gridChartsSeriesSelector,
} from '../../hooks/features/chartsIntegration/gridChartsIntegrationSelectors';

interface GridChartsConfigurationPanelFieldMenuProps {
  field: string;
  zone: FieldTransferObject['zone'];
}

type MenuAction = {
  key: 'up' | 'down' | 'top' | 'bottom' | 'categories' | 'series' | null;
  label: string;
  icon?: React.ReactElement;
  disabled?: boolean;
};

type MenuDivider = {
  divider: true;
};

function GridChartsConfigurationPanelFieldMenu(props: GridChartsConfigurationPanelFieldMenuProps) {
  const { field, zone } = props;
  const rootProps = useGridRootProps();
  const [open, setOpen] = React.useState(false);
  const apiRef = useGridPrivateApiContext();
  const categories = useGridSelector(apiRef, gridChartsCategoriesSelector);
  const series = useGridSelector(apiRef, gridChartsSeriesSelector);
  const isAvailableField = zone === null;
  const pivotModel = useGridSelector(apiRef, gridPivotModelSelector);
  const fieldIndexInModel = !isAvailableField
    ? (zone === 'categories' ? categories : series).findIndex((item) => item === field)
    : -1;
  const modelLength = !isAvailableField ? (zone === 'categories' ? categories : series).length : 0;
  const canMoveUp = fieldIndexInModel > 0;
  const canMoveDown = !isAvailableField && fieldIndexInModel < modelLength - 1;
  const menuId = useId();
  const triggerId = useId();
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const getMenuItems = React.useCallback((): (MenuAction | MenuDivider)[] => {
    if (isAvailableField) {
      return [
        { key: 'categories', label: 'Add to categories' },
        { key: 'series', label: 'Add to series' },
      ];
    }

    return [
      {
        key: 'up',
        label: apiRef.current.getLocaleText('pivotMenuMoveUp'),
        icon: <rootProps.slots.pivotMenuMoveUpIcon />,
        disabled: !canMoveUp,
      },
      {
        key: 'down',
        label: apiRef.current.getLocaleText('pivotMenuMoveDown'),
        icon: <rootProps.slots.pivotMenuMoveDownIcon />,
        disabled: !canMoveDown,
      },
      { divider: true },
      {
        key: 'top',
        label: apiRef.current.getLocaleText('pivotMenuMoveToTop'),
        icon: <rootProps.slots.pivotMenuMoveToTopIcon />,
        disabled: !canMoveUp,
      },
      {
        key: 'bottom',
        label: apiRef.current.getLocaleText('pivotMenuMoveToBottom'),
        icon: <rootProps.slots.pivotMenuMoveToBottomIcon />,
        disabled: !canMoveDown,
      },
      { divider: true },
      {
        key: 'categories',
        label: 'Add to categories',
        icon: zone === 'categories' ? <rootProps.slots.pivotMenuCheckIcon /> : <span />,
      },
      {
        key: 'series',
        label: 'Add to series',
        icon: zone === 'series' ? <rootProps.slots.pivotMenuCheckIcon /> : <span />,
      },
      { divider: true },
      {
        key: null,
        label: apiRef.current.getLocaleText('pivotMenuRemove'),
        icon: <rootProps.slots.pivotMenuRemoveIcon />,
      },
    ];
  }, [isAvailableField, apiRef, rootProps, canMoveUp, canMoveDown, zone]);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMove = (to: 'up' | 'down' | 'top' | 'bottom' | FieldTransferObject['zone']) => {
    handleClose();

    // Do nothing if the field is already in the target section
    if (to === zone) {
      return;
    }

    const items = zone === 'categories' ? categories : series;

    let targetField: string | undefined;
    let targetFieldPosition: DropPosition = null;
    let targetSection: FieldTransferObject['zone'] = zone;

    switch (to) {
      case 'up':
        targetField = items[fieldIndexInModel - 1];
        targetFieldPosition = 'top';
        break;
      case 'down':
        targetField = items[fieldIndexInModel + 1];
        targetFieldPosition = 'bottom';
        break;
      case 'top':
        targetField = items[0];
        targetFieldPosition = 'top';
        break;
      case 'bottom':
        targetField = items[modelLength - 1];
        targetFieldPosition = 'bottom';
        break;
      case 'categories':
      case 'series':
      case null:
        targetSection = to;
        break;
      default:
        break;
    }

    apiRef.current.chartsIntegration.updateDataReference(
      field,
      zone,
      targetSection,
      targetField,
      targetFieldPosition || undefined,
    );
  };

  return (
    <React.Fragment>
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

      <GridMenu
        target={triggerRef.current}
        open={open}
        onClose={handleClose}
        position="bottom-start"
      >
        <rootProps.slots.baseMenuList
          id={menuId}
          aria-labelledby={triggerId}
          autoFocusItem
          {...rootProps.slotProps?.baseMenuList}
        >
          {getMenuItems().map((item, index) =>
            'divider' in item ? (
              <rootProps.slots.baseDivider key={`divider-${index}`} />
            ) : (
              <rootProps.slots.baseMenuItem
                key={item.key}
                disabled={item.disabled}
                onClick={() => handleMove(item.key)}
                iconStart={item.icon}
                {...rootProps.slotProps?.baseMenuItem}
              >
                {item.label}
              </rootProps.slots.baseMenuItem>
            ),
          )}
        </rootProps.slots.baseMenuList>
      </GridMenu>
    </React.Fragment>
  );
}

export { GridChartsConfigurationPanelFieldMenu };
