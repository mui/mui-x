"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var renameProps_1 = require("../../util/renameProps");
function transformer(file, api, options) {
    var _a;
    var j = api.jscodeshift;
    var root = j(file.source);
    var printOptions = options.printOptions;
    return (0, renameProps_1.default)({
        root: root,
        componentNames: [options.component],
        props: (_a = {}, _a[options.from] = options.to, _a),
        j: j,
    }).toSource(printOptions);
}
