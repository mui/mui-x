"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useField = void 0;
var useFieldV7TextField_1 = require("./useFieldV7TextField");
var useFieldV6TextField_1 = require("./useFieldV6TextField");
var useNullableFieldPrivateContext_1 = require("../useNullableFieldPrivateContext");
var useField = function (parameters) {
    var _a, _b;
    var fieldPrivateContext = (0, useNullableFieldPrivateContext_1.useNullableFieldPrivateContext)();
    var enableAccessibleFieldDOMStructure = (_b = (_a = parameters.props.enableAccessibleFieldDOMStructure) !== null && _a !== void 0 ? _a : fieldPrivateContext === null || fieldPrivateContext === void 0 ? void 0 : fieldPrivateContext.enableAccessibleFieldDOMStructure) !== null && _b !== void 0 ? _b : true;
    var useFieldTextField = (enableAccessibleFieldDOMStructure ? useFieldV7TextField_1.useFieldV7TextField : useFieldV6TextField_1.useFieldV6TextField);
    return useFieldTextField(parameters);
};
exports.useField = useField;
