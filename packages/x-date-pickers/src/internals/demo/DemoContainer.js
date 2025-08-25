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
exports.DemoItem = DemoItem;
exports.DemoContainer = DemoContainer;
var React = require("react");
var Stack_1 = require("@mui/material/Stack");
var Typography_1 = require("@mui/material/Typography");
var TextField_1 = require("@mui/material/TextField");
var PickersTextField_1 = require("../../PickersTextField");
var getChildTypeFromChildName = function (childName) {
    if (childName.match(/^([A-Za-z]+)Range(Calendar|Clock)$/)) {
        return 'multi-panel-UI-view';
    }
    if (childName.match(/^([A-Za-z]*)(DigitalClock)$/)) {
        return 'Tall-UI-view';
    }
    if (childName.match(/^Static([A-Za-z]+)/) || childName.match(/^([A-Za-z]+)(Calendar|Clock)$/)) {
        return 'UI-view';
    }
    if (childName.match(/^MultiInput([A-Za-z]+)RangeField$/)) {
        return 'multi-input-range-field';
    }
    if (childName.match(/^SingleInput([A-Za-z]+)RangeField$/) ||
        childName.match(/^([A-Za-z]+)RangePicker$/)) {
        return 'single-input-range-field';
    }
    return 'single-input-field';
};
var getSupportedSectionFromChildName = function (childName) {
    if (childName.includes('DateTime')) {
        return 'date-time';
    }
    if (childName.includes('Date')) {
        return 'date';
    }
    return 'time';
};
/**
 * WARNING: This is an internal component used in documentation to achieve a desired layout.
 * Please do not use it in your application.
 */
function DemoItem(props) {
    var _a;
    var label = props.label, children = props.children, component = props.component, sxProp = props.sx, _b = props.alignItems, alignItems = _b === void 0 ? 'stretch' : _b;
    var spacing;
    var sx = sxProp;
    if (component && getChildTypeFromChildName(component) === 'multi-input-range-field') {
        spacing = 1.5;
        sx = __assign(__assign({}, sx), (_a = {}, _a["& .".concat(TextField_1.textFieldClasses.root)] = {
            flexGrow: 1,
        }, _a));
    }
    else {
        spacing = 1;
    }
    return (<Stack_1.default direction="column" alignItems={alignItems} spacing={spacing} sx={sx}>
      {label && <Typography_1.default variant="body2">{label}</Typography_1.default>}
      {children}
    </Stack_1.default>);
}
DemoItem.displayName = 'DemoItem';
var isDemoItem = function (child) {
    if (React.isValidElement(child) && typeof child.type !== 'string') {
        // @ts-ignore
        return child.type.displayName === 'DemoItem';
    }
    return false;
};
/**
 * WARNING: This is an internal component used in documentation to achieve a desired layout.
 * Please do not use it in your application.
 */
function DemoContainer(props) {
    var _a, _b, _c, _d, _e;
    var children = props.children, components = props.components, sxProp = props.sx;
    var childrenTypes = new Set();
    var childrenSupportedSections = new Set();
    components.forEach(function (childName) {
        childrenTypes.add(getChildTypeFromChildName(childName));
        childrenSupportedSections.add(getSupportedSectionFromChildName(childName));
    });
    var getSpacing = function (direction) {
        if (direction === 'row') {
            return childrenTypes.has('UI-view') || childrenTypes.has('Tall-UI-view') ? 3 : 2;
        }
        return childrenTypes.has('UI-view') ? 4 : 3;
    };
    var direction;
    var spacing;
    var extraSx = {};
    var demoItemSx = {};
    var sx = __assign({ overflow: 'auto', 
        // Add padding as overflow can hide the outline text field label.
        pt: 1 }, sxProp);
    if (components.length > 2 ||
        childrenTypes.has('multi-input-range-field') ||
        childrenTypes.has('single-input-range-field') ||
        childrenTypes.has('multi-panel-UI-view') ||
        childrenTypes.has('UI-view') ||
        childrenSupportedSections.has('date-time')) {
        direction = 'column';
        spacing = getSpacing('column');
    }
    else {
        direction = { xs: 'column', lg: 'row' };
        spacing = { xs: getSpacing('column'), lg: getSpacing('row') };
    }
    if (childrenTypes.has('UI-view')) {
        // noop
    }
    else if (childrenTypes.has('single-input-range-field')) {
        if (!childrenSupportedSections.has('date-time')) {
            extraSx = (_a = {},
                _a["& > .".concat(TextField_1.textFieldClasses.root, ", & > .").concat(PickersTextField_1.pickersTextFieldClasses.root)] = {
                    minWidth: 300,
                },
                _a);
        }
        else {
            extraSx = (_b = {},
                _b["& > .".concat(TextField_1.textFieldClasses.root, ", & > .").concat(PickersTextField_1.pickersTextFieldClasses.root)] = {
                    minWidth: {
                        xs: 300,
                        // If demo also contains MultiInputDateTimeRangeField, increase width to avoid cutting off the value.
                        md: childrenTypes.has('multi-input-range-field') ? 460 : 440,
                    },
                },
                _b);
        }
    }
    else if (childrenSupportedSections.has('date-time')) {
        extraSx = (_c = {},
            _c["& > .".concat(TextField_1.textFieldClasses.root, ", & > .").concat(PickersTextField_1.pickersTextFieldClasses.root)] = { minWidth: 270 },
            _c);
        if (childrenTypes.has('multi-input-range-field')) {
            // increase width for the multi input date time range fields
            demoItemSx = (_d = {},
                _d["& > .".concat(Stack_1.stackClasses.root, " > .").concat(TextField_1.textFieldClasses.root, ", & > .").concat(Stack_1.stackClasses.root, " > .").concat(PickersTextField_1.pickersTextFieldClasses.root)] = { minWidth: 210 },
                _d);
        }
    }
    else {
        extraSx = (_e = {},
            _e["& > .".concat(TextField_1.textFieldClasses.root, ", & > .").concat(PickersTextField_1.pickersTextFieldClasses.root)] = { minWidth: 200 },
            _e);
    }
    var finalSx = __assign(__assign({}, sx), extraSx);
    return (<Stack_1.default direction={direction} spacing={spacing} sx={finalSx}>
      {React.Children.map(children, function (child) {
            if (React.isValidElement(child) && isDemoItem(child)) {
                // Inject sx styles to the `DemoItem` if it is a direct child of `DemoContainer`.
                // @ts-ignore
                return React.cloneElement(child, { sx: __assign(__assign({}, extraSx), demoItemSx) });
            }
            return child;
        })}
    </Stack_1.default>);
}
