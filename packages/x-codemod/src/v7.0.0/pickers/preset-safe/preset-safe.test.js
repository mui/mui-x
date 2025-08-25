"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var jscodeshift_1 = require("jscodeshift");
var index_1 = require("./index");
var readFile_1 = require("../../../util/readFile");
function read(fileName) {
    return (0, readFile_1.default)(path_1.default.join(__dirname, fileName));
}
describe('v7.0.0/pickers', function () {
    describe('preset-safe', function () {
        it('transforms code as needed', function () {
            var actual = (0, index_1.default)({
                source: read('./actual.spec.tsx'),
                path: require.resolve('./actual.spec.tsx'),
            }, { jscodeshift: jscodeshift_1.default.withParser('tsx') }, {});
            var expected = read('./expected.spec.tsx');
            expect(actual).to.equal(expected, 'The transformed version should be correct');
        });
        it('should be idempotent for expression', function () {
            var actual = (0, index_1.default)({
                source: read('./expected.spec.tsx'),
                path: require.resolve('./expected.spec.tsx'),
            }, { jscodeshift: jscodeshift_1.default.withParser('tsx') }, {});
            var expected = read('./expected.spec.tsx');
            expect(actual).to.equal(expected, 'The transformed version should be correct');
        });
    });
});
