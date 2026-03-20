"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOnBeforeExport = defaultOnBeforeExport;
var Toolbar_1 = require("@mui/x-charts/Toolbar");
function defaultOnBeforeExport(iframe) {
    var document = iframe.contentDocument;
    var chartsToolbarEl = document.querySelector(".".concat(Toolbar_1.chartsToolbarClasses.root));
    chartsToolbarEl === null || chartsToolbarEl === void 0 ? void 0 : chartsToolbarEl.remove();
}
