"use strict";
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
exports.GridColumnHeaderFilterIconButton = GridColumnHeaderFilterIconButtonWrapped;
var React = require("react");
var prop_types_1 = require("prop-types");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useId_1 = require("@mui/utils/useId");
var hooks_1 = require("../../hooks");
var gridPreferencePanelSelector_1 = require("../../hooks/features/preferencesPanel/gridPreferencePanelSelector");
var gridPreferencePanelsValue_1 = require("../../hooks/features/preferencesPanel/gridPreferencePanelsValue");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var gridClasses_1 = require("../../constants/gridClasses");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var GridIconButtonContainer_1 = require("./GridIconButtonContainer");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        icon: ['filterIcon'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
function GridColumnHeaderFilterIconButtonWrapped(props) {
    if (!props.counter) {
        return null;
    }
    return <GridColumnHeaderFilterIconButton {...props}/>;
}
GridColumnHeaderFilterIconButtonWrapped.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    counter: prop_types_1.default.number,
    field: prop_types_1.default.string.isRequired,
    onClick: prop_types_1.default.func,
};
function GridColumnHeaderFilterIconButton(props) {
    var _a, _b;
    var counter = props.counter, field = props.field, onClick = props.onClick;
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var ownerState = __assign(__assign({}, props), { classes: rootProps.classes });
    var classes = useUtilityClasses(ownerState);
    var labelId = (0, useId_1.default)();
    var isOpen = (0, hooks_1.useGridSelector)(apiRef, gridPreferencePanelSelector_1.gridPreferencePanelSelectorWithLabel, labelId);
    var panelId = (0, useId_1.default)();
    var toggleFilter = React.useCallback(function (event) {
        event.preventDefault();
        event.stopPropagation();
        var _a = (0, gridPreferencePanelSelector_1.gridPreferencePanelStateSelector)(apiRef), open = _a.open, openedPanelValue = _a.openedPanelValue;
        if (open && openedPanelValue === gridPreferencePanelsValue_1.GridPreferencePanelsValue.filters) {
            apiRef.current.hideFilterPanel();
        }
        else {
            apiRef.current.showFilterPanel(undefined, panelId, labelId);
        }
        if (onClick) {
            onClick(apiRef.current.getColumnHeaderParams(field), event);
        }
    }, [apiRef, field, onClick, panelId, labelId]);
    if (!counter) {
        return null;
    }
    var iconButton = (<rootProps.slots.baseIconButton id={labelId} onClick={toggleFilter} aria-label={apiRef.current.getLocaleText('columnHeaderFiltersLabel')} size="small" tabIndex={-1} aria-haspopup="menu" aria-expanded={isOpen} aria-controls={isOpen ? panelId : undefined} {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseIconButton}>
      <rootProps.slots.columnFilteredIcon className={classes.icon} fontSize="small"/>
    </rootProps.slots.baseIconButton>);
    return (<rootProps.slots.baseTooltip title={apiRef.current.getLocaleText('columnHeaderFiltersTooltipActive')(counter)} enterDelay={1000} {...(_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseTooltip}>
      <GridIconButtonContainer_1.GridIconButtonContainer>
        {counter > 1 && (<rootProps.slots.baseBadge badgeContent={counter} color="default">
            {iconButton}
          </rootProps.slots.baseBadge>)}

        {counter === 1 && iconButton}
      </GridIconButtonContainer_1.GridIconButtonContainer>
    </rootProps.slots.baseTooltip>);
}
GridColumnHeaderFilterIconButton.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    counter: prop_types_1.default.number,
    field: prop_types_1.default.string.isRequired,
    onClick: prop_types_1.default.func,
};
