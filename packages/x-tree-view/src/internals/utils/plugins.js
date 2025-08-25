"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPlugin = void 0;
var hasPlugin = function (instance, plugin) {
    var plugins = instance.getAvailablePlugins();
    return plugins.has(plugin);
};
exports.hasPlugin = hasPlugin;
