'use client';
import * as React from 'react';

import { GridMenu, useGridSelector } from '@mui/x-data-grid-pro';
import useId from '@mui/utils/useId';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import type { FieldTransferObject, DropPosition } from './GridChartsPanelDataBody';
import { useGridPrivateApiContext } from '../../../hooks/utils/useGridPrivateApiContext';
import {
  gridChartsCategoriesSelector,
  gridChartsIntegrationActiveChartIdSelector,
  gridChartsSeriesSelector,
} from '../../../hooks/features/chartsIntegration/gridChartsIntegrationSelectors';
import type { GridChartsIntegrationSection } from '../../../hooks/features/chartsIntegration/gridChartsIntegrationInterfaces';

interface GridChartsPanelDataFieldMenuProps {
  field: string;
  section: FieldTransferObject['section'];
  blockedSections?: string[];
}

type MenuAction = {
  key: 'up' | 'down' | 'top' | 'bottom' | GridChartsIntegrationSection;
  label: string;
  icon?: React.ReactElement;
  disabled?: boolean;
};

type MenuDivider = {
  divider: true;
};

function GridChartsPanelDataFieldMenu(props: GridChartsPanelDataFieldMenuProps) {
  const { field, section, blockedSections } = props;
  const rootProps = useGridRootProps();
  const [open, setOpen] = React.useState(false);
  const apiRef = useGridPrivateApiContext();
  const activeChartId = useGridSelector(apiRef, gridChartsIntegrationActiveChartIdSelector);
  const categories = useGridSelector(apiRef, gridChartsCategoriesSelector, activeChartId);
  const series = useGridSelector(apiRef, gridChartsSeriesSelector, activeChartId);
  const isAvailableField = section === null;
  const fieldIndexInModel = !isAvailableField
    ? (section === 'categories' ? categories : series).findIndex((item) => item.field === field)
    : -1;
  const modelLength = !isAvailableField
    ? (section === 'categories' ? categories : series).length
    : 0;
  const canMoveUp = fieldIndexInModel > 0;
  const canMoveDown = !isAvailableField && fieldIndexInModel < modelLength - 1;
  const menuId = useId();
  const triggerId = useId();
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const menuItems = React.useMemo((): (MenuAction | MenuDivider)[] => {
    if (isAvailableField) {
      return [
        { key: 'categories', label: apiRef.current.getLocaleText('chartsMenuAddToCategories') },
        { key: 'series', label: apiRef.current.getLocaleText('chartsMenuAddToSeries') },
      ].filter((item) => !blockedSections?.includes(item.key)) as MenuAction[];
    }

    const moveMenuItems: (MenuAction | MenuDivider)[] = [
      {
        key: 'up',
        label: apiRef.current.getLocaleText('chartsMenuMoveUp'),
        icon: <rootProps.slots.chartsMenuMoveUpIcon />,
        disabled: !canMoveUp,
      },
      {
        key: 'down',
        label: apiRef.current.getLocaleText('chartsMenuMoveDown'),
        icon: <rootProps.slots.chartsMenuMoveDownIcon />,
        disabled: !canMoveDown,
      },
      { divider: true },
      {
        key: 'top',
        label: apiRef.current.getLocaleText('chartsMenuMoveToTop'),
        icon: <rootProps.slots.chartsMenuMoveToTopIcon />,
        disabled: !canMoveUp,
      },
      {
        key: 'bottom',
        label: apiRef.current.getLocaleText('chartsMenuMoveToBottom'),
        icon: <rootProps.slots.chartsMenuMoveToBottomIcon />,
        disabled: !canMoveDown,
      },
      { divider: true },
    ];

    const removeMenuItem = [
      {
        key: null,
        label: apiRef.current.getLocaleText('chartsMenuRemove'),
        icon: <rootProps.slots.chartsMenuRemoveIcon />,
      },
    ];

    const addToSectionMenuItems: (MenuAction | MenuDivider)[] = [
      {
        key: 'categories',
        label: apiRef.current.getLocaleText('chartsMenuAddToCategories'),
        icon: <span />,
      },
      {
        key: 'series',
        label: apiRef.current.getLocaleText('chartsMenuAddToSeries'),
        icon: <span />,
      },
    ].filter(
      (item) => item.key !== section && !blockedSections?.includes(item.key),
    ) as MenuAction[];

    if (addToSectionMenuItems.length > 0) {
      addToSectionMenuItems.push({ divider: true });
    }

    return [...moveMenuItems, ...addToSectionMenuItems, ...removeMenuItem];
  }, [isAvailableField, apiRef, rootProps, canMoveUp, canMoveDown, section, blockedSections]);

  if (menuItems.length === 0) {
    return null;
  }

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMove = (to: 'up' | 'down' | 'top' | 'bottom' | FieldTransferObject['section']) => {
    handleClose();

    // Do nothing if the field is already in the target section
    if (to === section) {
      return;
    }

    const items = section === 'categories' ? categories : series;

    let targetField: string | undefined;
    let targetFieldPosition: DropPosition = null;
    let targetSection: FieldTransferObject['section'] = section;

    switch (to) {
      case 'up':
        targetField = items[fieldIndexInModel - 1].field;
        targetFieldPosition = 'top';
        break;
      case 'down':
        targetField = items[fieldIndexInModel + 1].field;
        targetFieldPosition = 'bottom';
        break;
      case 'top':
        targetField = items[0].field;
        targetFieldPosition = 'top';
        break;
      case 'bottom':
        targetField = items[modelLength - 1].field;
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
      section,
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
        aria-label={apiRef.current.getLocaleText('chartsMenuOptions')}
        onClick={handleClick}
        ref={triggerRef}
      >
        {isAvailableField ? (
          <rootProps.slots.chartsMenuAddIcon fontSize="small" />
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
          {menuItems.map((item, index) =>
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

export { GridChartsPanelDataFieldMenu };
