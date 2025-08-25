"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.elGR = exports.elGRLocaleText = void 0;
var imageMimeTypes_1 = require("./utils/imageMimeTypes");
var getChartsLocalization_1 = require("./utils/getChartsLocalization");
exports.elGRLocaleText = {
    // Overlay
    loading: 'Φόρτωση δεδομένων…',
    noData: 'Δεν υπάρχουν δεδομένα για εμφάνιση',
    // Toolbar
    zoomIn: 'Μεγέθυνση',
    zoomOut: 'Σμίκρυνση',
    toolbarExport: 'Εξαγωγή',
    // Toolbar Export Menu
    toolbarExportPrint: 'Εκτύπωση',
    toolbarExportImage: function (mimeType) { var _a; return "\u0395\u03BE\u03B1\u03B3\u03C9\u03B3\u03AE \u03C9\u03C2 ".concat((_a = imageMimeTypes_1.imageMimeTypes[mimeType]) !== null && _a !== void 0 ? _a : mimeType); },
};
exports.elGR = (0, getChartsLocalization_1.getChartsLocalization)(exports.elGRLocaleText);
