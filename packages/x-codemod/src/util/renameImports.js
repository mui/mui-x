"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameImports = renameImports;
var getPathStrFromPath = function (path) {
    var _a, _b;
    var cleanPath;
    if (path.get('type').value === 'ImportDeclaration') {
        cleanPath = path;
    }
    else {
        cleanPath = path.parentPath.parentPath;
    }
    return (_b = (_a = cleanPath.node.source.value) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '';
};
var getRelativeEndpointFromPathStr = function (pathStr, packageNames) {
    return pathStr.replace(new RegExp("^(".concat(packageNames.join('|'), ")/")), '');
};
var getMatchingNestedImport = function (path, parameters) {
    var pathStr = getPathStrFromPath(path);
    var relativeEndpoint = getRelativeEndpointFromPathStr(pathStr, parameters.packageNames);
    return parameters.imports.find(function (importConfig) { return importConfig.oldEndpoint === relativeEndpoint; });
};
var getMatchingRootImport = function (path, parameters) {
    return parameters.imports.find(function (importConfig) {
        return (!importConfig.skipRoot && importConfig.importsMapping.hasOwnProperty(path.node.imported.name));
    });
};
function renameImports(parameters) {
    var j = parameters.j, root = parameters.root;
    var renamedIdentifiersMap = {};
    var importDeclarations = root
        // Find all the import declarations (import { ... } from '...')
        .find(j.ImportDeclaration);
    // Rename the nested imports specifiers
    // - import { A } from '@mui/x-date-pickers/A'
    // + import { B } from '@mui/x-date-pickers/A'
    var nestedImportRegExp = new RegExp("^(".concat(parameters.packageNames.join('|'), ")/(.*)$"));
    importDeclarations
        // Filter out the declarations that are not nested endpoints of the matching packages or that don't have any update to apply
        .filter(function (path) {
        var pathStr = getPathStrFromPath(path);
        if (!pathStr.match(nestedImportRegExp)) {
            return false;
        }
        return !!getMatchingNestedImport(path, parameters);
    })
        // Find all the import specifiers (extract A in import { A } from '...')
        .find(j.ImportSpecifier)
        // Filter out the specifiers that don't need to be updated
        .filter(function (path) {
        return getMatchingNestedImport(path, parameters).importsMapping.hasOwnProperty(path.node.imported.name);
    })
        // Rename the import specifiers
        .replaceWith(function (path) {
        var _a;
        var newName = getMatchingNestedImport(path, parameters).importsMapping[path.node.imported.name];
        // If the import is alias, we keep the alias and don't rename the variable usage
        var hasAlias = ((_a = path.node.local) === null || _a === void 0 ? void 0 : _a.name) !== path.node.imported.name;
        if (hasAlias) {
            return j.importSpecifier(j.identifier(newName), j.identifier(path.node.local.name));
        }
        renamedIdentifiersMap[path.node.imported.name] = newName;
        return j.importSpecifier(j.identifier(newName));
    });
    // Rename the root imports specifiers
    // - import { A } from '@mui/x-date-pickers'
    // + import { B } from '@mui/x-date-pickers'
    var rootImportRegExp = new RegExp("^(".concat(parameters.packageNames.join('|'), ")$"));
    importDeclarations
        // Filter out the declarations that are not root endpoint of the matching packages
        .filter(function (path) {
        var pathStr = getPathStrFromPath(path);
        return !!pathStr.match(rootImportRegExp);
    })
        .find(j.ImportSpecifier)
        .filter(function (path) {
        return !!getMatchingRootImport(path, parameters);
    })
        // Rename the import specifiers
        .replaceWith(function (path) {
        var _a;
        var newName = getMatchingRootImport(path, parameters).importsMapping[path.node.imported.name];
        // If the import is alias, we keep the alias and don't rename the variable usage
        var hasAlias = ((_a = path.node.local) === null || _a === void 0 ? void 0 : _a.name) !== path.node.imported.name;
        if (hasAlias) {
            return j.importSpecifier(j.identifier(newName), j.identifier(path.node.local.name));
        }
        renamedIdentifiersMap[path.node.imported.name] = newName;
        return j.importSpecifier(j.identifier(newName));
    });
    // Rename the nested import declarations
    // - import { B } from '@mui/x-date-pickers/A'
    // + import { B } from '@mui/x-date-pickers/B'
    importDeclarations
        // Filter out the declarations that are not nested endpoints of the matching packages or that don't have any update to apply
        .filter(function (path) {
        var _a;
        var pathStr = getPathStrFromPath(path);
        if (!pathStr.match(nestedImportRegExp)) {
            return false;
        }
        return !!((_a = getMatchingNestedImport(path, parameters)) === null || _a === void 0 ? void 0 : _a.newEndpoint);
    })
        .replaceWith(function (path) {
        var pathStr = getPathStrFromPath(path);
        var oldEndpoint = getRelativeEndpointFromPathStr(pathStr, parameters.packageNames);
        var newEndpoint = getMatchingNestedImport(path, parameters).newEndpoint;
        var newPathStr = pathStr.replace(oldEndpoint, newEndpoint);
        return j.importDeclaration(
        // Copy over the existing import specifiers
        path.node.specifiers, 
        // Replace the source with our new source
        j.stringLiteral(newPathStr));
    });
    // Rename the import usage
    // - <A />
    // + <B />
    root
        .find(j.Identifier)
        .filter(function (path) {
        return renamedIdentifiersMap.hasOwnProperty(path.node.name);
    })
        .replaceWith(function (path) {
        var newName = renamedIdentifiersMap[path.node.name];
        return j.identifier(newName);
    });
    return root;
}
