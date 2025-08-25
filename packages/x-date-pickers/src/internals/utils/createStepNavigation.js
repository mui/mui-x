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
exports.DEFAULT_STEP_NAVIGATION = void 0;
exports.createStepNavigation = createStepNavigation;
exports.DEFAULT_STEP_NAVIGATION = {
    hasNextStep: false,
    hasSeveralSteps: false,
    goToNextStep: function () { },
    areViewsInSameStep: function () { return true; },
};
/**
 * Create an object that determines whether there is a next step and allows to go to the next step.
 * @param {CreateStepNavigationParameters<TStep>} parameters The parameters of the createStepNavigation function
 * @returns {CreateStepNavigationReturnValue} The return value of the createStepNavigation function
 */
function createStepNavigation(parameters) {
    var steps = parameters.steps, isViewMatchingStep = parameters.isViewMatchingStep, onStepChange = parameters.onStepChange;
    return function (parametersBis) {
        if (steps == null) {
            return exports.DEFAULT_STEP_NAVIGATION;
        }
        var currentStepIndex = steps.findIndex(function (step) {
            return isViewMatchingStep(parametersBis.view, step);
        });
        var nextStep = currentStepIndex === -1 || currentStepIndex === steps.length - 1
            ? null
            : steps[currentStepIndex + 1];
        return {
            hasNextStep: nextStep != null,
            hasSeveralSteps: steps.length > 1,
            goToNextStep: function () {
                if (nextStep == null) {
                    return;
                }
                onStepChange(__assign(__assign({}, parametersBis), { step: nextStep }));
            },
            areViewsInSameStep: function (viewA, viewB) {
                var stepA = steps.find(function (step) { return isViewMatchingStep(viewA, step); });
                var stepB = steps.find(function (step) { return isViewMatchingStep(viewB, step); });
                return stepA === stepB;
            },
        };
    };
}
