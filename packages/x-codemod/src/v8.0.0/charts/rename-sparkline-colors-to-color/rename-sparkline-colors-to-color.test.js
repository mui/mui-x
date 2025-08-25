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
    describe('rename-sparkline-colors-to-color', function () {
        it('transforms code as needed', function () {
            var actual = (0, _1.default)({
                source: read('./actual.spec.tsx'),
                path: require.resolve('./actual.spec.tsx'),
            }, { jscodeshift: jscodeshift_1.default.withParser('tsx') }, {});
            var expected = read('./expected.spec.tsx');
            expect(actual).to.equal(expected, 'The transformed version should be correct');
        });
    });
});
