"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var jscodeshift_1 = require("jscodeshift");
var index_1 = require("./index");
var readFile_1 = require("../../../util/readFile");
function read(fileName) {
    return (0, readFile_1.default)(path_1.default.join(__dirname, fileName));
}
describe('v6.0.0/pickers', function () {
    describe('localization-provider-rename-locale', function () {
        it('transforms expression props as needed', function () {
            var actual = (0, index_1.default)({
                source: read('./actual-expression-values.spec.js'),
                path: require.resolve('./actual-expression-values.spec.js'),
            }, { jscodeshift: jscodeshift_1.default }, {});
            var expected = read('./expected-expression-values.spec.js');
            expect(actual).to.equal(expected, 'The transformed version should be correct');
        });
        it('should be idempotent for expression', function () {
            var actual = (0, index_1.default)({
                source: read('./expected-expression-values.spec.js'),
                path: require.resolve('./expected-expression-values.spec.js'),
            }, { jscodeshift: jscodeshift_1.default }, {});
            var expected = read('./expected-expression-values.spec.js');
            expect(actual).to.equal(expected, 'The transformed version should be correct');
        });
        it('transforms string props as needed', function () {
            var actual = (0, index_1.default)({
                source: read('./actual-string-values.spec.js'),
                path: require.resolve('./actual-string-values.spec.js'),
            }, { jscodeshift: jscodeshift_1.default }, {});
            var expected = read('./expected-string-values.spec.js');
            expect(actual).to.equal(expected, 'The transformed version should be correct');
        });
        it('should be idempotent for string', function () {
            var actual = (0, index_1.default)({
                source: read('./expected-string-values.spec.js'),
                path: require.resolve('./expected-string-values.spec.js'),
            }, { jscodeshift: jscodeshift_1.default }, {});
            var expected = read('./expected-string-values.spec.js');
            expect(actual).to.equal(expected, 'The transformed version should be correct');
        });
    });
});
