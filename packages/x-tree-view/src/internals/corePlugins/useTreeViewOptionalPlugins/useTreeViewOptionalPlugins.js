"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTreeViewOptionalPlugins = void 0;
var useTreeViewOptionalPlugins = function (_a) {
    var plugins = _a.plugins;
    var pluginSet = new Set(plugins);
    var getAvailablePlugins = function () { return pluginSet; };
    return {
        instance: {
            getAvailablePlugins: getAvailablePlugins,
        },
    };
};
exports.useTreeViewOptionalPlugins = useTreeViewOptionalPlugins;
exports.useTreeViewOptionalPlugins.params = {};
