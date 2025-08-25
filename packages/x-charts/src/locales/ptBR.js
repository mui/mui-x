"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ptBR = exports.ptBRLocaleText = void 0;
var imageMimeTypes_1 = require("./utils/imageMimeTypes");
var getChartsLocalization_1 = require("./utils/getChartsLocalization");
exports.ptBRLocaleText = {
    // Overlay
    loading: 'Carregando dados…',
    noData: 'Sem dados para exibir',
    // Toolbar
    zoomIn: 'Aumentar zoom',
    zoomOut: 'Diminuir zoom',
    toolbarExport: 'Exportar',
    // Toolbar Export Menu
    toolbarExportPrint: 'Imprimir',
    toolbarExportImage: function (mimeType) { var _a; return "Exportar como ".concat((_a = imageMimeTypes_1.imageMimeTypes[mimeType]) !== null && _a !== void 0 ? _a : mimeType); },
};
exports.ptBR = (0, getChartsLocalization_1.getChartsLocalization)(exports.ptBRLocaleText);
