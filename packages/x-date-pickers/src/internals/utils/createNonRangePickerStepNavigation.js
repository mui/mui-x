"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNonRangePickerStepNavigation = createNonRangePickerStepNavigation;
var createStepNavigation_1 = require("./createStepNavigation");
function createNonRangePickerStepNavigation(parameters) {
    var steps = parameters.steps;
    return (0, createStepNavigation_1.createStepNavigation)({
        steps: steps,
        isViewMatchingStep: function (view, step) {
            return step.views == null || step.views.includes(view);
        },
        onStepChange: function (_a) {
            var step = _a.step, defaultView = _a.defaultView, setView = _a.setView, view = _a.view, views = _a.views;
            var targetView = step.views == null ? defaultView : step.views.find(function (viewBis) { return views.includes(viewBis); });
            if (targetView !== view) {
                setView(targetView);
            }
        },
    });
}
