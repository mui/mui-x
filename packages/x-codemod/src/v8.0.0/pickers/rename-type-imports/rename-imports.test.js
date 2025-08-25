"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var jscodeshift_1 = require("jscodeshift");
var _1 = require(".");
var readFile_1 = require("../../../util/readFile");
function read(fileName) {
    return (0, readFile_1.default)(path_1.default.join(__dirname, fileName));
}
var TEST_FILES = ['community-import-root', 'community-import-nested', 'pro-import-root'];
describe('v8.0.0/pickers', function () {
    describe('rename-type-imports', function () {
        TEST_FILES.forEach(function (testFile) {
            var actualPath = "./actual-".concat(testFile, ".spec.tsx");
            var expectedPath = "./expected-".concat(testFile, ".spec.tsx");
            describe("".concat(testFile.replace(/-/g, ' ')), function () {
                it('transforms imports as needed', function () {
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
