"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var rename_adapter_date_fns_imports_1 = require("../rename-adapter-date-fns-imports");
var rename_type_imports_1 = require("../rename-type-imports");
function transformer(file, api, options) {
    file.source = (0, rename_adapter_date_fns_imports_1.default)(file, api, options);
    file.source = (0, rename_type_imports_1.default)(file, api, options);
    return file.source;
}
