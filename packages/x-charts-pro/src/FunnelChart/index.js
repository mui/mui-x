"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunnelSectionLabel = exports.FunnelSection = exports.funnelSectionClasses = exports.Unstable_FunnelChart = exports.FunnelChart = void 0;
var FunnelChart_1 = require("./FunnelChart");
var FunnelChart_2 = require("./FunnelChart");
Object.defineProperty(exports, "FunnelChart", { enumerable: true, get: function () { return FunnelChart_2.FunnelChart; } });
/**
 * @deprecated funnel chart is now stable, import `FunnelChart` instead
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
exports.Unstable_FunnelChart = FunnelChart_1.FunnelChart;
__exportStar(require("./FunnelPlot"), exports);
__exportStar(require("./funnel.types"), exports);
__exportStar(require("./categoryAxis.types"), exports);
__exportStar(require("./funnelSlots.types"), exports);
var funnelSectionClasses_1 = require("./funnelSectionClasses");
Object.defineProperty(exports, "funnelSectionClasses", { enumerable: true, get: function () { return funnelSectionClasses_1.funnelSectionClasses; } });
var FunnelSection_1 = require("./FunnelSection");
Object.defineProperty(exports, "FunnelSection", { enumerable: true, get: function () { return FunnelSection_1.FunnelSection; } });
var FunnelSectionLabel_1 = require("./FunnelSectionLabel");
Object.defineProperty(exports, "FunnelSectionLabel", { enumerable: true, get: function () { return FunnelSectionLabel_1.FunnelSectionLabel; } });
