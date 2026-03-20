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
exports.clearLicenseStatusCache = exports.useLicenseVerifier = exports.Watermark = exports.LICENSE_MODELS = exports.PLAN_VERSIONS = exports.PLAN_SCOPES = exports.APP_TYPES = exports.md5 = exports.base64Encode = exports.base64Decode = void 0;
var base64_1 = require("../encoding/base64");
Object.defineProperty(exports, "base64Decode", { enumerable: true, get: function () { return base64_1.base64Decode; } });
Object.defineProperty(exports, "base64Encode", { enumerable: true, get: function () { return base64_1.base64Encode; } });
var md5_1 = require("../encoding/md5");
Object.defineProperty(exports, "md5", { enumerable: true, get: function () { return md5_1.md5; } });
var licenseAppType_1 = require("../utils/licenseAppType");
Object.defineProperty(exports, "APP_TYPES", { enumerable: true, get: function () { return licenseAppType_1.APP_TYPES; } });
var licensePlan_1 = require("../utils/licensePlan");
Object.defineProperty(exports, "PLAN_SCOPES", { enumerable: true, get: function () { return licensePlan_1.PLAN_SCOPES; } });
Object.defineProperty(exports, "PLAN_VERSIONS", { enumerable: true, get: function () { return licensePlan_1.PLAN_VERSIONS; } });
var licenseModel_1 = require("../utils/licenseModel");
Object.defineProperty(exports, "LICENSE_MODELS", { enumerable: true, get: function () { return licenseModel_1.LICENSE_MODELS; } });
var Watermark_1 = require("../Watermark/Watermark");
Object.defineProperty(exports, "Watermark", { enumerable: true, get: function () { return Watermark_1.Watermark; } });
var useLicenseVerifier_1 = require("../useLicenseVerifier/useLicenseVerifier");
Object.defineProperty(exports, "useLicenseVerifier", { enumerable: true, get: function () { return useLicenseVerifier_1.useLicenseVerifier; } });
Object.defineProperty(exports, "clearLicenseStatusCache", { enumerable: true, get: function () { return useLicenseVerifier_1.clearLicenseStatusCache; } });
__exportStar(require("../verifyLicense/verifyLicense"), exports);
__exportStar(require("../test-keys"), exports);
