"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridMainContainer = void 0;
var React = require("react");
var system_1 = require("@mui/system");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var useGridConfiguration_1 = require("../../hooks/utils/useGridConfiguration");
var GridPanelAnchor = (0, system_1.styled)('div')({
    position: 'absolute',
    top: "var(--DataGrid-headersTotalHeight)",
    left: 0,
    width: 'calc(100% - (var(--DataGrid-hasScrollY) * var(--DataGrid-scrollbarSize)))',
});
var Element = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'Main',
    overridesResolver: function (props, styles) {
        var ownerState = props.ownerState, loadingOverlayVariant = props.loadingOverlayVariant, overlayType = props.overlayType;
        var hideContent = loadingOverlayVariant === 'skeleton' || overlayType === 'noColumnsOverlay';
        return [
            styles.main,
            ownerState.hasPinnedRight && styles['main--hasPinnedRight'],
            hideContent && styles['main--hiddenContent'],
        ];
    },
})({
    flexGrow: 1,
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
});
exports.GridMainContainer = (0, forwardRef_1.forwardRef)(function (props, ref) {
    var _a;
    var ownerState = props.ownerState;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var configuration = (0, useGridConfiguration_1.useGridConfiguration)();
    var ariaAttributes = configuration.hooks.useGridAriaAttributes();
    return (<Element ownerState={ownerState} className={props.className} tabIndex={-1} {...ariaAttributes} {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.main} ref={ref}>
      <GridPanelAnchor role="presentation" data-id="gridPanelAnchor"/>
      {props.children}
    </Element>);
});
