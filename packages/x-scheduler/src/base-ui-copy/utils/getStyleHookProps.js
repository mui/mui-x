"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStyleHookProps = getStyleHookProps;
function getStyleHookProps(state, customMapping) {
    var props = {};
    /* eslint-disable-next-line guard-for-in */
    for (var key in state) {
        var value = state[key];
        if (customMapping === null || customMapping === void 0 ? void 0 : customMapping.hasOwnProperty(key)) {
            var customProps = customMapping[key](value);
            if (customProps != null) {
                Object.assign(props, customProps);
            }
            continue;
        }
        if (value === true) {
            props["data-".concat(key.toLowerCase())] = '';
        }
        else if (value) {
            props["data-".concat(key.toLowerCase())] = value.toString();
        }
    }
    return props;
}
