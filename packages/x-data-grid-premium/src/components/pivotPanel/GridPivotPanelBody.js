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
exports.GridPivotPanelBody = GridPivotPanelBody;
var React = require("react");
var system_1 = require("@mui/system");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var composeClasses_1 = require("@mui/utils/composeClasses");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var gridPivotingSelectors_1 = require("../../hooks/features/pivoting/gridPivotingSelectors");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var GridPivotPanelField_1 = require("./GridPivotPanelField");
var collapsible_1 = require("../collapsible");
var useGridPrivateApiContext_1 = require("../../hooks/utils/useGridPrivateApiContext");
var resizablePanel_1 = require("../resizablePanel");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['pivotPanelBody'],
        availableFields: ['pivotPanelAvailableFields'],
        sections: ['pivotPanelSections'],
        scrollArea: ['pivotPanelScrollArea'],
        section: ['pivotPanelSection'],
        sectionTitle: ['pivotPanelSectionTitle'],
        fieldList: ['pivotPanelFieldList'],
        placeholder: ['pivotPanelPlaceholder'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_pro_1.getDataGridUtilityClass, classes);
};
var GridPivotPanelBodyRoot = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'PivotPanelBody',
})({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
});
var GridPivotPanelAvailableFields = (0, system_1.styled)(x_data_grid_pro_1.GridShadowScrollArea, {
    name: 'MuiDataGrid',
    slot: 'PivotPanelAvailableFields',
})({
    flex: 1,
    minHeight: 84,
    transition: internals_1.vars.transition(['background-color'], {
        duration: internals_1.vars.transitions.duration.short,
        easing: internals_1.vars.transitions.easing.easeInOut,
    }),
    '&[data-drag-over="true"]': {
        backgroundColor: internals_1.vars.colors.interactive.hover,
    },
});
var GridPivotPanelSections = (0, system_1.styled)(resizablePanel_1.ResizablePanel, {
    name: 'MuiDataGrid',
    slot: 'PivotPanelSections',
})({
    position: 'relative',
    minHeight: 158,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
});
var GridPivotPanelScrollArea = (0, system_1.styled)(x_data_grid_pro_1.GridShadowScrollArea, {
    name: 'MuiDataGrid',
    slot: 'PivotPanelScrollArea',
})({
    height: '100%',
});
var GridPivotPanelSection = (0, system_1.styled)(collapsible_1.Collapsible, {
    name: 'MuiDataGrid',
    slot: 'PivotPanelSection',
})({
    margin: internals_1.vars.spacing(0.5, 1),
    transition: internals_1.vars.transition(['border-color', 'background-color'], {
        duration: internals_1.vars.transitions.duration.short,
        easing: internals_1.vars.transitions.easing.easeInOut,
    }),
    '&[data-drag-over="true"]': {
        backgroundColor: internals_1.vars.colors.interactive.hover,
        outline: "2px solid ".concat(internals_1.vars.colors.interactive.selected),
    },
});
var GridPivotPanelSectionTitle = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'PivotPanelSectionTitle',
})({
    flex: 1,
    marginRight: internals_1.vars.spacing(1.75),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: internals_1.vars.spacing(1),
    font: internals_1.vars.typography.font.body,
    fontWeight: internals_1.vars.typography.fontWeight.medium,
});
var GridPivotPanelFieldList = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'PivotPanelFieldList',
})({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: internals_1.vars.spacing(0.5, 0),
});
var GridPivotPanelPlaceholder = (0, system_1.styled)('div', {
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
    padding: internals_1.vars.spacing(0, 1),
    color: internals_1.vars.colors.foreground.muted,
    font: internals_1.vars.typography.font.body,
});
var INITIAL_DRAG_STATE = { active: false, dropZone: null, initialModelKey: null };
function GridPivotPanelBody(_a) {
    var searchValue = _a.searchValue;
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var initialColumns = (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridPivotingSelectors_1.gridPivotInitialColumnsSelector);
    var fields = React.useMemo(function () { return Array.from(initialColumns.keys()); }, [initialColumns]);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var _b = React.useState(INITIAL_DRAG_STATE), drag = _b[0], setDrag = _b[1];
    var pivotModel = (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridPivotingSelectors_1.gridPivotModelSelector);
    var classes = useUtilityClasses(rootProps);
    var getColumnName = React.useCallback(function (field) {
        var column = initialColumns.get(field);
        return (column === null || column === void 0 ? void 0 : column.headerName) || field;
    }, [initialColumns]);
    var pivotModelFields = React.useMemo(function () {
        var pivotModelArray = pivotModel.rows.concat(pivotModel.columns, pivotModel.values);
        return new Set(pivotModelArray.map(function (item) { return item.field; }));
    }, [pivotModel]);
    var availableFields = React.useMemo(function () {
        return fields.filter(function (field) {
            var _a;
            if (pivotModelFields.has(field)) {
                return false;
            }
            if (((_a = initialColumns.get(field)) === null || _a === void 0 ? void 0 : _a.pivotable) === false) {
                return false;
            }
            if (searchValue) {
                var fieldName = getColumnName(field);
                return fieldName.toLowerCase().includes(searchValue.toLowerCase());
            }
            return true;
        });
    }, [searchValue, fields, getColumnName, pivotModelFields, initialColumns]);
    var handleDragStart = function (modelKey) {
        setDrag({ active: true, initialModelKey: modelKey, dropZone: null });
    };
    var handleDragEnd = function () {
        setDrag(INITIAL_DRAG_STATE);
    };
    var handleDrop = function (event) {
        setDrag(INITIAL_DRAG_STATE);
        // The drop event was already handled by a child
        if (event.defaultPrevented) {
            return;
        }
        event.preventDefault();
        var _a = JSON.parse(event.dataTransfer.getData('text/plain')), field = _a.field, originSection = _a.modelKey;
        var targetSection = event.currentTarget.getAttribute('data-section');
        if (originSection === targetSection) {
            return;
        }
        apiRef.current.updatePivotModel({ field: field, targetSection: targetSection, originSection: originSection });
    };
    var handleDragOver = React.useCallback(function (event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);
    var handleDragEnter = React.useCallback(function (event) {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            var dropZone_1 = event.currentTarget.getAttribute('data-section');
            setDrag(function (v) { return (__assign(__assign({}, v), { active: true, dropZone: dropZone_1 })); });
        }
    }, []);
    var handleDragLeave = React.useCallback(function (event) {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setDrag(function (v) { return (__assign(__assign({}, v), { active: true, dropZone: v.initialModelKey })); });
        }
    }, []);
    var rowsLabel = apiRef.current.getLocaleText('pivotRows');
    var columnsLabel = apiRef.current.getLocaleText('pivotColumns');
    var valuesLabel = apiRef.current.getLocaleText('pivotValues');
    return (<GridPivotPanelBodyRoot ownerState={rootProps} className={classes.root} data-dragging={drag.active} onDragLeave={handleDragLeave}>
      <GridPivotPanelAvailableFields ownerState={rootProps} className={classes.availableFields} onDrop={handleDrop} onDragEnter={handleDragEnter} onDragOver={handleDragOver} data-section={null} data-drag-over={drag.active && drag.dropZone === null}>
        {availableFields.length === 0 && (<GridPivotPanelPlaceholder ownerState={rootProps} className={classes.placeholder}>
            {apiRef.current.getLocaleText('pivotNoFields')}
          </GridPivotPanelPlaceholder>)}
        {availableFields.length > 0 && (<GridPivotPanelFieldList ownerState={rootProps} className={classes.fieldList}>
            {availableFields.map(function (field) { return (<GridPivotPanelField_1.GridPivotPanelField key={field} field={field} modelKey={null} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                {getColumnName(field)}
              </GridPivotPanelField_1.GridPivotPanelField>); })}
          </GridPivotPanelFieldList>)}
      </GridPivotPanelAvailableFields>

      <GridPivotPanelSections ownerState={rootProps} className={classes.sections} direction="vertical">
        <resizablePanel_1.ResizablePanelHandle />
        <GridPivotPanelScrollArea ownerState={rootProps} className={classes.scrollArea}>
          <GridPivotPanelSection ownerState={rootProps} className={classes.section} onDrop={handleDrop} onDragEnter={handleDragEnter} onDragOver={handleDragOver} data-section="rows" data-drag-over={drag.dropZone === 'rows'}>
            <collapsible_1.CollapsibleTrigger aria-label={apiRef.current.getLocaleText('pivotRows')}>
              <GridPivotPanelSectionTitle ownerState={rootProps} className={classes.sectionTitle}>
                {rowsLabel}
                {pivotModel.rows.length > 0 && (<rootProps.slots.baseBadge badgeContent={pivotModel.rows.length}/>)}
              </GridPivotPanelSectionTitle>
            </collapsible_1.CollapsibleTrigger>
            <collapsible_1.CollapsiblePanel>
              {pivotModel.rows.length === 0 && (<GridPivotPanelPlaceholder ownerState={rootProps} className={classes.placeholder}>
                  {apiRef.current.getLocaleText('pivotDragToRows')}
                </GridPivotPanelPlaceholder>)}
              {pivotModel.rows.length > 0 && (<GridPivotPanelFieldList ownerState={rootProps} className={classes.fieldList}>
                  {pivotModel.rows.map(function (modelValue) { return (<GridPivotPanelField_1.GridPivotPanelField key={modelValue.field} field={modelValue.field} modelKey="rows" modelValue={modelValue} data-field={modelValue.field} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                      {getColumnName(modelValue.field)}
                    </GridPivotPanelField_1.GridPivotPanelField>); })}
                </GridPivotPanelFieldList>)}
            </collapsible_1.CollapsiblePanel>
          </GridPivotPanelSection>

          <GridPivotPanelSection ownerState={rootProps} className={classes.section} onDrop={handleDrop} onDragEnter={handleDragEnter} onDragOver={handleDragOver} data-section="columns" data-drag-over={drag.dropZone === 'columns'}>
            <collapsible_1.CollapsibleTrigger aria-label={apiRef.current.getLocaleText('pivotColumns')}>
              <GridPivotPanelSectionTitle ownerState={rootProps} className={classes.sectionTitle}>
                {columnsLabel}
                {pivotModel.columns.length > 0 && (<rootProps.slots.baseBadge badgeContent={pivotModel.columns.length}/>)}
              </GridPivotPanelSectionTitle>
            </collapsible_1.CollapsibleTrigger>
            <collapsible_1.CollapsiblePanel>
              {pivotModel.columns.length === 0 && (<GridPivotPanelPlaceholder ownerState={rootProps} className={classes.placeholder}>
                  {apiRef.current.getLocaleText('pivotDragToColumns')}
                </GridPivotPanelPlaceholder>)}
              {pivotModel.columns.length > 0 && (<GridPivotPanelFieldList ownerState={rootProps} className={classes.fieldList}>
                  {pivotModel.columns.map(function (modelValue) { return (<GridPivotPanelField_1.GridPivotPanelField key={modelValue.field} field={modelValue.field} modelKey="columns" modelValue={modelValue} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                      {getColumnName(modelValue.field)}
                    </GridPivotPanelField_1.GridPivotPanelField>); })}
                </GridPivotPanelFieldList>)}
            </collapsible_1.CollapsiblePanel>
          </GridPivotPanelSection>

          <GridPivotPanelSection ownerState={rootProps} className={classes.section} onDrop={handleDrop} onDragEnter={handleDragEnter} onDragOver={handleDragOver} data-section="values" data-drag-over={drag.dropZone === 'values'}>
            <collapsible_1.CollapsibleTrigger aria-label={apiRef.current.getLocaleText('pivotValues')}>
              <GridPivotPanelSectionTitle ownerState={rootProps} className={classes.sectionTitle}>
                {valuesLabel}
                {pivotModel.values.length > 0 && (<rootProps.slots.baseBadge badgeContent={pivotModel.values.length}/>)}
              </GridPivotPanelSectionTitle>
            </collapsible_1.CollapsibleTrigger>
            <collapsible_1.CollapsiblePanel>
              {pivotModel.values.length === 0 && (<GridPivotPanelPlaceholder ownerState={rootProps} className={classes.placeholder}>
                  {apiRef.current.getLocaleText('pivotDragToValues')}
                </GridPivotPanelPlaceholder>)}
              {pivotModel.values.length > 0 && (<GridPivotPanelFieldList ownerState={rootProps} className={classes.fieldList}>
                  {pivotModel.values.map(function (modelValue) { return (<GridPivotPanelField_1.GridPivotPanelField key={modelValue.field} field={modelValue.field} modelKey="values" modelValue={modelValue} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                      {getColumnName(modelValue.field)}
                    </GridPivotPanelField_1.GridPivotPanelField>); })}
                </GridPivotPanelFieldList>)}
            </collapsible_1.CollapsiblePanel>
          </GridPivotPanelSection>
        </GridPivotPanelScrollArea>
      </GridPivotPanelSections>
    </GridPivotPanelBodyRoot>);
}
