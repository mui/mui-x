'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { GridMenu, useGridSelector } from '@mui/x-data-grid-pro';
import useId from '@mui/utils/useId';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { gridPivotModelSelector } from '../../hooks/features/pivoting/gridPivotingSelectors';
function GridPivotPanelFieldMenu(props) {
    const { field, modelKey } = props;
    const rootProps = useGridRootProps();
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
    const triggerRef = React.useRef(null);
    const getMenuItems = React.useCallback(() => {
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
                icon: _jsx(rootProps.slots.pivotMenuMoveUpIcon, {}),
                disabled: !canMoveUp,
            },
            {
                key: 'down',
                label: apiRef.current.getLocaleText('pivotMenuMoveDown'),
                icon: _jsx(rootProps.slots.pivotMenuMoveDownIcon, {}),
                disabled: !canMoveDown,
            },
            { divider: true },
            {
                key: 'top',
                label: apiRef.current.getLocaleText('pivotMenuMoveToTop'),
                icon: _jsx(rootProps.slots.pivotMenuMoveToTopIcon, {}),
                disabled: !canMoveUp,
            },
            {
                key: 'bottom',
                label: apiRef.current.getLocaleText('pivotMenuMoveToBottom'),
                icon: _jsx(rootProps.slots.pivotMenuMoveToBottomIcon, {}),
                disabled: !canMoveDown,
            },
            { divider: true },
            {
                key: 'rows',
                label: apiRef.current.getLocaleText('pivotMenuRows'),
                icon: modelKey === 'rows' ? _jsx(rootProps.slots.pivotMenuCheckIcon, {}) : _jsx("span", {}),
            },
            {
                key: 'columns',
                label: apiRef.current.getLocaleText('pivotMenuColumns'),
                icon: modelKey === 'columns' ? _jsx(rootProps.slots.pivotMenuCheckIcon, {}) : _jsx("span", {}),
            },
            {
                key: 'values',
                label: apiRef.current.getLocaleText('pivotMenuValues'),
                icon: modelKey === 'values' ? _jsx(rootProps.slots.pivotMenuCheckIcon, {}) : _jsx("span", {}),
            },
            { divider: true },
            {
                key: null,
                label: apiRef.current.getLocaleText('pivotMenuRemove'),
                icon: _jsx(rootProps.slots.pivotMenuRemoveIcon, {}),
            },
        ];
    }, [isAvailableField, apiRef, rootProps, canMoveUp, canMoveDown, modelKey]);
    const handleClick = () => {
        setOpen(!open);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleMove = (to) => {
        handleClose();
        // Do nothing if the field is already in the target section
        if (to === modelKey) {
            return;
        }
        let targetField;
        let targetFieldPosition = null;
        let targetSection = modelKey;
        switch (to) {
            case 'up':
                targetField = pivotModel[modelKey][fieldIndexInModel - 1].field;
                targetFieldPosition = 'top';
                break;
            case 'down':
                targetField = pivotModel[modelKey][fieldIndexInModel + 1].field;
                targetFieldPosition = 'bottom';
                break;
            case 'top':
                targetField = pivotModel[modelKey][0].field;
                targetFieldPosition = 'top';
                break;
            case 'bottom':
                targetField = pivotModel[modelKey][modelLength - 1].field;
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
    return (_jsxs(React.Fragment, { children: [_jsx(rootProps.slots.baseIconButton, { size: "small", ...rootProps.slotProps?.baseIconButton, id: triggerId, "aria-haspopup": "true", "aria-controls": open ? menuId : undefined, "aria-expanded": open ? 'true' : undefined, "aria-label": apiRef.current.getLocaleText('pivotMenuOptions'), onClick: handleClick, ref: triggerRef, children: isAvailableField ? (_jsx(rootProps.slots.pivotMenuAddIcon, { fontSize: "small" })) : (_jsx(rootProps.slots.columnMenuIcon, { fontSize: "small" })) }), _jsx(GridMenu, { target: triggerRef.current, open: open, onClose: handleClose, position: "bottom-start", children: _jsx(rootProps.slots.baseMenuList, { id: menuId, "aria-labelledby": triggerId, autoFocusItem: true, ...rootProps.slotProps?.baseMenuList, children: getMenuItems().map((item, index) => 'divider' in item ? (_jsx(rootProps.slots.baseDivider, {}, `divider-${index}`)) : (_jsx(rootProps.slots.baseMenuItem, { disabled: item.disabled, onClick: () => handleMove(item.key), iconStart: item.icon, ...rootProps.slotProps?.baseMenuItem, children: item.label }, item.key))) }) })] }));
}
export { GridPivotPanelFieldMenu };
