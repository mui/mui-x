"use strict";
'use client';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationsContext = void 0;
exports.TranslationsProvider = TranslationsProvider;
exports.useTranslations = useTranslations;
var React = require("react");
var enUS_1 = require("../../translations/enUS");
/**
 * @internal
 */
exports.TranslationsContext = React.createContext(enUS_1.enUS);
function TranslationsProvider(props) {
    var parentTranslations = React.useContext(exports.TranslationsContext);
    var mergedTranslations = React.useMemo(function () {
        if (props.translations === undefined) {
            return parentTranslations;
        }
        return __assign(__assign({}, parentTranslations), props.translations);
    }, [parentTranslations, props.translations]);
    if (props.translations === undefined) {
        return props.children;
    }
    return (<exports.TranslationsContext.Provider value={mergedTranslations}>
      {props.children}
    </exports.TranslationsContext.Provider>);
}
function useTranslations() {
    return React.useContext(exports.TranslationsContext);
}
