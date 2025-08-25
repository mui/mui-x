"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTreeViewBuildContext = void 0;
var React = require("react");
var useTreeViewBuildContext = function (parameters) {
    var plugins = parameters.plugins, instance = parameters.instance, publicAPI = parameters.publicAPI, store = parameters.store, rootRef = parameters.rootRef;
    var runItemPlugins = React.useCallback(function (itemPluginProps) {
        var finalRootRef = null;
        var finalContentRef = null;
        var pluginPropEnhancers = [];
        var pluginPropEnhancersNames = {};
        plugins.forEach(function (plugin) {
            if (!plugin.itemPlugin) {
                return;
            }
            var itemPluginResponse = plugin.itemPlugin({
                props: itemPluginProps,
                rootRef: finalRootRef,
                contentRef: finalContentRef,
            });
            if (itemPluginResponse === null || itemPluginResponse === void 0 ? void 0 : itemPluginResponse.rootRef) {
                finalRootRef = itemPluginResponse.rootRef;
            }
            if (itemPluginResponse === null || itemPluginResponse === void 0 ? void 0 : itemPluginResponse.contentRef) {
                finalContentRef = itemPluginResponse.contentRef;
            }
            if (itemPluginResponse === null || itemPluginResponse === void 0 ? void 0 : itemPluginResponse.propsEnhancers) {
                pluginPropEnhancers.push(itemPluginResponse.propsEnhancers);
                // Prepare a list of all the slots which are enhanced by at least one plugin
                Object.keys(itemPluginResponse.propsEnhancers).forEach(function (propsEnhancerName) {
                    pluginPropEnhancersNames[propsEnhancerName] = true;
                });
            }
        });
        var resolvePropsEnhancer = function (currentSlotName) {
            return function (currentSlotParams) {
                var enhancedProps = {};
                pluginPropEnhancers.forEach(function (propsEnhancersForCurrentPlugin) {
                    var propsEnhancerForCurrentPluginAndSlot = propsEnhancersForCurrentPlugin[currentSlotName];
                    if (propsEnhancerForCurrentPluginAndSlot != null) {
                        Object.assign(enhancedProps, propsEnhancerForCurrentPluginAndSlot(currentSlotParams));
                    }
                });
                return enhancedProps;
            };
        };
        var propsEnhancers = Object.fromEntries(Object.keys(pluginPropEnhancersNames).map(function (propEnhancerName) {
            return [
                propEnhancerName,
                resolvePropsEnhancer(propEnhancerName),
            ];
        }));
        return {
            contentRef: finalContentRef,
            rootRef: finalRootRef,
            propsEnhancers: propsEnhancers,
        };
    }, [plugins]);
    var wrapItem = React.useCallback(function (_a) {
        var itemId = _a.itemId, children = _a.children, idAttribute = _a.idAttribute;
        var finalChildren = children;
        // The wrappers are reversed to ensure that the first wrapper is the outermost one.
        for (var i = plugins.length - 1; i >= 0; i -= 1) {
            var plugin = plugins[i];
            if (plugin.wrapItem) {
                finalChildren = plugin.wrapItem({
                    instance: instance,
                    itemId: itemId,
                    children: finalChildren,
                    idAttribute: idAttribute,
                });
            }
        }
        return finalChildren;
    }, [plugins, instance]);
    var wrapRoot = React.useCallback(function (_a) {
        var children = _a.children;
        var finalChildren = children;
        // The wrappers are reversed to ensure that the first wrapper is the outermost one.
        for (var i = plugins.length - 1; i >= 0; i -= 1) {
            var plugin = plugins[i];
            if (plugin.wrapRoot) {
                finalChildren = plugin.wrapRoot({
                    children: finalChildren,
                });
            }
        }
        return finalChildren;
    }, [plugins]);
    return React.useMemo(function () { return ({
        runItemPlugins: runItemPlugins,
        wrapItem: wrapItem,
        wrapRoot: wrapRoot,
        instance: instance,
        publicAPI: publicAPI,
        store: store,
        rootRef: rootRef,
    }); }, [runItemPlugins, wrapItem, wrapRoot, instance, publicAPI, store, rootRef]);
};
exports.useTreeViewBuildContext = useTreeViewBuildContext;
