"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridLocaleText = void 0;
var React = require("react");
var useGridLocaleText = function (apiRef, props) {
    var getLocaleText = React.useCallback(function (key) {
        if (props.localeText[key] == null) {
            throw new Error("Missing translation for key ".concat(key, "."));
        }
        return props.localeText[key];
    }, [props.localeText]);
    apiRef.current.register('public', {
        getLocaleText: getLocaleText,
    });
};
exports.useGridLocaleText = useGridLocaleText;
