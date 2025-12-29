'use client';
import * as React from 'react';

import { GridMenu, useGridSelector } from '@mui/x-data-grid-pro';
import useId from '@mui/utils/useId';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import type { FieldTransferObject, DropPosition } from './GridChartsPanelDataBody';
import { useGridPrivateApiContext } from '../../../hooks/utils/useGridPrivateApiContext';
import {
  gridChartsDimensionsSelector,
  gridChartsIntegrationActiveChartIdSelector,
  gridChartsValuesSelector,
} from '../../../hooks/features/chartsIntegration/gridChartsIntegrationSelectors';
import type { GridChartsIntegrationSection } from '../../../hooks/features/chartsIntegration/gridChartsIntegrationInterfaces';

interface GridChartsPanelDataFieldMenuProps {
  field: string;
  section: FieldTransferObject['section'];
  blockedSections?: string[];
  dimensionsLabel: string;
  valuesLabel: string;
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
  const { field, section, blockedSections, dimensionsLabel, valuesLabel } = props;
  const { slots, slotProps } = useGridRootProps();
  const [open, setOpen] = React.useState(false);
  const apiRef = useGridPrivateApiContext();
  const activeChartId = useGridSelector(apiRef, gridChartsIntegrationActiveChartIdSelector);
  const dimensions = useGridSelector(apiRef, gridChartsDimensionsSelector, activeChartId);
  const values = useGridSelector(apiRef, gridChartsValuesSelector, activeChartId);
  const isAvailableField = section === null;
  const fieldIndexInModel = !isAvailableField
    ? (section === 'dimensions' ? dimensions : values).findIndex((item) => item.field === field)
    : -1;
  const modelLength = !isAvailableField
    ? (section === 'dimensions' ? dimensions : values).length
    : 0;
  const canMoveUp = fieldIndexInModel > 0;
  const canMoveDown = !isAvailableField && fieldIndexInModel < modelLength - 1;
  const menuId = useId();
  const triggerId = useId();
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const menuItems = React.useMemo((): (MenuAction | MenuDivider)[] => {
    if (isAvailableField) {
      return [
        {
          key: 'dimensions',
          label: apiRef.current.getLocaleText('chartsMenuAddToDimensions')(dimensionsLabel),
        },
        {
          key: 'values',
          label: apiRef.current.getLocaleText('chartsMenuAddToValues')(valuesLabel),
        },
      ].filter((item) => !blockedSections?.includes(item.key)) as MenuAction[];
    }

    const moveMenuItems: (MenuAction | MenuDivider)[] = [
      {
        key: 'up',
        label: apiRef.current.getLocaleText('chartsMenuMoveUp'),
        icon: <slots.chartsMenuMoveUpIcon />,
        disabled: !canMoveUp,
      },
      {
        key: 'down',
        label: apiRef.current.getLocaleText('chartsMenuMoveDown'),
        icon: <slots.chartsMenuMoveDownIcon />,
        disabled: !canMoveDown,
      },
      { divider: true },
      {
        key: 'top',
        label: apiRef.current.getLocaleText('chartsMenuMoveToTop'),
        icon: <slots.chartsMenuMoveToTopIcon />,
        disabled: !canMoveUp,
      },
      {
        key: 'bottom',
        label: apiRef.current.getLocaleText('chartsMenuMoveToBottom'),
        icon: <slots.chartsMenuMoveToBottomIcon />,
        disabled: !canMoveDown,
      },
      { divider: true },
    ];

    const removeMenuItem = [
      {
        key: null,
        label: apiRef.current.getLocaleText('chartsMenuRemove'),
        icon: <slots.chartsMenuRemoveIcon />,
      },
    ];

    const addToSectionMenuItems: (MenuAction | MenuDivider)[] = [
      {
        key: 'dimensions',
        label: apiRef.current.getLocaleText('chartsMenuAddToDimensions')(dimensionsLabel),
        icon: <span />,
      },
      {
        key: 'values',
        label: apiRef.current.getLocaleText('chartsMenuAddToValues')(valuesLabel),
        icon: <span />,
      },
    ].filter(
      (item) => item.key !== section && !blockedSections?.includes(item.key),
    ) as MenuAction[];

    if (addToSectionMenuItems.length > 0) {
      addToSectionMenuItems.push({ divider: true });
    }

    return [...moveMenuItems, ...addToSectionMenuItems, ...removeMenuItem];
  }, [
    isAvailableField,
    apiRef,
    slots,
    canMoveUp,
    canMoveDown,
    section,
    blockedSections,
    dimensionsLabel,
    valuesLabel,
  ]);

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

    const items = section === 'dimensions' ? dimensions : values;

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
      case 'dimensions':
      case 'values':
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
      <slots.baseIconButton
        size="small"
        {...slotProps?.baseIconButton}
        id={triggerId}
        aria-haspopup="true"
        aria-controls={open ? menuId : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-label={apiRef.current.getLocaleText('chartsMenuOptions')}
        onClick={handleClick}
        ref={triggerRef}
      >
        {isAvailableField ? (
          <slots.chartsMenuAddIcon fontSize="small" />
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
          {menuItems.map((item, index) =>
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

export { GridChartsPanelDataFieldMenu };
