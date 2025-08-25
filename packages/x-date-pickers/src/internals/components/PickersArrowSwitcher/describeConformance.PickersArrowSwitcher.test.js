"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var pickers_1 = require("test/utils/pickers");
var describeConformance_1 = require("test/utils/describeConformance");
var PickersArrowSwitcher_1 = require("./PickersArrowSwitcher");
var pickersArrowSwitcherClasses_1 = require("./pickersArrowSwitcherClasses");
describe('<PickersArrowSwitcher /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, describeConformance_1.describeConformance)(<PickersArrowSwitcher_1.PickersArrowSwitcher isPreviousDisabled={false} onGoToPrevious={function () { }} previousLabel="previous" isNextDisabled={false} nextLabel="next" onGoToNext={function () { }}/>, function () { return ({
        classes: pickersArrowSwitcherClasses_1.pickersArrowSwitcherClasses,
        inheritComponent: 'div',
        render: render,
        muiName: 'MuiPickersArrowSwitcher',
        refInstanceof: window.HTMLDivElement,
        skip: [
            'componentProp',
            'componentsProp',
            'themeVariants',
            'slotPropsCallbackWithPropsAsOwnerState',
        ],
        slots: {
            previousIconButton: {
                expectedClassName: pickersArrowSwitcherClasses_1.pickersArrowSwitcherClasses.previousIconButton,
            },
            nextIconButton: {
                expectedClassName: pickersArrowSwitcherClasses_1.pickersArrowSwitcherClasses.nextIconButton,
            },
            leftArrowIcon: {
                expectedClassName: pickersArrowSwitcherClasses_1.pickersArrowSwitcherClasses.leftArrowIcon,
            },
            rightArrowIcon: {
                expectedClassName: pickersArrowSwitcherClasses_1.pickersArrowSwitcherClasses.rightArrowIcon,
            },
        },
    }); });
});
