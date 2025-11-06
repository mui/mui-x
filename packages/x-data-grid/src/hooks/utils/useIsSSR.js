"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsSSR = void 0;
var shim_1 = require("use-sync-external-store/shim");
var emptySubscribe = function () { return function () { }; };
var clientSnapshot = function () { return false; };
var serverSnapshot = function () { return true; };
var useIsSSR = function () { return (0, shim_1.useSyncExternalStore)(emptySubscribe, clientSnapshot, serverSnapshot); };
exports.useIsSSR = useIsSSR;
