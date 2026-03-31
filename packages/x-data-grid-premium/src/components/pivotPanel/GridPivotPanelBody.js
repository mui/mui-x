'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { GridShadowScrollArea, getDataGridUtilityClass, useGridSelector, } from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import { vars } from '@mui/x-data-grid-pro/internals';
import { gridPivotInitialColumnsSelector, gridPivotModelSelector, } from '../../hooks/features/pivoting/gridPivotingSelectors';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridPivotPanelField } from './GridPivotPanelField';
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from '../collapsible';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { ResizablePanel, ResizablePanelHandle } from '../resizablePanel';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['pivotPanelBody'],
        availableFields: ['pivotPanelAvailableFields'],
        sections: ['pivotPanelSections'],
        scrollArea: ['pivotPanelScrollArea'],
        section: ['pivotPanelSection'],
        sectionTitle: ['pivotPanelSectionTitle'],
        fieldList: ['pivotPanelFieldList'],
        placeholder: ['pivotPanelPlaceholder'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const GridPivotPanelBodyRoot = styled('div', {
    name: 'MuiDataGrid',
    slot: 'PivotPanelBody',
})({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
});
const GridPivotPanelAvailableFields = styled(GridShadowScrollArea, {
    name: 'MuiDataGrid',
    slot: 'PivotPanelAvailableFields',
})({
    flex: 1,
    minHeight: 84,
    transition: vars.transition(['background-color'], {
        duration: vars.transitions.duration.short,
        easing: vars.transitions.easing.easeInOut,
    }),
    '&[data-drag-over="true"]': {
        backgroundColor: vars.colors.interactive.hover,
    },
});
const GridPivotPanelSections = styled(ResizablePanel, {
    name: 'MuiDataGrid',
    slot: 'PivotPanelSections',
})({
    position: 'relative',
    minHeight: 158,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
});
const GridPivotPanelScrollArea = styled(GridShadowScrollArea, {
    name: 'MuiDataGrid',
    slot: 'PivotPanelScrollArea',
})({
    height: '100%',
});
const GridPivotPanelSection = styled(Collapsible, {
    name: 'MuiDataGrid',
    slot: 'PivotPanelSection',
})({
    margin: vars.spacing(0.5, 1),
    transition: vars.transition(['border-color', 'background-color'], {
        duration: vars.transitions.duration.short,
        easing: vars.transitions.easing.easeInOut,
    }),
    '&[data-drag-over="true"]': {
        backgroundColor: vars.colors.interactive.hover,
        outline: `2px solid ${vars.colors.interactive.selected}`,
    },
});
const GridPivotPanelSectionTitle = styled('div', {
    name: 'MuiDataGrid',
    slot: 'PivotPanelSectionTitle',
})({
    flex: 1,
    marginRight: vars.spacing(1.75),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: vars.spacing(1),
    font: vars.typography.font.body,
    fontWeight: vars.typography.fontWeight.medium,
});
const GridPivotPanelFieldList = styled('div', {
    name: 'MuiDataGrid',
    slot: 'PivotPanelFieldList',
})({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: vars.spacing(0.5, 0),
});
const GridPivotPanelPlaceholder = styled('div', {
    name: 'MuiDataGrid',
    slot: 'PivotPanelPlaceholder',
})({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textWrap: 'balance',
    textAlign: 'center',
    minHeight: 38,
    height: '100%',
    padding: vars.spacing(0, 1),
    color: vars.colors.foreground.muted,
    font: vars.typography.font.body,
});
const INITIAL_DRAG_STATE = { active: false, dropZone: null, initialModelKey: null };
function GridPivotPanelBody({ searchValue }) {
    const apiRef = useGridPrivateApiContext();
    const initialColumns = useGridSelector(apiRef, gridPivotInitialColumnsSelector);
    const fields = React.useMemo(() => Array.from(initialColumns.keys()), [initialColumns]);
    const rootProps = useGridRootProps();
    const [drag, setDrag] = React.useState(INITIAL_DRAG_STATE);
    const pivotModel = useGridSelector(apiRef, gridPivotModelSelector);
    const classes = useUtilityClasses(rootProps);
    const getColumnName = React.useCallback((field) => {
        const column = initialColumns.get(field);
        return column?.headerName || field;
    }, [initialColumns]);
    const pivotModelFields = React.useMemo(() => {
        const pivotModelArray = pivotModel.rows.concat(pivotModel.columns, pivotModel.values);
        return new Set(pivotModelArray.map((item) => item.field));
    }, [pivotModel]);
    const availableFields = React.useMemo(() => {
        return fields.filter((field) => {
            if (pivotModelFields.has(field)) {
                return false;
            }
            if (initialColumns.get(field)?.pivotable === false) {
                return false;
            }
            if (searchValue) {
                const fieldName = getColumnName(field);
                return fieldName.toLowerCase().includes(searchValue.toLowerCase());
            }
            return true;
        });
    }, [searchValue, fields, getColumnName, pivotModelFields, initialColumns]);
    const handleDragStart = (modelKey) => {
        setDrag({ active: true, initialModelKey: modelKey, dropZone: null });
    };
    const handleDragEnd = () => {
        setDrag(INITIAL_DRAG_STATE);
    };
    const handleDrop = (event) => {
        setDrag(INITIAL_DRAG_STATE);
        // The drop event was already handled by a child
        if (event.defaultPrevented) {
            return;
        }
        event.preventDefault();
        const { field, modelKey: originSection } = JSON.parse(event.dataTransfer.getData('text/plain'));
        const targetSection = event.currentTarget.getAttribute('data-section');
        if (originSection === targetSection) {
            return;
        }
        apiRef.current.updatePivotModel({ field, targetSection, originSection });
    };
    const handleDragOver = React.useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);
    const handleDragEnter = React.useCallback((event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            const dropZone = event.currentTarget.getAttribute('data-section');
            setDrag((v) => ({ ...v, active: true, dropZone }));
        }
    }, []);
    const handleDragLeave = React.useCallback((event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setDrag((v) => ({ ...v, active: true, dropZone: v.initialModelKey }));
        }
    }, []);
    const rowsLabel = apiRef.current.getLocaleText('pivotRows');
    const columnsLabel = apiRef.current.getLocaleText('pivotColumns');
    const valuesLabel = apiRef.current.getLocaleText('pivotValues');
    return (_jsxs(GridPivotPanelBodyRoot, { ownerState: rootProps, className: classes.root, "data-dragging": drag.active, onDragLeave: handleDragLeave, children: [_jsxs(GridPivotPanelAvailableFields, { ownerState: rootProps, className: classes.availableFields, onDrop: handleDrop, onDragEnter: handleDragEnter, onDragOver: handleDragOver, "data-section": null, "data-drag-over": drag.active && drag.dropZone === null, children: [availableFields.length === 0 && (_jsx(GridPivotPanelPlaceholder, { ownerState: rootProps, className: classes.placeholder, children: apiRef.current.getLocaleText('pivotNoFields') })), availableFields.length > 0 && (_jsx(GridPivotPanelFieldList, { ownerState: rootProps, className: classes.fieldList, children: availableFields.map((field) => (_jsx(GridPivotPanelField, { field: field, modelKey: null, onDragStart: handleDragStart, onDragEnd: handleDragEnd, children: getColumnName(field) }, field))) }))] }), _jsxs(GridPivotPanelSections, { ownerState: rootProps, className: classes.sections, direction: "vertical", children: [_jsx(ResizablePanelHandle, {}), _jsxs(GridPivotPanelScrollArea, { ownerState: rootProps, className: classes.scrollArea, children: [_jsxs(GridPivotPanelSection, { ownerState: rootProps, className: classes.section, onDrop: handleDrop, onDragEnter: handleDragEnter, onDragOver: handleDragOver, "data-section": "rows", "data-drag-over": drag.dropZone === 'rows', children: [_jsx(CollapsibleTrigger, { "aria-label": apiRef.current.getLocaleText('pivotRows'), children: _jsxs(GridPivotPanelSectionTitle, { ownerState: rootProps, className: classes.sectionTitle, children: [rowsLabel, pivotModel.rows.length > 0 && (_jsx(rootProps.slots.baseBadge, { badgeContent: pivotModel.rows.length }))] }) }), _jsxs(CollapsiblePanel, { children: [pivotModel.rows.length === 0 && (_jsx(GridPivotPanelPlaceholder, { ownerState: rootProps, className: classes.placeholder, children: apiRef.current.getLocaleText('pivotDragToRows') })), pivotModel.rows.length > 0 && (_jsx(GridPivotPanelFieldList, { ownerState: rootProps, className: classes.fieldList, children: pivotModel.rows.map((modelValue) => (_jsx(GridPivotPanelField, { field: modelValue.field, modelKey: "rows", modelValue: modelValue, "data-field": modelValue.field, onDragStart: handleDragStart, onDragEnd: handleDragEnd, children: getColumnName(modelValue.field) }, modelValue.field))) }))] })] }), _jsxs(GridPivotPanelSection, { ownerState: rootProps, className: classes.section, onDrop: handleDrop, onDragEnter: handleDragEnter, onDragOver: handleDragOver, "data-section": "columns", "data-drag-over": drag.dropZone === 'columns', children: [_jsx(CollapsibleTrigger, { "aria-label": apiRef.current.getLocaleText('pivotColumns'), children: _jsxs(GridPivotPanelSectionTitle, { ownerState: rootProps, className: classes.sectionTitle, children: [columnsLabel, pivotModel.columns.length > 0 && (_jsx(rootProps.slots.baseBadge, { badgeContent: pivotModel.columns.length }))] }) }), _jsxs(CollapsiblePanel, { children: [pivotModel.columns.length === 0 && (_jsx(GridPivotPanelPlaceholder, { ownerState: rootProps, className: classes.placeholder, children: apiRef.current.getLocaleText('pivotDragToColumns') })), pivotModel.columns.length > 0 && (_jsx(GridPivotPanelFieldList, { ownerState: rootProps, className: classes.fieldList, children: pivotModel.columns.map((modelValue) => (_jsx(GridPivotPanelField, { field: modelValue.field, modelKey: "columns", modelValue: modelValue, onDragStart: handleDragStart, onDragEnd: handleDragEnd, children: getColumnName(modelValue.field) }, modelValue.field))) }))] })] }), _jsxs(GridPivotPanelSection, { ownerState: rootProps, className: classes.section, onDrop: handleDrop, onDragEnter: handleDragEnter, onDragOver: handleDragOver, "data-section": "values", "data-drag-over": drag.dropZone === 'values', children: [_jsx(CollapsibleTrigger, { "aria-label": apiRef.current.getLocaleText('pivotValues'), children: _jsxs(GridPivotPanelSectionTitle, { ownerState: rootProps, className: classes.sectionTitle, children: [valuesLabel, pivotModel.values.length > 0 && (_jsx(rootProps.slots.baseBadge, { badgeContent: pivotModel.values.length }))] }) }), _jsxs(CollapsiblePanel, { children: [pivotModel.values.length === 0 && (_jsx(GridPivotPanelPlaceholder, { ownerState: rootProps, className: classes.placeholder, children: apiRef.current.getLocaleText('pivotDragToValues') })), pivotModel.values.length > 0 && (_jsx(GridPivotPanelFieldList, { ownerState: rootProps, className: classes.fieldList, children: pivotModel.values.map((modelValue) => (_jsx(GridPivotPanelField, { field: modelValue.field, modelKey: "values", modelValue: modelValue, onDragStart: handleDragStart, onDragEnd: handleDragEnd, children: getColumnName(modelValue.field) }, modelValue.field))) }))] })] })] })] })] }));
}
export { GridPivotPanelBody };
