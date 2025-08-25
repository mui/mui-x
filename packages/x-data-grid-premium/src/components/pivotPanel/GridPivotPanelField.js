"use strict";
'use client';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridPivotPanelField = GridPivotPanelField;
var React = require("react");
var system_1 = require("@mui/system");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var composeClasses_1 = require("@mui/utils/composeClasses");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var useId_1 = require("@mui/utils/useId");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var gridAggregationUtils_1 = require("../../hooks/features/aggregation/gridAggregationUtils");
var GridPivotPanelFieldMenu_1 = require("./GridPivotPanelFieldMenu");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var gridPivotingSelectors_1 = require("../../hooks/features/pivoting/gridPivotingSelectors");
var useGridPrivateApiContext_1 = require("../../hooks/utils/useGridPrivateApiContext");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes, modelKey = ownerState.modelKey;
    var sorted = modelKey === 'columns' && ownerState.modelValue.sort;
    var slots = {
        root: ['pivotPanelField', sorted && 'pivotPanelField--sorted'],
        name: ['pivotPanelFieldName'],
        actionContainer: ['pivotPanelFieldActionContainer'],
        dragIcon: ['pivotPanelFieldDragIcon'],
        checkbox: ['pivotPanelFieldCheckbox'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_pro_1.getDataGridUtilityClass, classes);
};
var GridPivotPanelFieldRoot = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'PivotPanelField',
    overridesResolver: function (props, styles) {
        var _a;
        return [
            (_a = {}, _a["&.".concat(x_data_grid_pro_1.gridClasses['pivotPanelField--sorted'])] = styles['pivotPanelField--sorted'], _a),
            styles.pivotPanelField,
        ];
    },
})({
    flexShrink: 0,
    position: 'relative',
    padding: internals_1.vars.spacing(0, 1, 0, 2),
    height: 32,
    display: 'flex',
    alignItems: 'center',
    gap: internals_1.vars.spacing(0.5),
    borderWidth: 0,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderStyle: 'solid',
    borderColor: 'transparent',
    margin: '-1px 0', // collapse vertical borders
    cursor: 'grab',
    variants: [
        { props: { dropPosition: 'top' }, style: { borderTopColor: internals_1.vars.colors.interactive.selected } },
        {
            props: { dropPosition: 'bottom' },
            style: { borderBottomColor: internals_1.vars.colors.interactive.selected },
        },
        {
            props: { section: null },
            style: { borderTopColor: 'transparent', borderBottomColor: 'transparent' },
        },
    ],
    '&:hover': {
        backgroundColor: internals_1.vars.colors.interactive.hover,
    },
});
var GridPivotPanelFieldName = (0, system_1.styled)('span', {
    name: 'MuiDataGrid',
    slot: 'PivotPanelFieldName',
})({
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
});
var GridPivotPanelFieldActionContainer = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'PivotPanelFieldActionContainer',
})({
    display: 'flex',
    alignItems: 'center',
});
var GridPivotPanelFieldDragIcon = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'PivotPanelFieldDragIcon',
})({
    position: 'absolute',
    left: -1,
    width: 16,
    display: 'flex',
    justifyContent: 'center',
    color: internals_1.vars.colors.foreground.base,
    opacity: 0,
    '[draggable="true"]:hover > &': {
        opacity: 0.3,
    },
});
var GridPivotPanelFieldCheckbox = (0, system_1.styled)((internals_1.NotRendered), {
    name: 'MuiDataGrid',
    slot: 'PivotPanelFieldCheckbox',
})({
    flex: 1,
    position: 'relative',
    margin: internals_1.vars.spacing(0, 0, 0, -1),
    cursor: 'grab',
});
function AggregationSelect(_a) {
    var _b, _c, _d;
    var aggFunc = _a.aggFunc, field = _a.field;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var _e = React.useState(false), aggregationMenuOpen = _e[0], setAggregationMenuOpen = _e[1];
    var aggregationMenuTriggerRef = React.useRef(null);
    var aggregationMenuTriggerId = (0, useId_1.default)();
    var aggregationMenuId = (0, useId_1.default)();
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var initialColumns = (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridPivotingSelectors_1.gridPivotInitialColumnsSelector);
    var colDef = initialColumns.get(field);
    var availableAggregationFunctions = React.useMemo(function () {
        return (0, gridAggregationUtils_1.getAvailableAggregationFunctions)({
            aggregationFunctions: rootProps.aggregationFunctions,
            colDef: colDef,
            isDataSource: false,
        });
    }, [colDef, rootProps.aggregationFunctions]);
    var handleClick = function (func) {
        apiRef.current.setPivotModel(function (prev) {
            return __assign(__assign({}, prev), { values: prev.values.map(function (col) {
                    if (col.field === field) {
                        return __assign(__assign({}, col), { aggFunc: func });
                    }
                    return col;
                }) });
        });
        setAggregationMenuOpen(false);
    };
    return (<React.Fragment>
      <rootProps.slots.baseChip label={(_c = (_b = rootProps.aggregationFunctions[aggFunc]) === null || _b === void 0 ? void 0 : _b.label) !== null && _c !== void 0 ? _c : aggFunc} size="small" variant="outlined" ref={aggregationMenuTriggerRef} id={aggregationMenuTriggerId} aria-haspopup="true" aria-controls={aggregationMenuOpen ? aggregationMenuId : undefined} aria-expanded={aggregationMenuOpen ? 'true' : undefined} onClick={function () { return setAggregationMenuOpen(!aggregationMenuOpen); }}/>
      <x_data_grid_pro_1.GridMenu open={aggregationMenuOpen} onClose={function () { return setAggregationMenuOpen(false); }} target={aggregationMenuTriggerRef.current} position="bottom-start">
        <rootProps.slots.baseMenuList id={aggregationMenuId} aria-labelledby={aggregationMenuTriggerId} autoFocusItem {...(_d = rootProps.slotProps) === null || _d === void 0 ? void 0 : _d.baseMenuList}>
          {availableAggregationFunctions.map(function (func) {
            var _a, _b, _c;
            return (<rootProps.slots.baseMenuItem key={func} selected={aggFunc === func} onClick={function () { return handleClick(func); }} {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseMenuItem}>
              {(_c = (_b = rootProps.aggregationFunctions[func]) === null || _b === void 0 ? void 0 : _b.label) !== null && _c !== void 0 ? _c : func}
            </rootProps.slots.baseMenuItem>);
        })}
        </rootProps.slots.baseMenuList>
      </x_data_grid_pro_1.GridMenu>
    </React.Fragment>);
}
function GridPivotPanelField(props) {
    var _a;
    var children = props.children, field = props.field, onDragStart = props.onDragStart, onDragEnd = props.onDragEnd;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var _b = React.useState(null), dropPosition = _b[0], setDropPosition = _b[1];
    var section = props.modelKey;
    var ownerState = __assign(__assign({}, props), { classes: rootProps.classes, dropPosition: dropPosition, section: section });
    var classes = useUtilityClasses(ownerState);
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var handleDragStart = React.useCallback(function (event) {
        var data = { field: field, modelKey: section };
        event.dataTransfer.setData('text/plain', JSON.stringify(data));
        event.dataTransfer.dropEffect = 'move';
        onDragStart(section);
    }, [field, onDragStart, section]);
    var getDropPosition = React.useCallback(function (event) {
        var rect = event.target.getBoundingClientRect();
        var y = event.clientY - rect.top;
        if (y < rect.height / 2) {
            return 'top';
        }
        return 'bottom';
    }, []);
    var handleDragOver = React.useCallback(function (event) {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setDropPosition(getDropPosition(event));
        }
    }, [getDropPosition]);
    var handleDragLeave = React.useCallback(function (event) {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setDropPosition(null);
        }
    }, []);
    var handleDrop = React.useCallback(function (event) {
        setDropPosition(null);
        if (!event.currentTarget.contains(event.relatedTarget)) {
            event.preventDefault();
            var position = getDropPosition(event);
            var _a = JSON.parse(event.dataTransfer.getData('text/plain')), droppedField = _a.field, originSection = _a.modelKey;
            apiRef.current.updatePivotModel({
                field: droppedField,
                targetField: field,
                targetFieldPosition: position,
                originSection: originSection,
                targetSection: section,
            });
        }
    }, [getDropPosition, apiRef, field, section]);
    var handleSort = function () {
        var currentSort = section === 'columns' ? props.modelValue.sort : null;
        var newValue;
        if (currentSort === 'asc') {
            newValue = 'desc';
        }
        else if (currentSort === 'desc') {
            newValue = undefined;
        }
        else {
            newValue = 'asc';
        }
        apiRef.current.setPivotModel(function (prev) {
            return __assign(__assign({}, prev), { columns: prev.columns.map(function (col) {
                    if (col.field === field) {
                        return __assign(__assign({}, col), { sort: newValue });
                    }
                    return col;
                }) });
        });
    };
    var handleVisibilityChange = function (event) {
        if (section) {
            apiRef.current.setPivotModel(function (prev) {
                var _a;
                return __assign(__assign({}, prev), (_a = {}, _a[section] = prev[section].map(function (col) {
                    if (col.field === field) {
                        return __assign(__assign({}, col), { hidden: !event.target.checked });
                    }
                    return col;
                }), _a));
            });
        }
    };
    var hideable = section !== null;
    return (<GridPivotPanelFieldRoot ownerState={ownerState} className={classes.root} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onDragStart={handleDragStart} onDragEnd={onDragEnd} draggable="true">
      <GridPivotPanelFieldDragIcon ownerState={ownerState} className={classes.dragIcon}>
        <rootProps.slots.columnReorderIcon fontSize="small"/>
      </GridPivotPanelFieldDragIcon>

      {hideable ? (<GridPivotPanelFieldCheckbox ownerState={ownerState} className={classes.checkbox} as={rootProps.slots.baseCheckbox} size="small" density="compact" {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseCheckbox} checked={!props.modelValue.hidden || false} onChange={handleVisibilityChange} label={children}/>) : (<GridPivotPanelFieldName ownerState={ownerState} className={classes.name}>
          {children}
        </GridPivotPanelFieldName>)}

      <GridPivotPanelFieldActionContainer ownerState={ownerState} className={classes.actionContainer}>
        {section === 'columns' && (<internals_1.GridColumnSortButton field={field} direction={props.modelValue.sort} sortingOrder={rootProps.sortingOrder} onClick={handleSort}/>)}
        {section === 'values' && (<AggregationSelect aggFunc={props.modelValue.aggFunc} field={field}/>)}
        <GridPivotPanelFieldMenu_1.GridPivotPanelFieldMenu field={field} modelKey={section}/>
      </GridPivotPanelFieldActionContainer>
    </GridPivotPanelFieldRoot>);
}
