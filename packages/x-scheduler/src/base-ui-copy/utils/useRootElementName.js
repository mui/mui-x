"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRootElementName = useRootElementName;
var React = require("react");
var useIsoLayoutEffect_1 = require("@base-ui-components/utils/useIsoLayoutEffect");
/**
 * Use this function determine the host element correctly on the server (in a SSR context, for example Next.js)
 */
function useRootElementName(parameters) {
    var _a = parameters.rootElementName, rootElementNameProp = _a === void 0 ? '' : _a;
    var _b = React.useState(rootElementNameProp.toUpperCase()), rootElementName = _b[0], setRootElementName = _b[1];
    if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        (0, useIsoLayoutEffect_1.useIsoLayoutEffect)(function () {
            if (rootElementNameProp && rootElementName !== rootElementNameProp.toUpperCase()) {
                console.warn("useRootElementName expected the '".concat(rootElementNameProp, "' element, but a '").concat(rootElementName.toLowerCase(), "' was rendered instead"), 'This may cause hydration issues in an SSR context, for example in a Next.js app');
            }
        }, [rootElementNameProp, rootElementName]);
    }
    var updateRootElementName = React.useCallback(function (element) {
        var _a;
        setRootElementName((_a = element === null || element === void 0 ? void 0 : element.tagName) !== null && _a !== void 0 ? _a : '');
    }, []);
    return { rootElementName: rootElementName, updateRootElementName: updateRootElementName };
}
