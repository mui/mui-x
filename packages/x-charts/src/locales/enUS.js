"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enUS = exports.DEFAULT_LOCALE = exports.enUSLocaleText = void 0;
var imageMimeTypes_1 = require("./utils/imageMimeTypes");
var getChartsLocalization_1 = require("./utils/getChartsLocalization");
// This object is not Partial<ChartsLocaleText> because it is the default values
exports.enUSLocaleText = {
    /* Overlay */
    loading: 'Loading data…',
    noData: 'No data to display',
    /* Toolbar */
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    toolbarExport: 'Export',
    /* Toolbar Export Menu */
    toolbarExportPrint: 'Print',
    toolbarExportImage: function (mimeType) { var _a; return "Export as ".concat((_a = imageMimeTypes_1.imageMimeTypes[mimeType]) !== null && _a !== void 0 ? _a : mimeType); },
};
exports.DEFAULT_LOCALE = exports.enUSLocaleText;
exports.enUS = (0, getChartsLocalization_1.getChartsLocalization)(exports.enUSLocaleText);
