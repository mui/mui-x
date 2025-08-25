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
    describe('rename-should-disable-time', function () {
        it('transforms props as needed', function () {
            var actual = (0, index_1.default)({
                source: read('./actual-props.spec.js'),
                path: require.resolve('./actual-props.spec.js'),
            }, { jscodeshift: jscodeshift_1.default }, {});
            var expected = read('./expected-props.spec.js');
            expect(actual).to.equal(expected, 'The transformed version should be correct');
        });
        it('should be idempotent for expression', function () {
            var actual = (0, index_1.default)({
                source: read('./expected-props.spec.js'),
                path: require.resolve('./expected-props.spec.js'),
            }, { jscodeshift: jscodeshift_1.default }, {});
            var expected = read('./expected-props.spec.js');
            expect(actual).to.equal(expected, 'The transformed version should be correct');
        });
    });
});
