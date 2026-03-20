"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsHydrated = useIsHydrated;
var React = require("react");
/** Returns true after hydration is done on the client.
 *
 * Basically a implementation of Option 2 of this gist: https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85#option-2-lazily-show-component-with-uselayouteffect. */
function useIsHydrated() {
    var _a = React.useState(false), isHydrated = _a[0], setIsHydrated = _a[1];
    React.useEffect(function () {
        setIsHydrated(true);
    }, []);
    return isHydrated;
}
