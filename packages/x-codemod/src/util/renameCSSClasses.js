"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = renameCSSClasses;
function renameCSSClasses(_a) {
    var root = _a.root, j = _a.j, renamedClasses = _a.renamedClasses;
    root
        .find(j.Literal)
        .filter(function (path) {
        return !!Object.keys(renamedClasses).find(function (className) {
            var literal = path.node.value;
            return (typeof literal === 'string' &&
                literal.includes(className) &&
                !literal.includes(renamedClasses[className]));
        });
    })
        .replaceWith(function (path) {
        var literal = path.node.value;
        var targetClassKey = Object.keys(renamedClasses).find(function (className) {
            return literal.includes(className);
        });
        return j.literal(literal.replace(targetClassKey, renamedClasses[targetClassKey]));
    });
}
