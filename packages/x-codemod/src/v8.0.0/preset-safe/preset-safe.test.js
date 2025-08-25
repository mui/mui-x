"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var jscodeshift_1 = require("jscodeshift");
var fs_1 = require("fs");
var _1 = require(".");
var readFile_1 = require("../../util/readFile");
function read(fileName) {
    return (0, readFile_1.default)(fileName);
}
function getAllDirs() {
    return fs_1.default
        .readdirSync(path_1.default.resolve(__dirname, '..'))
        .filter(function (file) {
        return fs_1.default.statSync(path_1.default.resolve(__dirname, '..', file)).isDirectory() &&
            file !== 'preset-safe' &&
            fs_1.default.existsSync(path_1.default.resolve(__dirname, '..', file, 'preset-safe'));
    });
}
describe('v8.0.0', function () {
    var MOD_DIRS = getAllDirs();
    describe('preset-safe', function () {
        MOD_DIRS.forEach(function (testDir) {
            var actualPath = path_1.default.resolve(__dirname, '..', testDir, 'preset-safe', 'actual.spec.tsx');
            var expectedPath = path_1.default.resolve(__dirname, '..', testDir, 'preset-safe', 'expected.spec.tsx');
            describe("".concat(testDir.replace(/-/g, ' ')), function () {
                it('transforms code as needed', function () {
                    var actual = (0, _1.default)({ source: read(actualPath) }, { jscodeshift: jscodeshift_1.default.withParser('tsx') }, {});
                    var expected = read(expectedPath);
                    expect(actual).to.equal(expected, 'The transformed version should be correct');
                });
                it('should be idempotent', function () {
                    var actual = (0, _1.default)({ source: read(expectedPath) }, { jscodeshift: jscodeshift_1.default.withParser('tsx') }, {});
                    var expected = read(expectedPath);
                    expect(actual).to.equal(expected, 'The transformed version should be correct');
                });
            });
        });
    });
});
