"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRangePickerStepNavigation = createRangePickerStepNavigation;
var internals_1 = require("@mui/x-date-pickers/internals");
function createRangePickerStepNavigation(parameters) {
    var steps = parameters.steps, rangePositionResponse = parameters.rangePositionResponse;
    return (0, internals_1.createStepNavigation)({
        steps: steps,
        isViewMatchingStep: function (view, step) {
            if (step.rangePosition !== rangePositionResponse.rangePosition) {
                return false;
            }
            return step.views == null || step.views.includes(view);
        },
        onStepChange: function (_a) {
            var step = _a.step, defaultView = _a.defaultView, setView = _a.setView, view = _a.view, views = _a.views;
            if (step.rangePosition !== rangePositionResponse.rangePosition) {
                rangePositionResponse.setRangePosition(step.rangePosition);
            }
            var targetView = step.views == null ? defaultView : step.views.find(function (viewBis) { return views.includes(viewBis); });
            if (targetView !== view) {
                setView(targetView);
            }
        },
    });
}
