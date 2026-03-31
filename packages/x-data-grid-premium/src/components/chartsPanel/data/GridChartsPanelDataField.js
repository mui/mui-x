'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import useId from '@mui/utils/useId';
import { styled } from '@mui/material/styles';
import { getDataGridUtilityClass, GridMenu, useGridSelector, } from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import { gridPivotActiveSelector, NotRendered, vars } from '@mui/x-data-grid-pro/internals';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { useGridPrivateApiContext } from '../../../hooks/utils/useGridPrivateApiContext';
import { GridChartsPanelDataFieldMenu } from './GridChartsPanelDataFieldMenu';
import { gridAggregationModelSelector } from '../../../hooks/features/aggregation';
import { gridRowGroupingSanitizedModelSelector } from '../../../hooks/features/rowGrouping/gridRowGroupingSelector';
import { getAggregationFunctionLabel, getAvailableAggregationFunctions, } from '../../../hooks/features/aggregation/gridAggregationUtils';
import { COLUMN_GROUP_ID_SEPARATOR } from '../../../constants/columnGroups';
const AGGREGATION_FUNCTION_NONE = 'none';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['chartsPanelDataField'],
        name: ['chartsPanelDataFieldName'],
        actionContainer: ['chartsPanelDataFieldActionContainer'],
        dragIcon: ['chartsPanelDataFieldDragIcon'],
        checkbox: ['chartsPanelDataFieldCheckbox'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const GridChartsPanelDataFieldRoot = styled('div', {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelDataField',
})(({ disabled }) => ({
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
    cursor: disabled ? 'not-allowed' : 'grab',
    opacity: disabled ? 0.5 : 1,
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
}));
const GridChartsPanelDataFieldName = styled('span', {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelDataFieldName',
})({
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
});
const GridChartsPanelDataFieldActionContainer = styled('div', {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelDataFieldActionContainer',
})({
    display: 'flex',
    alignItems: 'center',
});
const GridChartsPanelDataFieldDragIcon = styled('div', {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelDataFieldDragIcon',
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
const GridChartsPanelDataFieldCheckbox = styled((NotRendered), {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelDataFieldCheckbox',
})({
    flex: 1,
    position: 'relative',
    margin: vars.spacing(0, 0, 0, -1),
    cursor: 'grab',
});
export function AggregationSelect({ aggFunc, field, }) {
    const rootProps = useGridRootProps();
    const [aggregationMenuOpen, setAggregationMenuOpen] = React.useState(false);
    const aggregationMenuTriggerRef = React.useRef(null);
    const aggregationMenuTriggerId = useId();
    const aggregationMenuId = useId();
    const apiRef = useGridApiContext();
    const aggregationModel = gridAggregationModelSelector(apiRef);
    const pivotActive = gridPivotActiveSelector(apiRef);
    const getActualFieldName = React.useCallback((fieldName) => pivotActive ? fieldName.split(COLUMN_GROUP_ID_SEPARATOR).slice(-1)[0] : fieldName, [pivotActive]);
    const colDef = React.useCallback((fieldName) => apiRef.current.getColumn(getActualFieldName(fieldName)), [apiRef, getActualFieldName]);
    const availableAggregationFunctions = React.useMemo(() => [
        ...(pivotActive ? [] : [AGGREGATION_FUNCTION_NONE]),
        ...getAvailableAggregationFunctions({
            aggregationFunctions: rootProps.aggregationFunctions,
            colDef: colDef(field),
            isDataSource: !!rootProps.dataSource,
        }),
    ], [colDef, field, pivotActive, rootProps.aggregationFunctions, rootProps.dataSource]);
    const handleClick = React.useCallback((func) => {
        if (pivotActive) {
            const fieldName = getActualFieldName(field);
            apiRef.current.setPivotModel((prev) => ({
                ...prev,
                values: prev.values.map((col) => {
                    if (col.field === fieldName) {
                        return { ...col, aggFunc: func };
                    }
                    return col;
                }),
            }));
        }
        else if (func === AGGREGATION_FUNCTION_NONE) {
            const updatedAggregationModel = { ...aggregationModel };
            delete updatedAggregationModel[field];
            apiRef.current.setAggregationModel(updatedAggregationModel);
        }
        else {
            apiRef.current.setAggregationModel({ ...aggregationModel, [field]: func });
        }
        setAggregationMenuOpen(false);
    }, [apiRef, field, getActualFieldName, pivotActive, aggregationModel, setAggregationMenuOpen]);
    return availableAggregationFunctions.length > 0 ? (_jsxs(React.Fragment, { children: [_jsx(rootProps.slots.baseChip, { label: getAggregationFunctionLabel({
                    apiRef,
                    aggregationRule: {
                        aggregationFunctionName: aggFunc,
                        aggregationFunction: rootProps.aggregationFunctions[aggFunc] || {},
                    },
                }), size: "small", variant: "outlined", ref: aggregationMenuTriggerRef, id: aggregationMenuTriggerId, "aria-haspopup": "true", "aria-controls": aggregationMenuOpen ? aggregationMenuId : undefined, "aria-expanded": aggregationMenuOpen ? 'true' : undefined, onClick: () => setAggregationMenuOpen(!aggregationMenuOpen) }), _jsx(GridMenu, { open: aggregationMenuOpen, onClose: () => setAggregationMenuOpen(false), target: aggregationMenuTriggerRef.current, position: "bottom-start", children: _jsx(rootProps.slots.baseMenuList, { id: aggregationMenuId, "aria-labelledby": aggregationMenuTriggerId, autoFocusItem: true, ...rootProps.slotProps?.baseMenuList, children: availableAggregationFunctions.map((func) => (_jsx(rootProps.slots.baseMenuItem, { selected: aggFunc === func, onClick: () => handleClick(func), ...rootProps.slotProps?.baseMenuItem, children: getAggregationFunctionLabel({
                            apiRef,
                            aggregationRule: {
                                aggregationFunctionName: func,
                                aggregationFunction: rootProps.aggregationFunctions[func] || {},
                            },
                        }) }, func))) }) })] })) : null;
}
function GridChartsPanelDataField(props) {
    const { children, field, section, blockedSections, dimensionsLabel, valuesLabel, selected, disabled, onChange, onDragStart, onDragEnd, } = props;
    const rootProps = useGridRootProps();
    const [dropPosition, setDropPosition] = React.useState(null);
    const ownerState = { ...props, classes: rootProps.classes, dropPosition, section };
    const classes = useUtilityClasses(ownerState);
    const apiRef = useGridPrivateApiContext();
    const aggregationModel = useGridSelector(apiRef, gridAggregationModelSelector);
    const rowGroupingModel = useGridSelector(apiRef, gridRowGroupingSanitizedModelSelector);
    const isRowGroupingEnabled = React.useMemo(() => rowGroupingModel.length > 0, [rowGroupingModel]);
    const handleDragStart = React.useCallback((event) => {
        const data = { field, section };
        event.dataTransfer.setData('text/plain', JSON.stringify(data));
        event.dataTransfer.dropEffect = 'move';
        onDragStart(field, section);
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
        if (disabled) {
            return;
        }
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setDropPosition(getDropPosition(event));
        }
    }, [disabled, getDropPosition]);
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
            const { field: droppedField, section: originSection } = JSON.parse(event.dataTransfer.getData('text/plain'));
            apiRef.current.chartsIntegration.updateDataReference(droppedField, originSection, section, field, position || undefined);
        }
    }, [getDropPosition, apiRef, field, section]);
    const hideable = section !== null;
    return (_jsx(rootProps.slots.baseTooltip, { title: disabled ? apiRef.current.getLocaleText('chartsFieldBlocked') : undefined, enterDelay: 1000, ...rootProps.slotProps?.baseTooltip, children: _jsxs(GridChartsPanelDataFieldRoot, { ownerState: ownerState, className: classes.root, onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop, onDragStart: handleDragStart, onDragEnd: onDragEnd, draggable: !disabled, disabled: !!disabled, children: [_jsx(GridChartsPanelDataFieldDragIcon, { ownerState: ownerState, className: classes.dragIcon, children: _jsx(rootProps.slots.columnReorderIcon, { fontSize: "small" }) }), hideable ? (_jsx(GridChartsPanelDataFieldCheckbox, { ownerState: ownerState, className: classes.checkbox, as: rootProps.slots.baseCheckbox, size: "small", density: "compact", ...rootProps.slotProps?.baseCheckbox, checked: selected || false, onChange: () => onChange && onChange(field, section), label: children })) : (_jsx(GridChartsPanelDataFieldName, { ownerState: ownerState, className: classes.name, children: children })), _jsxs(GridChartsPanelDataFieldActionContainer, { ownerState: ownerState, className: classes.actionContainer, children: [isRowGroupingEnabled && section === 'values' && (_jsx(AggregationSelect, { aggFunc: aggregationModel[field] ?? AGGREGATION_FUNCTION_NONE, field: field })), _jsx(GridChartsPanelDataFieldMenu, { field: field, section: section, blockedSections: blockedSections, dimensionsLabel: dimensionsLabel, valuesLabel: valuesLabel })] })] }) }));
}
export { GridChartsPanelDataField };
