"use strict";
'use client';
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickersActionBar = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var Button_1 = require("@mui/material/Button");
var DialogActions_1 = require("@mui/material/DialogActions");
var usePickerTranslations_1 = require("../hooks/usePickerTranslations");
var hooks_1 = require("../hooks");
var PickersActionBarRoot = (0, styles_1.styled)(DialogActions_1.default, {
    name: 'MuiPickersLayout',
    slot: 'ActionBar',
})({});
/**
 * Demos:
 *
 * - [Custom slots and subcomponents](https://mui.com/x/react-date-pickers/custom-components/)
 * - [Custom layout](https://mui.com/x/react-date-pickers/custom-layout/)
 *
 * API:
 *
 * - [PickersActionBar API](https://mui.com/x/api/date-pickers/pickers-action-bar/)
 */
function PickersActionBarComponent(props) {
    var actions = props.actions, other = __rest(props, ["actions"]);
    var translations = (0, usePickerTranslations_1.usePickerTranslations)();
    var _a = (0, hooks_1.usePickerContext)(), clearValue = _a.clearValue, setValueToToday = _a.setValueToToday, acceptValueChanges = _a.acceptValueChanges, cancelValueChanges = _a.cancelValueChanges, goToNextStep = _a.goToNextStep, hasNextStep = _a.hasNextStep;
    if (actions == null || actions.length === 0) {
        return null;
    }
    var buttons = actions === null || actions === void 0 ? void 0 : actions.map(function (actionType) {
        switch (actionType) {
            case 'clear':
                return (<Button_1.default data-testid="clear-action-button" onClick={clearValue} key={actionType}>
            {translations.clearButtonLabel}
          </Button_1.default>);
            case 'cancel':
                return (<Button_1.default onClick={cancelValueChanges} key={actionType}>
            {translations.cancelButtonLabel}
          </Button_1.default>);
            case 'accept':
                return (<Button_1.default onClick={acceptValueChanges} key={actionType}>
            {translations.okButtonLabel}
          </Button_1.default>);
            case 'today':
                return (<Button_1.default data-testid="today-action-button" onClick={setValueToToday} key={actionType}>
            {translations.todayButtonLabel}
          </Button_1.default>);
            case 'next':
                return (<Button_1.default onClick={goToNextStep} key={actionType}>
            {translations.nextStepButtonLabel}
          </Button_1.default>);
            case 'nextOrAccept':
                if (hasNextStep) {
                    return (<Button_1.default onClick={goToNextStep} key={actionType}>
              {translations.nextStepButtonLabel}
            </Button_1.default>);
                }
                return (<Button_1.default onClick={acceptValueChanges} key={actionType}>
            {translations.okButtonLabel}
          </Button_1.default>);
            default:
                return null;
        }
    });
    return <PickersActionBarRoot {...other}>{buttons}</PickersActionBarRoot>;
}
PickersActionBarComponent.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Ordered array of actions to display.
     * If empty, does not display that action bar.
     * @default
     * - `[]` for Pickers with one selection step which `closeOnSelect`.
     * - `['cancel', 'nextOrAccept']` for all other Pickers.
     */
    actions: prop_types_1.default.arrayOf(prop_types_1.default.oneOf(['accept', 'cancel', 'clear', 'next', 'nextOrAccept', 'today']).isRequired),
    /**
     * If `true`, the actions do not have additional margin.
     * @default false
     */
    disableSpacing: prop_types_1.default.bool,
    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
};
var PickersActionBar = React.memo(PickersActionBarComponent);
exports.PickersActionBar = PickersActionBar;
