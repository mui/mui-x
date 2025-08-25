"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyDefaultViewProps = exports.areViewsEqual = void 0;
var areViewsEqual = function (views, expectedViews) {
    if (views.length !== expectedViews.length) {
        return false;
    }
    return expectedViews.every(function (expectedView) { return views.includes(expectedView); });
};
exports.areViewsEqual = areViewsEqual;
var applyDefaultViewProps = function (_a) {
    var openTo = _a.openTo, defaultOpenTo = _a.defaultOpenTo, views = _a.views, defaultViews = _a.defaultViews;
    var viewsWithDefault = views !== null && views !== void 0 ? views : defaultViews;
    var openToWithDefault;
    if (openTo != null) {
        openToWithDefault = openTo;
    }
    else if (viewsWithDefault.includes(defaultOpenTo)) {
        openToWithDefault = defaultOpenTo;
    }
    else if (viewsWithDefault.length > 0) {
        openToWithDefault = viewsWithDefault[0];
    }
    else {
        throw new Error('MUI X: The `views` prop must contain at least one view.');
    }
    return {
        views: viewsWithDefault,
        openTo: openToWithDefault,
    };
};
exports.applyDefaultViewProps = applyDefaultViewProps;
