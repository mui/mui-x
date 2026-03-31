'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { GridMenu, useGridSelector } from '@mui/x-data-grid-pro';
import useId from '@mui/utils/useId';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { useGridPrivateApiContext } from '../../../hooks/utils/useGridPrivateApiContext';
import { gridChartsDimensionsSelector, gridChartsIntegrationActiveChartIdSelector, gridChartsValuesSelector, } from '../../../hooks/features/chartsIntegration/gridChartsIntegrationSelectors';
function GridChartsPanelDataFieldMenu(props) {
    const { field, section, blockedSections, dimensionsLabel, valuesLabel } = props;
    const rootProps = useGridRootProps();
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
    const triggerRef = React.useRef(null);
    const menuItems = React.useMemo(() => {
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
            ].filter((item) => !blockedSections?.includes(item.key));
        }
        const moveMenuItems = [
            {
                key: 'up',
                label: apiRef.current.getLocaleText('chartsMenuMoveUp'),
                icon: _jsx(rootProps.slots.chartsMenuMoveUpIcon, {}),
                disabled: !canMoveUp,
            },
            {
                key: 'down',
                label: apiRef.current.getLocaleText('chartsMenuMoveDown'),
                icon: _jsx(rootProps.slots.chartsMenuMoveDownIcon, {}),
                disabled: !canMoveDown,
            },
            { divider: true },
            {
                key: 'top',
                label: apiRef.current.getLocaleText('chartsMenuMoveToTop'),
                icon: _jsx(rootProps.slots.chartsMenuMoveToTopIcon, {}),
                disabled: !canMoveUp,
            },
            {
                key: 'bottom',
                label: apiRef.current.getLocaleText('chartsMenuMoveToBottom'),
                icon: _jsx(rootProps.slots.chartsMenuMoveToBottomIcon, {}),
                disabled: !canMoveDown,
            },
            { divider: true },
        ];
        const removeMenuItem = [
            {
                key: null,
                label: apiRef.current.getLocaleText('chartsMenuRemove'),
                icon: _jsx(rootProps.slots.chartsMenuRemoveIcon, {}),
            },
        ];
        const addToSectionMenuItems = [
            {
                key: 'dimensions',
                label: apiRef.current.getLocaleText('chartsMenuAddToDimensions')(dimensionsLabel),
                icon: _jsx("span", {}),
            },
            {
                key: 'values',
                label: apiRef.current.getLocaleText('chartsMenuAddToValues')(valuesLabel),
                icon: _jsx("span", {}),
            },
        ].filter((item) => item.key !== section && !blockedSections?.includes(item.key));
        if (addToSectionMenuItems.length > 0) {
            addToSectionMenuItems.push({ divider: true });
        }
        return [...moveMenuItems, ...addToSectionMenuItems, ...removeMenuItem];
    }, [
        isAvailableField,
        apiRef,
        rootProps,
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
    const handleMove = (to) => {
        handleClose();
        // Do nothing if the field is already in the target section
        if (to === section) {
            return;
        }
        const items = section === 'dimensions' ? dimensions : values;
        let targetField;
        let targetFieldPosition = null;
        let targetSection = section;
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
        apiRef.current.chartsIntegration.updateDataReference(field, section, targetSection, targetField, targetFieldPosition || undefined);
    };
    return (_jsxs(React.Fragment, { children: [_jsx(rootProps.slots.baseIconButton, { size: "small", ...rootProps.slotProps?.baseIconButton, id: triggerId, "aria-haspopup": "true", "aria-controls": open ? menuId : undefined, "aria-expanded": open ? 'true' : undefined, "aria-label": apiRef.current.getLocaleText('chartsMenuOptions'), onClick: handleClick, ref: triggerRef, children: isAvailableField ? (_jsx(rootProps.slots.chartsMenuAddIcon, { fontSize: "small" })) : (_jsx(rootProps.slots.columnMenuIcon, { fontSize: "small" })) }), _jsx(GridMenu, { target: triggerRef.current, open: open, onClose: handleClose, position: "bottom-start", children: _jsx(rootProps.slots.baseMenuList, { id: menuId, "aria-labelledby": triggerId, autoFocusItem: true, ...rootProps.slotProps?.baseMenuList, children: menuItems.map((item, index) => 'divider' in item ? (_jsx(rootProps.slots.baseDivider, {}, `divider-${index}`)) : (_jsx(rootProps.slots.baseMenuItem, { disabled: item.disabled, onClick: () => handleMove(item.key), iconStart: item.icon, ...rootProps.slotProps?.baseMenuItem, children: item.label }, item.key))) }) })] }));
}
export { GridChartsPanelDataFieldMenu };
