"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwrapPrivateAPI = unwrapPrivateAPI;
exports.useGridApiInitialization = useGridApiInitialization;
var React = require("react");
var EventManager_1 = require("@mui/x-internals/EventManager");
var store_1 = require("@mui/x-internals/store");
var useGridApiMethod_1 = require("../utils/useGridApiMethod");
var signature_1 = require("../../constants/signature");
var SYMBOL_API_PRIVATE = Symbol('mui.api_private');
var isSyntheticEvent = function (event) {
    return event.isPropagationStopped !== undefined;
};
function unwrapPrivateAPI(publicApi) {
    return publicApi[SYMBOL_API_PRIVATE];
}
var globalId = 0;
function createPrivateAPI(publicApiRef) {
    var _a;
    var existingPrivateApi = (_a = publicApiRef.current) === null || _a === void 0 ? void 0 : _a[SYMBOL_API_PRIVATE];
    if (existingPrivateApi) {
        return existingPrivateApi;
    }
    var state = {};
    var privateApi = {
        state: state,
        store: store_1.Store.create(state),
        instanceId: { id: globalId },
    };
    globalId += 1;
    privateApi.getPublicApi = function () { return publicApiRef.current; };
    privateApi.register = function (visibility, methods) {
        Object.keys(methods).forEach(function (methodName) {
            var method = methods[methodName];
            var currentPrivateMethod = privateApi[methodName];
            if ((currentPrivateMethod === null || currentPrivateMethod === void 0 ? void 0 : currentPrivateMethod.spying) === true) {
                currentPrivateMethod.target = method;
            }
            else {
                privateApi[methodName] = method;
            }
            if (visibility === 'public') {
                var publicApi = publicApiRef.current;
                var currentPublicMethod = publicApi[methodName];
                if ((currentPublicMethod === null || currentPublicMethod === void 0 ? void 0 : currentPublicMethod.spying) === true) {
                    currentPublicMethod.target = method;
                }
                else {
                    publicApi[methodName] = method;
                }
            }
        });
    };
    privateApi.register('private', {
        caches: {},
        eventManager: new EventManager_1.EventManager(),
    });
    return privateApi;
}
function createPublicAPI(privateApiRef) {
    var _a;
    var publicApi = (_a = {
            get state() {
                return privateApiRef.current.state;
            },
            get store() {
                return privateApiRef.current.store;
            },
            get instanceId() {
                return privateApiRef.current.instanceId;
            }
        },
        _a[SYMBOL_API_PRIVATE] = privateApiRef.current,
        _a);
    return publicApi;
}
function useGridApiInitialization(inputApiRef, props) {
    var _a;
    var publicApiRef = React.useRef(null);
    var privateApiRef = React.useRef(null);
    if (!privateApiRef.current) {
        privateApiRef.current = createPrivateAPI(publicApiRef);
    }
    if (!publicApiRef.current) {
        publicApiRef.current = createPublicAPI(privateApiRef);
    }
    var publishEvent = React.useCallback(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var name = args[0], params = args[1], _a = args[2], event = _a === void 0 ? {} : _a;
        event.defaultMuiPrevented = false;
        if (isSyntheticEvent(event) && event.isPropagationStopped()) {
            return;
        }
        var details = props.signature === signature_1.GridSignature.DataGridPro ||
            props.signature === signature_1.GridSignature.DataGridPremium
            ? { api: privateApiRef.current.getPublicApi() }
            : {};
        privateApiRef.current.eventManager.emit(name, params, event, details);
    }, [privateApiRef, props.signature]);
    var subscribeEvent = React.useCallback(function (event, handler, options) {
        privateApiRef.current.eventManager.on(event, handler, options);
        var api = privateApiRef.current;
        return function () {
            api.eventManager.removeListener(event, handler);
        };
    }, [privateApiRef]);
    (0, useGridApiMethod_1.useGridApiMethod)(privateApiRef, { subscribeEvent: subscribeEvent, publishEvent: publishEvent }, 'public');
    if (inputApiRef && !((_a = inputApiRef.current) === null || _a === void 0 ? void 0 : _a.state)) {
        inputApiRef.current = publicApiRef.current;
    }
    React.useImperativeHandle(inputApiRef, function () { return publicApiRef.current; }, [publicApiRef]);
    React.useEffect(function () {
        var api = privateApiRef.current;
        return function () {
            api.publishEvent('unmount');
        };
    }, [privateApiRef]);
    return privateApiRef;
}
