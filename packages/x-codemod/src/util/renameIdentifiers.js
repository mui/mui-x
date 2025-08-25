"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPreRequisitesSatisfied = exports.matchImport = void 0;
exports.default = renameIdentifiers;
var matchImport = function (path, regex) {
    return (path.node.source.value.toString() || '').match(regex);
};
exports.matchImport = matchImport;
var findDeepASTPath = function (j, currentPath, currentIdentifiers) {
    if (!currentIdentifiers.length) {
        return true;
    }
    var target = j(currentPath)
        .find(j.Identifier)
        .filter(function (path) { return path.value.name === currentIdentifiers[0]; });
    if (target.__paths.length === 0) {
        return false;
    }
    return findDeepASTPath(j, currentPath, currentIdentifiers.slice(1));
};
/**
 * Checks if all pre-requisites are satisfied for the given path `root`.
 * For it to be satisfied, at least one condition of all the pre-requisites must be fulfilled.
 *
 * @param {*} j
 * @param {*} root
 * @param {PreRequisiteUsage} preReqs
 * @returns {boolean}
 */
var checkPreRequisitesSatisfied = function (j, root, preReqs) {
    var _a, _b, _c;
    if (preReqs.packageRegex || preReqs.components) {
        // check if any of the components is imported from a package which satisfies `preReqs.packageRegex`
        var imports = root.find(j.ImportDeclaration);
        var matchingImports = preReqs.packageRegex
            ? imports.filter(function (path) { return !!(0, exports.matchImport)(path, preReqs.packageRegex); })
            : imports;
        if (!matchingImports.__paths.length) {
            return false;
        }
        // check if any of the `preReqs.components` is imported from the matching imports
        var satisfyingImports = ((_a = preReqs.components) === null || _a === void 0 ? void 0 : _a.length)
            ? matchingImports
                .find(j.Identifier)
                .filter(function (path) { return preReqs.components.includes(path.node.name); })
            : matchingImports;
        if (!satisfyingImports.__paths.length) {
            return false;
        }
    }
    if (!((_b = preReqs.possiblePaths) === null || _b === void 0 ? void 0 : _b.length)) {
        return true;
    }
    var allComponents = root.find(j.JSXElement);
    var matchingComponents = ((_c = preReqs.components) === null || _c === void 0 ? void 0 : _c.length)
        ? allComponents.filter(function (path) {
            return preReqs.components.includes(path.node.openingElement.name.name);
        })
        : allComponents;
    var matchingAttributes = matchingComponents
        .find(j.JSXAttribute)
        // filter by props first
        .filter(function (attribute) {
        return preReqs.possiblePaths.map(function (path) { return path.split('.')[0]; }).includes(attribute.node.name.name);
    })
        // filter by nested levels
        .filter(function (attribute) {
        return findDeepASTPath(j, attribute, preReqs
            .possiblePaths.find(function (path) { return path.startsWith(attribute.node.name.name); })
            .split('.')
            .slice(1));
    });
    return matchingAttributes.__paths.length > 0;
};
exports.checkPreRequisitesSatisfied = checkPreRequisitesSatisfied;
/**
 * Renames identifiers based on the `identifiers` object passed plus an optional `preRequisiteUsages` object
 * to control renaming based on certain conditions.
 *
 * @export renameIdentifiers
 * @param {RenameIdentifiersArgs} {
 *   root, // jscodeshift root
 *   identifiers, // object of identifiers to rename
 *   preRequisiteUsages, // an optional list of pre-requisite to control renaming based on certain conditions
 *                       // if any of the pre-requisites is satisfied then the identifier will be renamed
 *                       // for more details, see the type definition of `PreRequisiteUsage`
 *   j, // jscodeshift
 * }
 */
function renameIdentifiers(_a) {
    var root = _a.root, identifiers = _a.identifiers, preRequisiteUsages = _a.preRequisiteUsages, j = _a.j;
    root
        .find(j.Identifier)
        .filter(function (path) { return identifiers.hasOwnProperty(path.node.name); })
        .replaceWith(function (path) {
        if (!preRequisiteUsages || !preRequisiteUsages[path.node.name]) {
            return j.importSpecifier(j.identifier(identifiers[path.node.name]));
        }
        var shouldReplace = (0, exports.checkPreRequisitesSatisfied)(j, root, preRequisiteUsages[path.node.name]);
        if (shouldReplace) {
            return j.importSpecifier(j.identifier(identifiers[path.node.name]));
        }
        return j.importSpecifier(j.identifier(path.node.name));
    });
}
