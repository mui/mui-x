'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { gridPivotActiveSelector, vars } from '@mui/x-data-grid-pro/internals';
import { getDataGridUtilityClass, GridShadowScrollArea, useGridSelector, } from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from '../../collapsible';
import { ResizablePanel, ResizablePanelHandle } from '../../resizablePanel';
import { GridChartsPanelDataField } from './GridChartsPanelDataField';
import { gridChartableColumnsSelector, gridChartsDimensionsSelector, gridChartsIntegrationActiveChartIdSelector, gridChartsValuesSelector, } from '../../../hooks/features/chartsIntegration/gridChartsIntegrationSelectors';
import { useGridPrivateApiContext } from '../../../hooks/utils/useGridPrivateApiContext';
import { useGridChartsIntegrationContext } from '../../../hooks/utils/useGridChartIntegration';
import { getBlockedSections } from '../../../hooks/features/chartsIntegration/utils';
import { gridRowGroupingSanitizedModelSelector } from '../../../hooks/features/rowGrouping/gridRowGroupingSelector';
import { gridPivotModelSelector } from '../../../hooks/features/pivoting/gridPivotingSelectors';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['chartsPanelDataBody'],
        availableFields: ['chartsPanelDataAvailableFields'],
        sections: ['chartsPanelDataSections'],
        scrollArea: ['chartsPanelDataScrollArea'],
        section: ['chartsPanelDataSection'],
        sectionTitle: ['chartsPanelDataSectionTitle'],
        fieldList: ['chartsPanelDataFieldList'],
        placeholder: ['chartsPanelDataPlaceholder'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const GridChartsPanelDataBodyRoot = styled('div', {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelDataBody',
})({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
});
const GridChartsPanelDataAvailableFields = styled(GridShadowScrollArea, {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelDataAvailableFields',
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
const GridChartsPanelDataSections = styled(ResizablePanel, {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelDataSections',
})({
    position: 'relative',
    minHeight: 158,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
});
const GridChartsPanelDataScrollArea = styled(GridShadowScrollArea, {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelDataScrollArea',
})({
    height: '100%',
});
const GridChartsPanelDataSection = styled(Collapsible, {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelDataSection',
    shouldForwardProp: (prop) => prop !== 'disabled',
})(({ disabled }) => ({
    opacity: disabled ? 0.5 : 1,
    margin: vars.spacing(0.5, 1),
    transition: vars.transition(['border-color', 'background-color'], {
        duration: vars.transitions.duration.short,
        easing: vars.transitions.easing.easeInOut,
    }),
    '&[data-drag-over="true"]': {
        backgroundColor: vars.colors.interactive.hover,
        outline: `2px solid ${vars.colors.interactive.selected}`,
    },
}));
const GridChartsPanelDataSectionTitle = styled('div', {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelDataSectionTitle',
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
const GridChartsPanelDataFieldList = styled('div', {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelDataFieldList',
})({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: vars.spacing(0.5, 0),
});
const GridChartsPanelDataPlaceholder = styled('div', {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelDataPlaceholder',
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
const INITIAL_DRAG_STATE = { active: false, field: null, dropSection: null, initialSection: null };
// dimensions and values
const SECTION_COUNT = 2;
function GridChartsPanelDataBody(props) {
    const { searchValue } = props;
    const apiRef = useGridPrivateApiContext();
    const rootProps = useGridRootProps();
    const rowGroupingModel = useGridSelector(apiRef, gridRowGroupingSanitizedModelSelector);
    const pivotActive = useGridSelector(apiRef, gridPivotActiveSelector);
    const pivotModel = useGridSelector(apiRef, gridPivotModelSelector);
    const activeChartId = useGridSelector(apiRef, gridChartsIntegrationActiveChartIdSelector);
    const { chartStateLookup } = useGridChartsIntegrationContext();
    const dimensions = useGridSelector(apiRef, gridChartsDimensionsSelector, activeChartId);
    const values = useGridSelector(apiRef, gridChartsValuesSelector, activeChartId);
    const classes = useUtilityClasses(rootProps);
    const chartableColumns = useGridSelector(apiRef, gridChartableColumnsSelector);
    const dimensionsLabel = React.useMemo(() => chartStateLookup[activeChartId]?.dimensionsLabel ||
        apiRef.current.getLocaleText('chartsCategories'), [chartStateLookup, activeChartId, apiRef]);
    const valuesLabel = React.useMemo(() => chartStateLookup[activeChartId]?.valuesLabel || apiRef.current.getLocaleText('chartsSeries'), [chartStateLookup, activeChartId, apiRef]);
    const fullSections = React.useMemo(() => {
        const sections = [];
        if (chartStateLookup[activeChartId]?.maxDimensions &&
            dimensions.length >= chartStateLookup[activeChartId]?.maxDimensions) {
            sections.push('dimensions');
        }
        if (chartStateLookup[activeChartId]?.maxValues &&
            values.length >= chartStateLookup[activeChartId]?.maxValues) {
            sections.push('values');
        }
        return sections;
    }, [dimensions, values, chartStateLookup, activeChartId]);
    const blockedSectionsLookup = React.useMemo(() => new Map(Object.values(chartableColumns).map((column) => [
        column.field,
        Array.from(new Set([
            ...getBlockedSections(column, rowGroupingModel, pivotActive ? pivotModel : undefined),
            ...fullSections,
        ])),
    ])), [rowGroupingModel, chartableColumns, pivotActive, pivotModel, fullSections]);
    const availableFields = React.useMemo(() => {
        const notUsedFields = Object.keys(chartableColumns).filter((field) => !dimensions.some((dimension) => dimension.field === field) &&
            !values.some((value) => value.field === field));
        if (searchValue) {
            return notUsedFields.filter((field) => {
                const fieldName = apiRef.current.chartsIntegration.getColumnName(field);
                return fieldName.toLowerCase().includes(searchValue.toLowerCase());
            });
        }
        // Fields with all sections blocked should be at the end
        return notUsedFields.sort((a, b) => {
            const aBlockedSections = blockedSectionsLookup.get(a).length;
            const bBlockedSections = blockedSectionsLookup.get(b).length;
            return ((aBlockedSections >= SECTION_COUNT ? 1 : 0) - (bBlockedSections >= SECTION_COUNT ? 1 : 0));
        });
    }, [apiRef, searchValue, chartableColumns, dimensions, values, blockedSectionsLookup]);
    const [drag, setDrag] = React.useState(INITIAL_DRAG_STATE);
    const disabledSections = React.useMemo(() => {
        if (!drag.field) {
            return new Set();
        }
        return new Set(blockedSectionsLookup.get(drag.field));
    }, [blockedSectionsLookup, drag.field]);
    const handleDragStart = (field, section) => {
        setDrag({ active: true, field, initialSection: section, dropSection: null });
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
        const { field, section: originSection } = JSON.parse(event.dataTransfer.getData('text/plain'));
        const targetSection = event.currentTarget.getAttribute('data-section');
        if (originSection === targetSection) {
            return;
        }
        apiRef.current.chartsIntegration.updateDataReference(field, originSection, targetSection);
    };
    const handleDragOver = React.useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);
    const handleDragEnter = React.useCallback((event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            const dropSection = event.currentTarget.getAttribute('data-section');
            setDrag((v) => ({ ...v, active: true, dropSection }));
        }
    }, []);
    const handleDragLeave = React.useCallback((event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setDrag((v) => ({ ...v, active: true, dropSection: v.initialSection }));
        }
    }, []);
    const handleChange = React.useCallback((field, section) => {
        const apiMethod = section === 'dimensions'
            ? apiRef.current.updateChartDimensionsData
            : apiRef.current.updateChartValuesData;
        apiMethod(activeChartId, (currentItems) => currentItems.map((item) => item.field === field ? { ...item, hidden: item.hidden !== true } : item));
    }, [apiRef, activeChartId]);
    return (_jsxs(GridChartsPanelDataBodyRoot, { ownerState: rootProps, className: classes.root, "data-dragging": drag.active, onDragLeave: handleDragLeave, children: [_jsxs(GridChartsPanelDataAvailableFields, { ownerState: rootProps, className: classes.availableFields, onDrop: handleDrop, onDragEnter: handleDragEnter, onDragOver: handleDragOver, "data-section": null, "data-drag-over": drag.active && drag.dropSection === null, children: [availableFields.length === 0 && (_jsx(GridChartsPanelDataPlaceholder, { ownerState: rootProps, className: classes.placeholder, children: apiRef.current.getLocaleText('chartsNoFields') })), availableFields.length > 0 && (_jsx(GridChartsPanelDataFieldList, { ownerState: rootProps, className: classes.fieldList, children: availableFields.map((field) => (_jsx(GridChartsPanelDataField, { field: field, section: null, disabled: blockedSectionsLookup.get(field).length >= SECTION_COUNT, blockedSections: blockedSectionsLookup.get(field), dimensionsLabel: dimensionsLabel, valuesLabel: valuesLabel, onDragStart: handleDragStart, onDragEnd: handleDragEnd, children: apiRef.current.chartsIntegration.getColumnName(field) }, field))) }))] }), _jsxs(GridChartsPanelDataSections, { ownerState: rootProps, className: classes.sections, direction: "vertical", children: [_jsx(ResizablePanelHandle, {}), _jsxs(GridChartsPanelDataScrollArea, { ownerState: rootProps, className: classes.scrollArea, children: [_jsxs(GridChartsPanelDataSection, { ownerState: rootProps, className: classes.section, onDrop: handleDrop, onDragEnter: handleDragEnter, onDragOver: handleDragOver, disabled: disabledSections.has('dimensions'), "data-section": "dimensions", "data-drag-over": !disabledSections.has('dimensions') && drag.dropSection === 'dimensions', children: [_jsx(CollapsibleTrigger, { "aria-label": dimensionsLabel, children: _jsxs(GridChartsPanelDataSectionTitle, { ownerState: rootProps, className: classes.sectionTitle, children: [dimensionsLabel, (chartStateLookup[activeChartId]?.maxDimensions || dimensions.length > 0) && (_jsx(rootProps.slots.baseBadge, { badgeContent: chartStateLookup[activeChartId]?.maxDimensions
                                                        ? `${dimensions.length}/${chartStateLookup[activeChartId]?.maxDimensions}`
                                                        : dimensions.length }))] }) }), _jsxs(CollapsiblePanel, { children: [dimensions.length === 0 && (_jsx(GridChartsPanelDataPlaceholder, { ownerState: rootProps, className: classes.placeholder, children: apiRef.current.getLocaleText('chartsDragToDimensions')(dimensionsLabel) })), dimensions.length > 0 && (_jsx(GridChartsPanelDataFieldList, { ownerState: rootProps, className: classes.fieldList, children: dimensions.map((dimension) => (_jsx(GridChartsPanelDataField, { field: dimension.field, selected: dimension.hidden !== true, onChange: handleChange, section: "dimensions", blockedSections: blockedSectionsLookup.get(dimension.field), dimensionsLabel: dimensionsLabel, valuesLabel: valuesLabel, disabled: disabledSections.has('dimensions'), onDragStart: handleDragStart, onDragEnd: handleDragEnd, children: apiRef.current.chartsIntegration.getColumnName(dimension.field) }, dimension.field))) }))] })] }), _jsxs(GridChartsPanelDataSection, { ownerState: rootProps, className: classes.section, onDrop: handleDrop, onDragEnter: handleDragEnter, onDragOver: handleDragOver, disabled: disabledSections.has('values'), "data-section": "values", "data-drag-over": !disabledSections.has('values') && drag.dropSection === 'values', children: [_jsx(CollapsibleTrigger, { "aria-label": valuesLabel, children: _jsxs(GridChartsPanelDataSectionTitle, { ownerState: rootProps, className: classes.sectionTitle, children: [valuesLabel, (chartStateLookup[activeChartId]?.maxValues || values.length > 0) && (_jsx(rootProps.slots.baseBadge, { badgeContent: chartStateLookup[activeChartId]?.maxValues
                                                        ? `${values.length}/${chartStateLookup[activeChartId]?.maxValues}`
                                                        : values.length }))] }) }), _jsxs(CollapsiblePanel, { children: [values.length === 0 && (_jsx(GridChartsPanelDataPlaceholder, { ownerState: rootProps, className: classes.placeholder, children: apiRef.current.getLocaleText('chartsDragToValues')(valuesLabel) })), values.length > 0 && (_jsx(GridChartsPanelDataFieldList, { ownerState: rootProps, className: classes.fieldList, children: values.map((value) => (_jsx(GridChartsPanelDataField, { field: value.field, selected: value.hidden !== true, onChange: handleChange, section: "values", blockedSections: blockedSectionsLookup.get(value.field), dimensionsLabel: dimensionsLabel, valuesLabel: valuesLabel, disabled: disabledSections.has('values'), onDragStart: handleDragStart, onDragEnd: handleDragEnd, children: apiRef.current.chartsIntegration.getColumnName(value.field) }, value.field))) }))] })] })] })] })] }));
}
export { GridChartsPanelDataBody };
