"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickersModalDialog = PickersModalDialog;
var React = require("react");
var DialogContent_1 = require("@mui/material/DialogContent");
var Fade_1 = require("@mui/material/Fade");
var Dialog_1 = require("@mui/material/Dialog");
var styles_1 = require("@mui/material/styles");
var dimensions_1 = require("../constants/dimensions");
var hooks_1 = require("../../hooks");
var usePickerPrivateContext_1 = require("../hooks/usePickerPrivateContext");
var PickersModalDialogRoot = (0, styles_1.styled)(Dialog_1.default)((_a = {},
    _a["& .".concat(Dialog_1.dialogClasses.container)] = {
        outline: 0,
    },
    _a["& .".concat(Dialog_1.dialogClasses.paper)] = {
        outline: 0,
        minWidth: dimensions_1.DIALOG_WIDTH,
    },
    _a));
var PickersModalDialogContent = (0, styles_1.styled)(DialogContent_1.default)({
    '&:first-of-type': {
        padding: 0,
    },
});
function PickersModalDialog(props) {
    var _a, _b;
    var children = props.children, slots = props.slots, slotProps = props.slotProps;
    var open = (0, hooks_1.usePickerContext)().open;
    var _c = (0, usePickerPrivateContext_1.usePickerPrivateContext)(), dismissViews = _c.dismissViews, onPopperExited = _c.onPopperExited;
    var Dialog = (_a = slots === null || slots === void 0 ? void 0 : slots.dialog) !== null && _a !== void 0 ? _a : PickersModalDialogRoot;
    var Transition = (_b = slots === null || slots === void 0 ? void 0 : slots.mobileTransition) !== null && _b !== void 0 ? _b : Fade_1.default;
    return (<Dialog open={open} onClose={function () {
            dismissViews();
            onPopperExited === null || onPopperExited === void 0 ? void 0 : onPopperExited();
        }} {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.dialog} TransitionComponent={Transition} TransitionProps={slotProps === null || slotProps === void 0 ? void 0 : slotProps.mobileTransition} PaperComponent={slots === null || slots === void 0 ? void 0 : slots.mobilePaper} PaperProps={slotProps === null || slotProps === void 0 ? void 0 : slotProps.mobilePaper}>
      <PickersModalDialogContent>{children}</PickersModalDialogContent>
    </Dialog>);
}
