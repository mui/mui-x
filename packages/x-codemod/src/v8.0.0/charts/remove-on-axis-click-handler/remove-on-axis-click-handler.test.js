"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var jscodeshift_1 = require("jscodeshift");
var _1 = require(".");
var readFile_1 = require("../../../util/readFile");
function read(fileName) {
    return (0, readFile_1.default)(path_1.default.join(__dirname, fileName));
}
describe('v8.0.0/charts', function () {
    describe('remove-on-axis-click-handler-global-import', function () {
        var actualPath = "./actual-global-import.spec.tsx";
        var expectedPath = "./expected-global-import.spec.tsx";
        it('transforms axis click handlers as needed', function () {
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
    describe('remove-on-axis-click-handler-nested-import', function () {
        var actualPath = "./actual-nested-import.spec.tsx";
        var expectedPath = "./expected-nested-import.spec.tsx";
        it('transforms axis click handlers as needed', function () {
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
