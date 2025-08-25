"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePickerTranslations = void 0;
var usePickerAdapter_1 = require("./usePickerAdapter");
var usePickerTranslations = function () { return (0, usePickerAdapter_1.useLocalizationContext)().localeText; };
exports.usePickerTranslations = usePickerTranslations;
