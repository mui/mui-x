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
__exportStar(require("./types"), exports);
// CATEGORICAL PALETTES
__exportStar(require("./categorical/rainbowSurge"), exports);
__exportStar(require("./categorical/blueberryTwilight"), exports);
__exportStar(require("./categorical/mangoFusion"), exports);
__exportStar(require("./categorical/cheerfulFiesta"), exports);
// SEQUENTIAL PALETTES
__exportStar(require("./sequential/strawberrySky"), exports);
// SEQUENTIAL PALETTES - MONOCHROMATIC
__exportStar(require("./sequential/blue"), exports);
__exportStar(require("./sequential/cyan"), exports);
__exportStar(require("./sequential/green"), exports);
__exportStar(require("./sequential/orange"), exports);
__exportStar(require("./sequential/pink"), exports);
__exportStar(require("./sequential/purple"), exports);
__exportStar(require("./sequential/red"), exports);
__exportStar(require("./sequential/yellow"), exports);
