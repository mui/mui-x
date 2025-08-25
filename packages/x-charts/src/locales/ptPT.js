"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ptPT = exports.ptPTLocaleText = void 0;
var imageMimeTypes_1 = require("./utils/imageMimeTypes");
var getChartsLocalization_1 = require("./utils/getChartsLocalization");
exports.ptPTLocaleText = {
    // Overlay
    loading: 'Carregando dados…',
    noData: 'Sem dados para mostrar',
    // Toolbar
    zoomIn: 'Aumentar zoom',
    zoomOut: 'Diminuir zoom',
    toolbarExport: 'Exportar',
    // Toolbar Export Menu
    toolbarExportPrint: 'Imprimir',
    toolbarExportImage: function (mimeType) { var _a; return "Exportar como ".concat((_a = imageMimeTypes_1.imageMimeTypes[mimeType]) !== null && _a !== void 0 ? _a : mimeType); },
};
exports.ptPT = (0, getChartsLocalization_1.getChartsLocalization)(exports.ptPTLocaleText);
