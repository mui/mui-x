"use strict";
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
exports.getChartsLocalization = void 0;
/**
 * Helper to pass translation to all charts thanks to the MUI theme.
 * @param chartsTranslations The translation object.
 * @returns an object to pass the translation by using the MUI theme default props
 */
var getChartsLocalization = function (chartsTranslations) {
    return {
        components: {
            MuiChartsLocalizationProvider: {
                defaultProps: {
                    localeText: __assign({}, chartsTranslations),
                },
            },
        },
    };
};
exports.getChartsLocalization = getChartsLocalization;
