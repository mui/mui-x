"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = readFile;
var fs_1 = require("fs");
var os_1 = require("os");
function readFile(filePath) {
    var fileContents = fs_1.default.readFileSync(filePath, 'utf8').toString();
    if (os_1.EOL !== '\n') {
        return fileContents.replace(/\n/g, os_1.EOL);
    }
    return fileContents;
}
