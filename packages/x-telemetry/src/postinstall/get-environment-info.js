"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getEnvironmentInfo;
var is_docker_1 = require("is-docker");
var ci_info_1 = require("ci-info");
var traits;
function getEnvironmentInfo() {
    if (!traits) {
        traits = {
            isDocker: (0, is_docker_1.default)(),
            isCI: ci_info_1.default.isCI,
        };
    }
    return traits;
}
