'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { getDataGridUtilityClass, gridClasses, GridMenu, useGridSelector, } from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import { GridColumnSortButton, NotRendered, vars } from '@mui/x-data-grid-pro/internals';
import useId from '@mui/utils/useId';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getAggregationFunctionLabel, getAvailableAggregationFunctions, } from '../../hooks/features/aggregation/gridAggregationUtils';
import { GridPivotPanelFieldMenu } from './GridPivotPanelFieldMenu';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { gridPivotInitialColumnsSelector } from '../../hooks/features/pivoting/gridPivotingSelectors';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
const useUtilityClasses = (ownerState) => {
    const { classes, modelKey } = ownerState;
    const sorted = modelKey === 'columns' && ownerState.modelValue.sort;
    const slots = {
        root: ['pivotPanelField', sorted && 'pivotPanelField--sorted'],
        name: ['pivotPanelFieldName'],
        actionContainer: ['pivotPanelFieldActionContainer'],
        dragIcon: ['pivotPanelFieldDragIcon'],
        checkbox: ['pivotPanelFieldCheckbox'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const GridPivotPanelFieldRoot = styled('div', {
    name: 'MuiDataGrid',
    slot: 'PivotPanelField',
    overridesResolver: (props, styles) => [
        { [`&.${gridClasses['pivotPanelField--sorted']}`]: styles['pivotPanelField--sorted'] },
        styles.pivotPanelField,
    ],
})({
    flexShrink: 0,
    position: 'relative',
    padding: vars.spacing(0, 1, 0, 2),
    height: 32,
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing(0.5),
    borderWidth: 0,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderStyle: 'solid',
    borderColor: 'transparent',
    margin: '-1px 0', // collapse vertical borders
    cursor: 'grab',
    variants: [
        { props: { dropPosition: 'top' }, style: { borderTopColor: vars.colors.interactive.selected } },
        {
            props: { dropPosition: 'bottom' },
            style: { borderBottomColor: vars.colors.interactive.selected },
        },
        {
            props: { section: null },
            style: { borderTopColor: 'transparent', borderBottomColor: 'transparent' },
        },
    ],
    '&:hover': {
        backgroundColor: vars.colors.interactive.hover,
    },
});
const GridPivotPanelFieldName = styled('span', {
    name: 'MuiDataGrid',
    slot: 'PivotPanelFieldName',
})({
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
});
const GridPivotPanelFieldActionContainer = styled('div', {
    name: 'MuiDataGrid',
    slot: 'PivotPanelFieldActionContainer',
})({
    display: 'flex',
    alignItems: 'center',
});
const GridPivotPanelFieldDragIcon = styled('div', {
    name: 'MuiDataGrid',
    slot: 'PivotPanelFieldDragIcon',
})({
    position: 'absolute',
    left: -1,
    width: 16,
    display: 'flex',
    justifyContent: 'center',
    color: vars.colors.foreground.base,
    opacity: 0,
    '[draggable="true"]:hover > &': {
        opacity: 0.3,
    },
});
const GridPivotPanelFieldCheckbox = styled((NotRendered), {
    name: 'MuiDataGrid',
    slot: 'PivotPanelFieldCheckbox',
})({
    flex: 1,
    position: 'relative',
    margin: vars.spacing(0, 0, 0, -1),
    cursor: 'grab',
});
function AggregationSelect({ aggFunc, field, }) {
    const rootProps = useGridRootProps();
    const [aggregationMenuOpen, setAggregationMenuOpen] = React.useState(false);
    const aggregationMenuTriggerRef = React.useRef(null);
    const aggregationMenuTriggerId = useId();
    const aggregationMenuId = useId();
    const apiRef = useGridApiContext();
    const initialColumns = useGridSelector(apiRef, gridPivotInitialColumnsSelector);
    const colDef = initialColumns.get(field);
    const availableAggregationFunctions = React.useMemo(() => getAvailableAggregationFunctions({
        aggregationFunctions: rootProps.aggregationFunctions,
        colDef,
        isDataSource: !!rootProps.dataSource,
    }), [colDef, rootProps.aggregationFunctions, rootProps.dataSource]);
    const handleClick = (func) => {
        apiRef.current.setPivotModel((prev) => {
            return {
                ...prev,
                values: prev.values.map((col) => {
                    if (col.field === field) {
                        return { ...col, aggFunc: func };
                    }
                    return col;
                }),
            };
        });
        setAggregationMenuOpen(false);
    };
    return availableAggregationFunctions.length > 0 ? (_jsxs(React.Fragment, { children: [_jsx(rootProps.slots.baseChip, { label: getAggregationFunctionLabel({
                    apiRef,
                    aggregationRule: {
                        aggregationFunctionName: aggFunc,
                        aggregationFunction: rootProps.aggregationFunctions[aggFunc],
                    },
                }), size: "small", variant: "outlined", ref: aggregationMenuTriggerRef, id: aggregationMenuTriggerId, "aria-haspopup": "true", "aria-controls": aggregationMenuOpen ? aggregationMenuId : undefined, "aria-expanded": aggregationMenuOpen ? 'true' : undefined, onClick: () => setAggregationMenuOpen(!aggregationMenuOpen) }), _jsx(GridMenu, { open: aggregationMenuOpen, onClose: () => setAggregationMenuOpen(false), target: aggregationMenuTriggerRef.current, position: "bottom-start", children: _jsx(rootProps.slots.baseMenuList, { id: aggregationMenuId, "aria-labelledby": aggregationMenuTriggerId, autoFocusItem: true, ...rootProps.slotProps?.baseMenuList, children: availableAggregationFunctions.map((func) => (_jsx(rootProps.slots.baseMenuItem, { selected: aggFunc === func, onClick: () => handleClick(func), ...rootProps.slotProps?.baseMenuItem, children: getAggregationFunctionLabel({
                            apiRef,
                            aggregationRule: {
                                aggregationFunctionName: func,
                                aggregationFunction: rootProps.aggregationFunctions[func],
                            },
                        }) }, func))) }) })] })) : null;
}
function GridPivotPanelField(props) {
    const { children, field, onDragStart, onDragEnd } = props;
    const rootProps = useGridRootProps();
    const [dropPosition, setDropPosition] = React.useState(null);
    const section = props.modelKey;
    const ownerState = { ...props, classes: rootProps.classes, dropPosition, section };
    const classes = useUtilityClasses(ownerState);
    const apiRef = useGridPrivateApiContext();
    const handleDragStart = React.useCallback((event) => {
        const data = { field, modelKey: section };
        event.dataTransfer.setData('text/plain', JSON.stringify(data));
        event.dataTransfer.dropEffect = 'move';
        onDragStart(section);
    }, [field, onDragStart, section]);
    const getDropPosition = React.useCallback((event) => {
        const rect = event.target.getBoundingClientRect();
        const y = event.clientY - rect.top;
        if (y < rect.height / 2) {
            return 'top';
        }
        return 'bottom';
    }, []);
    const handleDragOver = React.useCallback((event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setDropPosition(getDropPosition(event));
        }
    }, [getDropPosition]);
    const handleDragLeave = React.useCallback((event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setDropPosition(null);
        }
    }, []);
    const handleDrop = React.useCallback((event) => {
        setDropPosition(null);
        if (!event.currentTarget.contains(event.relatedTarget)) {
            event.preventDefault();
            const position = getDropPosition(event);
            const { field: droppedField, modelKey: originSection } = JSON.parse(event.dataTransfer.getData('text/plain'));
            apiRef.current.updatePivotModel({
                field: droppedField,
                targetField: field,
                targetFieldPosition: position,
                originSection,
                targetSection: section,
            });
        }
    }, [getDropPosition, apiRef, field, section]);
    const handleSort = () => {
        const currentSort = section === 'columns' ? props.modelValue.sort : null;
        let newValue;
        if (currentSort === 'asc') {
            newValue = 'desc';
        }
        else if (currentSort === 'desc') {
            newValue = undefined;
        }
        else {
            newValue = 'asc';
        }
        apiRef.current.setPivotModel((prev) => {
            return {
                ...prev,
                columns: prev.columns.map((col) => {
                    if (col.field === field) {
                        return {
                            ...col,
                            sort: newValue,
                        };
                    }
                    return col;
                }),
            };
        });
    };
    const handleVisibilityChange = (event) => {
        if (section) {
            apiRef.current.setPivotModel((prev) => {
                return {
                    ...prev,
                    [section]: prev[section].map((col) => {
                        if (col.field === field) {
                            return { ...col, hidden: !event.target.checked };
                        }
                        return col;
                    }),
                };
            });
        }
    };
    const hideable = section !== null;
    return (_jsxs(GridPivotPanelFieldRoot, { ownerState: ownerState, className: classes.root, onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop, onDragStart: handleDragStart, onDragEnd: onDragEnd, draggable: "true", children: [_jsx(GridPivotPanelFieldDragIcon, { ownerState: ownerState, className: classes.dragIcon, children: _jsx(rootProps.slots.columnReorderIcon, { fontSize: "small" }) }), hideable ? (_jsx(GridPivotPanelFieldCheckbox, { ownerState: ownerState, className: classes.checkbox, as: rootProps.slots.baseCheckbox, size: "small", density: "compact", ...rootProps.slotProps?.baseCheckbox, checked: !props.modelValue.hidden || false, onChange: handleVisibilityChange, label: children })) : (_jsx(GridPivotPanelFieldName, { ownerState: ownerState, className: classes.name, children: children })), _jsxs(GridPivotPanelFieldActionContainer, { ownerState: ownerState, className: classes.actionContainer, children: [section === 'columns' && (_jsx(GridColumnSortButton, { field: field, direction: props.modelValue.sort, sortingOrder: rootProps.sortingOrder, onClick: handleSort })), section === 'values' && (_jsx(AggregationSelect, { aggFunc: props.modelValue.aggFunc, field: field })), _jsx(GridPivotPanelFieldMenu, { field: field, modelKey: section })] })] }));
}
export { GridPivotPanelField };
