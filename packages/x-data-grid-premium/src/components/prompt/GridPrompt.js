"use strict";
'use client';
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridPrompt = GridPrompt;
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var composeClasses_1 = require("@mui/utils/composeClasses");
var capitalize_1 = require("@mui/utils/capitalize");
var system_1 = require("@mui/system");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var useId_1 = require("@mui/utils/useId");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
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
    return (0, composeClasses_1.default)(slots, x_data_grid_pro_1.getDataGridUtilityClass, classes);
};
var fadeIn = (0, system_1.keyframes)({
    from: {
        opacity: 0,
    },
    to: {
        opacity: 1,
    },
});
var fadeInUp = (0, system_1.keyframes)({
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
var PromptItem = (0, system_1.styled)('li', {
    name: 'MuiDataGrid',
    slot: 'Prompt',
})(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  padding: ", ";\n  align-items: flex-start;\n  overflow: hidden;\n  .", " {\n    opacity: 0;\n    transition: ", ";\n  }\n  &:hover .", ", & .", ":focus-visible {\n    opacity: 1;\n  }\n  @media (prefers-reduced-motion: no-preference) {\n    animation: ", " ", " ", ";\n  }\n"], ["\n  display: flex;\n  padding: ", ";\n  align-items: flex-start;\n  overflow: hidden;\n  .", " {\n    opacity: 0;\n    transition: ", ";\n  }\n  &:hover .", ", & .", ":focus-visible {\n    opacity: 1;\n  }\n  @media (prefers-reduced-motion: no-preference) {\n    animation: ", " ", " ", ";\n  }\n"])), internals_1.vars.spacing(1, 1.25), x_data_grid_pro_1.gridClasses.promptAction, internals_1.vars.transition(['opacity'], { duration: internals_1.vars.transitions.duration.short }), x_data_grid_pro_1.gridClasses.promptAction, x_data_grid_pro_1.gridClasses.promptAction, fadeInUp, internals_1.vars.transitions.duration.long, internals_1.vars.transitions.easing.easeInOut);
var PromptContent = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'PromptContent',
})({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    overflow: 'hidden',
});
var PromptText = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'PromptText',
})({
    font: internals_1.vars.typography.font.body,
});
var PromptIconContainer = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'PromptIconContainer',
})({
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    marginRight: internals_1.vars.spacing(1.5),
});
// This `styled()` function invokes keyframes. `styled-components` only supports keyframes
// in string templates. Do not convert these styles in JS object as it will break.
var PromptIcon = (0, system_1.styled)('svg', {
    name: 'MuiDataGrid',
    slot: 'PromptIcon',
})(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: ", ";\n  @media (prefers-reduced-motion: no-preference) {\n    animation: ", " ", " ", ";\n  }\n"], ["\n  color: ", ";\n  @media (prefers-reduced-motion: no-preference) {\n    animation: ", " ", " ", ";\n  }\n"])), function (_a) {
    var ownerState = _a.ownerState;
    return ownerState.variant === 'error' ? internals_1.vars.colors.foreground.error : internals_1.vars.colors.foreground.muted;
}, fadeIn, internals_1.vars.transitions.duration.short, internals_1.vars.transitions.easing.easeInOut);
var PromptFeedback = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'PromptFeedback',
})({
    font: internals_1.vars.typography.font.small,
    color: internals_1.vars.colors.foreground.muted,
    variants: [
        {
            props: {
                variant: 'error',
            },
            style: {
                color: internals_1.vars.colors.foreground.error,
            },
        },
    ],
});
var PromptChangeList = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'PromptChangeList',
})({
    display: 'flex',
    flexWrap: 'wrap',
    gap: internals_1.vars.spacing(0.5),
    width: '100%',
    marginTop: internals_1.vars.spacing(1),
    overflow: 'hidden',
});
var PromptChangesToggle = (0, system_1.styled)('button', {
    name: 'MuiDataGrid',
    slot: 'PromptChangesToggle',
})({
    display: 'flex',
    alignItems: 'center',
    gap: internals_1.vars.spacing(0.25),
    padding: 0,
    font: internals_1.vars.typography.font.small,
    color: internals_1.vars.colors.foreground.accent,
    fontWeight: internals_1.vars.typography.fontWeight.medium,
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    outline: 'none',
    '&:hover, &:focus-visible': {
        textDecoration: 'underline',
    },
});
var PromptChangesToggleIcon = (0, system_1.styled)('svg', {
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
    var value = props.value, response = props.response, helperText = props.helperText, variant = props.variant, onRerun = props.onRerun;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var _a = React.useState(false), showChanges = _a[0], setShowChanges = _a[1];
    var ownerState = {
        classes: rootProps.classes,
        variant: variant,
        showChanges: showChanges,
    };
    var classes = useUtilityClasses(ownerState);
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var columns = (0, x_data_grid_pro_1.useGridSelector)(apiRef, x_data_grid_pro_1.gridColumnLookupSelector);
    var changesListId = (0, useId_1.default)();
    var getColumnName = React.useCallback(function (column) { var _a, _b; return (_b = (_a = columns[column]) === null || _a === void 0 ? void 0 : _a.headerName) !== null && _b !== void 0 ? _b : column; }, [columns]);
    var getGroupingChanges = React.useCallback(function (grouping) {
        return grouping.map(function (group) { return ({
            label: getColumnName(group.column),
            description: apiRef.current.getLocaleText('promptChangeGroupDescription')(getColumnName(group.column)),
            icon: rootProps.slots.promptGroupIcon,
        }); });
    }, [apiRef, getColumnName, rootProps.slots.promptGroupIcon]);
    var getAggregationChanges = React.useCallback(function (aggregation) {
        return Object.keys(aggregation).map(function (column) { return ({
            label: apiRef.current.getLocaleText('promptChangeAggregationLabel')(getColumnName(column), aggregation[column]),
            description: apiRef.current.getLocaleText('promptChangeAggregationDescription')(getColumnName(column), aggregation[column]),
            icon: rootProps.slots.promptAggregationIcon,
        }); });
    }, [apiRef, getColumnName, rootProps.slots.promptAggregationIcon]);
    var getFilterChanges = React.useCallback(function (filters) {
        return filters.map(function (filter) {
            var _a, _b, _c;
            var filterOperator = apiRef.current.getLocaleText("filterOperator".concat((0, capitalize_1.default)(filter.operator)));
            var filterValue = filter.value;
            if ((0, internals_1.isSingleSelectColDef)(columns[filter.column])) {
                var allOptions_1 = (_a = (0, internals_1.getValueOptions)(columns[filter.column])) !== null && _a !== void 0 ? _a : [];
                var colDef = columns[filter.column];
                var getOptionLabel_1 = (_b = colDef.getOptionLabel) !== null && _b !== void 0 ? _b : (function (option) { return (typeof option === 'object' ? option.label : String(option)); });
                var getOptionValue_1 = (_c = colDef.getOptionValue) !== null && _c !== void 0 ? _c : (function (option) { return (typeof option === 'object' ? option.value : option); });
                if (Array.isArray(filterValue)) {
                    filterValue = filterValue
                        .map(function (filterVal) {
                        var option = allOptions_1.find(function (opt) { return String(getOptionValue_1(opt)) === String(filterVal); });
                        return option ? getOptionLabel_1(option) : String(filterVal);
                    })
                        .join(', ');
                }
                else {
                    var option = allOptions_1.find(function (opt) { return String(getOptionValue_1(opt)) === String(filterValue); });
                    filterValue = option ? getOptionLabel_1(option) : String(filterValue);
                }
            }
            return {
                label: apiRef.current.getLocaleText('promptChangeFilterLabel')(getColumnName(filter.column), filterOperator, filterValue),
                description: apiRef.current.getLocaleText('promptChangeFilterDescription')(getColumnName(filter.column), filterOperator, filterValue),
                icon: rootProps.slots.promptFilterIcon,
            };
        });
    }, [apiRef, columns, getColumnName, rootProps.slots.promptFilterIcon]);
    var getSortingChanges = React.useCallback(function (sorting) {
        return sorting.map(function (sort) { return ({
            label: getColumnName(sort.column),
            description: apiRef.current.getLocaleText('promptChangeSortDescription')(getColumnName(sort.column), sort.direction),
            icon: sort.direction === 'asc'
                ? rootProps.slots.promptSortAscIcon
                : rootProps.slots.promptSortDescIcon,
        }); });
    }, [apiRef, getColumnName, rootProps.slots.promptSortAscIcon, rootProps.slots.promptSortDescIcon]);
    var getPivotingChanges = React.useCallback(function (pivoting) {
        // Type guard, neccessary because pivoting can be an empty object
        if (!('columns' in pivoting)) {
            return [];
        }
        var changes = [
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
                    .map(function (column) {
                    return apiRef.current.getLocaleText('promptChangePivotColumnsDescription')(getColumnName(column.column), column.direction);
                })
                    .join(", "),
            });
        }
        if (pivoting.rows.length) {
            changes.push({
                label: apiRef.current.getLocaleText('promptChangePivotRowsLabel')(pivoting.rows.length),
                icon: rootProps.slots.densityStandardIcon,
                description: pivoting.rows.map(function (column) { return getColumnName(column); }).join(", "),
            });
        }
        if (pivoting.values.length) {
            changes.push({
                label: apiRef.current.getLocaleText('promptChangePivotValuesLabel')(pivoting.values.length),
                icon: rootProps.slots.promptAggregationIcon,
                description: pivoting.values
                    .map(function (aggregation) {
                    return Object.keys(aggregation).map(function (column) {
                        return apiRef.current.getLocaleText('promptChangePivotValuesDescription')(getColumnName(column), aggregation[column]);
                    });
                })
                    .join(", "),
            });
        }
        return changes;
    }, [apiRef, getColumnName, rootProps.slots]);
    var changeList = React.useMemo(function () {
        if (!response) {
            return [];
        }
        var changes = [];
        if (response.grouping.length) {
            changes.push.apply(changes, getGroupingChanges(response.grouping));
        }
        if (response.aggregation && Object.keys(response.aggregation).length) {
            changes.push.apply(changes, getAggregationChanges(response.aggregation));
        }
        if (response.filters.length) {
            changes.push.apply(changes, getFilterChanges(response.filters));
        }
        if (response.sorting.length) {
            changes.push.apply(changes, getSortingChanges(response.sorting));
        }
        if (response.pivoting && 'columns' in response.pivoting) {
            changes.push.apply(changes, getPivotingChanges(response.pivoting));
        }
        return changes;
    }, [
        response,
        getGroupingChanges,
        getAggregationChanges,
        getFilterChanges,
        getSortingChanges,
        getPivotingChanges,
    ]);
    return (<PromptItem ownerState={ownerState} className={classes.root}>
      <PromptIconContainer ownerState={ownerState} className={classes.iconContainer}>
        {!response && variant !== 'error' ? (<rootProps.slots.baseCircularProgress size={20}/>) : (<PromptIcon as={rootProps.slots.promptIcon} ownerState={ownerState} className={classes.icon} fontSize="small"/>)}
      </PromptIconContainer>
      <PromptContent ownerState={ownerState} className={classes.content}>
        <PromptText ownerState={ownerState} className={classes.text}>
          {value}
        </PromptText>
        <PromptFeedback ownerState={ownerState} className={classes.feedback}>
          {helperText}
        </PromptFeedback>
        {changeList.length > 0 ? (<React.Fragment>
            <PromptChangesToggle ownerState={ownerState} className={classes.changesToggle} aria-expanded={showChanges} aria-controls={changesListId} onClick={function () { return setShowChanges(!showChanges); }}>
              {apiRef.current.getLocaleText('promptAppliedChanges')}
              <PromptChangesToggleIcon as={rootProps.slots.promptChangesToggleIcon} ownerState={ownerState} fontSize="small"/>
            </PromptChangesToggle>
            {showChanges && (<PromptChangeList id={changesListId} ownerState={ownerState} className={classes.changeList}>
                {changeList.map(function (change) { return (<rootProps.slots.baseTooltip key={change.label} title={change.description}>
                    <rootProps.slots.baseChip label={change.label} icon={<change.icon />} size="small"/>
                  </rootProps.slots.baseTooltip>); })}
              </PromptChangeList>)}
          </React.Fragment>) : null}
      </PromptContent>
      <rootProps.slots.baseTooltip title={apiRef.current.getLocaleText('promptRerun')} enterDelay={500}>
        <rootProps.slots.baseIconButton size="small" className={classes.action} onClick={onRerun}>
          <rootProps.slots.promptRerunIcon fontSize="small"/>
        </rootProps.slots.baseIconButton>
      </rootProps.slots.baseTooltip>
    </PromptItem>);
}
var templateObject_1, templateObject_2;
