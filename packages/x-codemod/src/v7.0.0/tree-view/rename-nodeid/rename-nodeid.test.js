"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var jscodeshift_1 = require("jscodeshift");
var _1 = require(".");
var readFile_1 = require("../../../util/readFile");
function read(fileName) {
    return (0, readFile_1.default)(path_1.default.join(__dirname, fileName));
}
describe('v7.0.0/tree-view', function () {
    describe('rename-nodeid', function () {
        it('transforms props as needed', function () {
            var actual = (0, _1.default)({ source: read('./actual.spec.js') }, { jscodeshift: jscodeshift_1.default }, {});
            var expected = read('./expected.spec.js');
            expect(actual).to.equal(expected, 'The transformed version should be correct');
        });
        it('should be idempotent', function () {
            var actual = (0, _1.default)({ source: read('./expected.spec.js') }, { jscodeshift: jscodeshift_1.default }, {});
            var expected = read('./expected.spec.js');
            expect(actual).to.equal(expected, 'The transformed version should be correct');
        });
    });
});
