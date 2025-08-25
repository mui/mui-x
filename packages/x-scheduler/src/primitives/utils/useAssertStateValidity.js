"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAssertStateValidity = void 0;
var store_1 = require("@base-ui-components/utils/store");
var warn_1 = require("@base-ui-components/utils/warn");
var store_2 = require("../use-event-calendar/store");
/**
 * Makes sure the state current value doesn't contain incompatible values.
 */
function useAssertStateValidityOutsideOfProduction(store) {
    (0, store_1.useStore)(store, function () {
        var views = store_2.selectors.views(store.state);
        var view = store_2.selectors.view(store.state);
        if (!views.includes(view)) {
            (0, warn_1.warn)([
                "Event Calendar: The current view \"".concat(view, "\" is not compatible with the available views: ").concat(views.join(', '), "."),
                'Please ensure that the current view is included in the views array.',
            ].join('\n'));
        }
        return null;
    });
}
exports.useAssertStateValidity = process.env.NODE_ENV === 'production' ? function () { } : useAssertStateValidityOutsideOfProduction;
