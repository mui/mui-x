"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var package_json_1 = require("@mui/material/package.json");
var checkMaterialVersion_1 = require("test/utils/checkMaterialVersion");
var package_json_2 = require("../../package.json");
(0, checkMaterialVersion_1.checkMaterialVersion)({ packageJson: package_json_2.default, materialPackageJson: package_json_1.default });
