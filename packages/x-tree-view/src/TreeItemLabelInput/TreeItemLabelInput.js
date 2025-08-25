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
exports.TreeItemLabelInput = void 0;
var zero_styled_1 = require("../internals/zero-styled");
/**
 * @ignore - internal component.
 */
var TreeItemLabelInput = (0, zero_styled_1.styled)('input', {
    name: 'MuiTreeItem',
    slot: 'LabelInput',
})(function (_a) {
    var theme = _a.theme;
    return (__assign(__assign({}, theme.typography.body1), { width: '100%', backgroundColor: (theme.vars || theme).palette.background.paper, borderRadius: theme.shape.borderRadius, border: 'none', padding: '0 2px', boxSizing: 'border-box', '&:focus': {
            outline: "1px solid ".concat((theme.vars || theme).palette.primary.main),
        } }));
});
exports.TreeItemLabelInput = TreeItemLabelInput;
