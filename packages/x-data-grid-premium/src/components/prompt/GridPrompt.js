'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { getDataGridUtilityClass, gridClasses, gridColumnLookupSelector, useGridSelector, } from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import capitalize from '@mui/utils/capitalize';
import { keyframes, styled } from '@mui/system';
import { getValueOptions, isSingleSelectColDef, vars } from '@mui/x-data-grid-pro/internals';
import useId from '@mui/utils/useId';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['prompt'],
        iconContainer: ['promptIconContainer'],
        icon: ['promptIcon'],
        text: ['promptText'],
        content: ['promptContent'],
        action: ['promptAction'],
        feedback: ['promptFeedback'],
        changeList: ['promptChangeList'],
        changesToggle: ['promptChangesToggle'],
        changesToggleIcon: ['promptChangesToggleIcon'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const fadeIn = keyframes({
    from: {
        opacity: 0,
    },
    to: {
        opacity: 1,
    },
});
const fadeInUp = keyframes({
    from: {
        opacity: 0,
        transform: 'translateY(5px)',
    },
    to: {
        opacity: 1,
        transform: 'translateY(0)',
    },
});
// This `styled()` function invokes keyframes. `styled-components` only supports keyframes
// in string templates. Do not convert these styles in JS object as it will break.
const PromptItem = styled('li', {
    name: 'MuiDataGrid',
    slot: 'Prompt',
}) `
  display: flex;
  padding: ${vars.spacing(1, 1.25)};
  align-items: flex-start;
  overflow: hidden;
  .${gridClasses.promptAction} {
    opacity: 0;
    transition: ${vars.transition(['opacity'], { duration: vars.transitions.duration.short })};
  }
  &:hover .${gridClasses.promptAction}, & .${gridClasses.promptAction}:focus-visible {
    opacity: 1;
  }
  @media (prefers-reduced-motion: no-preference) {
    animation: ${fadeInUp} ${vars.transitions.duration.long} ${vars.transitions.easing.easeInOut};
  }
`;
const PromptContent = styled('div', {
    name: 'MuiDataGrid',
    slot: 'PromptContent',
})({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    overflow: 'hidden',
});
const PromptText = styled('div', {
    name: 'MuiDataGrid',
    slot: 'PromptText',
})({
    font: vars.typography.font.body,
});
const PromptIconContainer = styled('div', {
    name: 'MuiDataGrid',
    slot: 'PromptIconContainer',
})({
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    marginRight: vars.spacing(1.5),
});
// This `styled()` function invokes keyframes. `styled-components` only supports keyframes
// in string templates. Do not convert these styles in JS object as it will break.
const PromptIcon = styled('svg', {
    name: 'MuiDataGrid',
    slot: 'PromptIcon',
}) `
  color: ${({ ownerState }) => ownerState.variant === 'error' ? vars.colors.foreground.error : vars.colors.foreground.muted};
  @media (prefers-reduced-motion: no-preference) {
    animation: ${fadeIn} ${vars.transitions.duration.short} ${vars.transitions.easing.easeInOut};
  }
`;
const PromptFeedback = styled('div', {
    name: 'MuiDataGrid',
    slot: 'PromptFeedback',
})({
    font: vars.typography.font.small,
    color: vars.colors.foreground.muted,
    variants: [
        {
            props: {
                variant: 'error',
            },
            style: {
                color: vars.colors.foreground.error,
            },
        },
    ],
});
const PromptChangeList = styled('div', {
    name: 'MuiDataGrid',
    slot: 'PromptChangeList',
})({
    display: 'flex',
    flexWrap: 'wrap',
    gap: vars.spacing(0.5),
    width: '100%',
    marginTop: vars.spacing(1),
    overflow: 'hidden',
});
const PromptChangesToggle = styled('button', {
    name: 'MuiDataGrid',
    slot: 'PromptChangesToggle',
})({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing(0.25),
    padding: 0,
    font: vars.typography.font.small,
    color: vars.colors.foreground.accent,
    fontWeight: vars.typography.fontWeight.medium,
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    outline: 'none',
    '&:hover, &:focus-visible': {
        textDecoration: 'underline',
    },
});
const PromptChangesToggleIcon = styled('svg', {
    name: 'MuiDataGrid',
    slot: 'PromptChangesToggleIcon',
})({
    variants: [
        {
            props: {
                showChanges: true,
            },
            style: {
                transform: 'rotate(180deg)',
            },
        },
    ],
});
function GridPrompt(props) {
    const { value, response, helperText, variant, onRerun } = props;
    const rootProps = useGridRootProps();
    const [showChanges, setShowChanges] = React.useState(false);
    const ownerState = {
        classes: rootProps.classes,
        variant,
        showChanges,
    };
    const classes = useUtilityClasses(ownerState);
    const apiRef = useGridApiContext();
    const columns = useGridSelector(apiRef, gridColumnLookupSelector);
    const changesListId = useId();
    const getColumnName = React.useCallback((column) => columns[column]?.headerName ?? column, [columns]);
    const getGroupingChanges = React.useCallback((grouping) => {
        return grouping.map((group) => ({
            label: getColumnName(group.column),
            description: apiRef.current.getLocaleText('promptChangeGroupDescription')(getColumnName(group.column)),
            icon: rootProps.slots.promptGroupIcon,
        }));
    }, [apiRef, getColumnName, rootProps.slots.promptGroupIcon]);
    const getAggregationChanges = React.useCallback((aggregation) => {
        return Object.keys(aggregation).map((column) => ({
            label: apiRef.current.getLocaleText('promptChangeAggregationLabel')(getColumnName(column), aggregation[column]),
            description: apiRef.current.getLocaleText('promptChangeAggregationDescription')(getColumnName(column), aggregation[column]),
            icon: rootProps.slots.promptAggregationIcon,
        }));
    }, [apiRef, getColumnName, rootProps.slots.promptAggregationIcon]);
    const getFilterChanges = React.useCallback((filters) => {
        return filters.map((filter) => {
            const filterOperator = apiRef.current.getLocaleText(`filterOperator${capitalize(filter.operator)}`);
            let filterValue = filter.value;
            if (isSingleSelectColDef(columns[filter.column])) {
                const allOptions = getValueOptions(columns[filter.column]) ?? [];
                const colDef = columns[filter.column];
                const getOptionLabel = colDef.getOptionLabel ??
                    ((option) => (typeof option === 'object' ? option.label : String(option)));
                const getOptionValue = colDef.getOptionValue ??
                    ((option) => (typeof option === 'object' ? option.value : option));
                if (Array.isArray(filterValue)) {
                    filterValue = filterValue
                        .map((filterVal) => {
                        const option = allOptions.find((opt) => String(getOptionValue(opt)) === String(filterVal));
                        return option ? getOptionLabel(option) : String(filterVal);
                    })
                        .join(', ');
                }
                else {
                    const option = allOptions.find((opt) => String(getOptionValue(opt)) === String(filterValue));
                    filterValue = option ? getOptionLabel(option) : String(filterValue);
                }
            }
            return {
                label: apiRef.current.getLocaleText('promptChangeFilterLabel')(getColumnName(filter.column), filterOperator, filterValue),
                description: apiRef.current.getLocaleText('promptChangeFilterDescription')(getColumnName(filter.column), filterOperator, filterValue),
                icon: rootProps.slots.promptFilterIcon,
            };
        });
    }, [apiRef, columns, getColumnName, rootProps.slots.promptFilterIcon]);
    const getSortingChanges = React.useCallback((sorting) => {
        return sorting.map((sort) => ({
            label: getColumnName(sort.column),
            description: apiRef.current.getLocaleText('promptChangeSortDescription')(getColumnName(sort.column), sort.direction),
            icon: sort.direction === 'asc'
                ? rootProps.slots.promptSortAscIcon
                : rootProps.slots.promptSortDescIcon,
        }));
    }, [apiRef, getColumnName, rootProps.slots.promptSortAscIcon, rootProps.slots.promptSortDescIcon]);
    const getPivotingChanges = React.useCallback((pivoting) => {
        // Type guard, neccessary because pivoting can be an empty object
        if (!('columns' in pivoting)) {
            return [];
        }
        const changes = [
            {
                label: apiRef.current.getLocaleText('promptChangePivotEnableLabel'),
                icon: rootProps.slots.promptPivotIcon,
                description: apiRef.current.getLocaleText('promptChangePivotEnableDescription'),
            },
        ];
        if (pivoting.columns.length) {
            changes.push({
                label: apiRef.current.getLocaleText('promptChangePivotColumnsLabel')(pivoting.columns.length),
                icon: rootProps.slots.columnMenuManageColumnsIcon,
                description: pivoting.columns
                    .map((column) => apiRef.current.getLocaleText('promptChangePivotColumnsDescription')(getColumnName(column.column), column.direction))
                    .join(`, `),
            });
        }
        if (pivoting.rows.length) {
            changes.push({
                label: apiRef.current.getLocaleText('promptChangePivotRowsLabel')(pivoting.rows.length),
                icon: rootProps.slots.densityStandardIcon,
                description: pivoting.rows.map((column) => getColumnName(column)).join(`, `),
            });
        }
        if (pivoting.values.length) {
            changes.push({
                label: apiRef.current.getLocaleText('promptChangePivotValuesLabel')(pivoting.values.length),
                icon: rootProps.slots.promptAggregationIcon,
                description: pivoting.values
                    .map((aggregation) => Object.keys(aggregation).map((column) => apiRef.current.getLocaleText('promptChangePivotValuesDescription')(getColumnName(column), aggregation[column])))
                    .join(`, `),
            });
        }
        return changes;
    }, [apiRef, getColumnName, rootProps.slots]);
    const getChartChanges = React.useCallback((chart) => {
        return {
            label: apiRef.current.getLocaleText('toolbarCharts'),
            description: apiRef.current.getLocaleText('promptChangeChartsLabel')(chart.dimensions.length, chart.values.length),
            icon: rootProps.slots.promptChartsIcon,
        };
    }, [apiRef, rootProps.slots.promptChartsIcon]);
    const changeList = React.useMemo(() => {
        if (!response) {
            return [];
        }
        const changes = [];
        if (response.grouping.length) {
            changes.push(...getGroupingChanges(response.grouping));
        }
        if (response.aggregation && Object.keys(response.aggregation).length) {
            changes.push(...getAggregationChanges(response.aggregation));
        }
        if (response.filters.length) {
            changes.push(...getFilterChanges(response.filters));
        }
        if (response.sorting.length) {
            changes.push(...getSortingChanges(response.sorting));
        }
        if (response.pivoting && 'columns' in response.pivoting) {
            changes.push(...getPivotingChanges(response.pivoting));
        }
        if (response.chart) {
            changes.push(getChartChanges(response.chart));
        }
        return changes;
    }, [
        response,
        getGroupingChanges,
        getAggregationChanges,
        getFilterChanges,
        getSortingChanges,
        getPivotingChanges,
        getChartChanges,
    ]);
    return (_jsxs(PromptItem, { ownerState: ownerState, className: classes.root, children: [_jsx(PromptIconContainer, { ownerState: ownerState, className: classes.iconContainer, children: !response && variant !== 'error' ? (_jsx(rootProps.slots.baseCircularProgress, { size: 20 })) : (_jsx(PromptIcon, { as: rootProps.slots.promptIcon, ownerState: ownerState, className: classes.icon, fontSize: "small" })) }), _jsxs(PromptContent, { ownerState: ownerState, className: classes.content, children: [_jsx(PromptText, { ownerState: ownerState, className: classes.text, children: value }), _jsx(PromptFeedback, { ownerState: ownerState, className: classes.feedback, children: helperText }), changeList.length > 0 ? (_jsxs(React.Fragment, { children: [_jsxs(PromptChangesToggle, { ownerState: ownerState, className: classes.changesToggle, "aria-expanded": showChanges, "aria-controls": changesListId, onClick: () => setShowChanges(!showChanges), children: [apiRef.current.getLocaleText('promptAppliedChanges'), _jsx(PromptChangesToggleIcon, { as: rootProps.slots.promptChangesToggleIcon, ownerState: ownerState, fontSize: "small" })] }), showChanges && (_jsx(PromptChangeList, { id: changesListId, ownerState: ownerState, className: classes.changeList, children: changeList.map((change) => (_jsx(rootProps.slots.baseTooltip, { title: change.description, children: _jsx(rootProps.slots.baseChip, { label: change.label, icon: _jsx(change.icon, {}), size: "small" }) }, change.label))) }))] })) : null] }), _jsx(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('promptRerun'), enterDelay: 500, children: _jsx(rootProps.slots.baseIconButton, { size: "small", className: classes.action, onClick: onRerun, children: _jsx(rootProps.slots.promptRerunIcon, { fontSize: "small" }) }) })] }));
}
export { GridPrompt };
