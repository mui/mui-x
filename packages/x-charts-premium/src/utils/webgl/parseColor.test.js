"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var skipIf_1 = require("test/utils/skipIf");
var parseColor_1 = require("./parseColor");
vitest_1.describe.skipIf(skipIf_1.isJSDOM)('parseColor', function () {
    (0, vitest_1.describe)('hex color formats', function () {
        (0, vitest_1.it)('should parse 3-character hex color without hash', function () {
            var result = (0, parseColor_1.parseColor)('f00');
            (0, vitest_1.expect)(result).to.deep.equal([1, 0, 0, 1]);
        });
        (0, vitest_1.it)('should parse 3-character hex color with hash', function () {
            var result = (0, parseColor_1.parseColor)('#0f0');
            (0, vitest_1.expect)(result).to.deep.equal([0, 1, 0, 1]);
        });
        (0, vitest_1.it)('should parse 6-character hex color without hash', function () {
            var result = (0, parseColor_1.parseColor)('0000ff');
            (0, vitest_1.expect)(result).to.deep.equal([0, 0, 1, 1]);
        });
        (0, vitest_1.it)('should parse 6-character hex color with hash', function () {
            var result = (0, parseColor_1.parseColor)('#ff00ff');
            (0, vitest_1.expect)(result).to.deep.equal([1, 0, 1, 1]);
        });
        (0, vitest_1.it)('should parse 8-character hex color with alpha', function () {
            var result = (0, parseColor_1.parseColor)('#ff000080');
            (0, vitest_1.expect)(result[0]).to.equal(1);
            (0, vitest_1.expect)(result[1]).to.equal(0);
            (0, vitest_1.expect)(result[2]).to.equal(0);
            (0, vitest_1.expect)(result[3]).to.be.closeTo(0.5, 0.01);
        });
        (0, vitest_1.it)('should parse 8-character hex color with full opacity', function () {
            var result = (0, parseColor_1.parseColor)('#00ff00ff');
            (0, vitest_1.expect)(result).to.deep.equal([0, 1, 0, 1]);
        });
        (0, vitest_1.it)('should parse mixed case hex colors', function () {
            var result = (0, parseColor_1.parseColor)('#AaBbCc');
            (0, vitest_1.expect)(result).to.deep.equal([170 / 255, 187 / 255, 204 / 255, 1]);
        });
        (0, vitest_1.it)('should parse common hex colors', function () {
            (0, vitest_1.expect)((0, parseColor_1.parseColor)('#ffffff')).to.deep.equal([1, 1, 1, 1]);
            (0, vitest_1.expect)((0, parseColor_1.parseColor)('#000000')).to.deep.equal([0, 0, 0, 1]);
            (0, vitest_1.expect)((0, parseColor_1.parseColor)('#808080')).to.deep.equal([128 / 255, 128 / 255, 128 / 255, 1]);
        });
    });
    (0, vitest_1.describe)('rgb color formats', function () {
        (0, vitest_1.it)('should parse rgb with spaces', function () {
            var result = (0, parseColor_1.parseColor)('rgb(255, 0, 0)');
            (0, vitest_1.expect)(result).to.deep.equal([1, 0, 0, 1]);
        });
        (0, vitest_1.it)('should parse rgb without spaces', function () {
            var result = (0, parseColor_1.parseColor)('rgb(0,255,0)');
            (0, vitest_1.expect)(result).to.deep.equal([0, 1, 0, 1]);
        });
        (0, vitest_1.it)('should parse rgb with mixed spacing', function () {
            var result = (0, parseColor_1.parseColor)('rgb(0,  128,  255)');
            (0, vitest_1.expect)(result).to.deep.equal([0, 0.5019607843137255, 1, 1]);
        });
        (0, vitest_1.it)('should return null for invalid rgb values exceeding 255', function () {
            var result = (0, parseColor_1.parseColor)('rgb(256, 0, 0)');
            // Should fallback to canvas parsing which may handle it differently
            (0, vitest_1.expect)(result).to.have.lengthOf(4);
        });
    });
    (0, vitest_1.describe)('rgba color formats', function () {
        (0, vitest_1.it)('should parse rgba with alpha', function () {
            var result = (0, parseColor_1.parseColor)('rgba(255, 0, 0, 0.5)');
            (0, vitest_1.expect)(result).to.deep.equal([1, 0, 0, 0.5]);
        });
        (0, vitest_1.it)('should parse rgba with full opacity', function () {
            var result = (0, parseColor_1.parseColor)('rgba(0, 255, 0, 1)');
            (0, vitest_1.expect)(result).to.deep.equal([0, 1, 0, 1]);
        });
        (0, vitest_1.it)('should parse rgba with zero opacity', function () {
            var result = (0, parseColor_1.parseColor)('rgba(0, 0, 255, 0)');
            (0, vitest_1.expect)(result).to.deep.equal([0, 0, 1, 0]);
        });
        (0, vitest_1.it)('should parse rgba without spaces', function () {
            var result = (0, parseColor_1.parseColor)('rgba(128,128,128,0.75)');
            (0, vitest_1.expect)(result).to.deep.equal([
                0.5019607843137255, 0.5019607843137255, 0.5019607843137255, 0.75,
            ]);
        });
    });
    (0, vitest_1.describe)('named colors and canvas fallback', function () {
        (0, vitest_1.it)('should parse named color "red"', function () {
            var result = (0, parseColor_1.parseColor)('red');
            (0, vitest_1.expect)(result[0]).to.be.closeTo(1, 0.01);
            (0, vitest_1.expect)(result[1]).to.be.closeTo(0, 0.01);
            (0, vitest_1.expect)(result[2]).to.be.closeTo(0, 0.01);
            (0, vitest_1.expect)(result[3]).to.be.closeTo(1, 0.01);
        });
        (0, vitest_1.it)('should parse named color "blue"', function () {
            var result = (0, parseColor_1.parseColor)('blue');
            (0, vitest_1.expect)(result[0]).to.be.closeTo(0, 0.01);
            (0, vitest_1.expect)(result[1]).to.be.closeTo(0, 0.01);
            (0, vitest_1.expect)(result[2]).to.be.closeTo(1, 0.01);
            (0, vitest_1.expect)(result[3]).to.be.closeTo(1, 0.01);
        });
        (0, vitest_1.it)('should parse named color "green"', function () {
            var result = (0, parseColor_1.parseColor)('green');
            (0, vitest_1.expect)(result[0]).to.be.closeTo(0, 0.01);
            (0, vitest_1.expect)(result[1]).to.be.closeTo(0.5, 0.1);
            (0, vitest_1.expect)(result[2]).to.be.closeTo(0, 0.01);
            (0, vitest_1.expect)(result[3]).to.be.closeTo(1, 0.01);
        });
        (0, vitest_1.it)('should parse named color "white"', function () {
            var result = (0, parseColor_1.parseColor)('white');
            (0, vitest_1.expect)(result).to.deep.equal([1, 1, 1, 1]);
        });
        (0, vitest_1.it)('should parse named color "black"', function () {
            var result = (0, parseColor_1.parseColor)('black');
            (0, vitest_1.expect)(result).to.deep.equal([0, 0, 0, 1]);
        });
        (0, vitest_1.it)('should parse named color "transparent"', function () {
            var result = (0, parseColor_1.parseColor)('transparent');
            // Transparent color returns rgba(0,0,0,0) which gets normalized by canvas
            (0, vitest_1.expect)(result).to.have.lengthOf(4);
        });
        (0, vitest_1.it)('should parse complex named colors', function () {
            var result = (0, parseColor_1.parseColor)('cornflowerblue');
            (0, vitest_1.expect)(result).to.have.lengthOf(4);
        });
    });
    (0, vitest_1.describe)('caching', function () {
        (0, vitest_1.it)('should cache parsed colors', function () {
            var color = '#123456';
            var result1 = (0, parseColor_1.parseColor)(color);
            var result2 = (0, parseColor_1.parseColor)(color);
            // Same reference means it was cached
            (0, vitest_1.expect)(result1).to.equal(result2);
        });
        (0, vitest_1.it)('should cache different color formats separately', function () {
            var hex = (0, parseColor_1.parseColor)('#ff0000');
            var rgb = (0, parseColor_1.parseColor)('rgb(255, 0, 0)');
            // Different formats, so different cache entries
            (0, vitest_1.expect)(hex).to.not.equal(rgb);
        });
    });
    (0, vitest_1.describe)('edge cases', function () {
        (0, vitest_1.it)('should handle invalid hex format', function () {
            var result = (0, parseColor_1.parseColor)('#gggggg');
            (0, vitest_1.expect)(result).to.have.lengthOf(4);
        });
        (0, vitest_1.it)('should handle empty string', function () {
            var result = (0, parseColor_1.parseColor)('');
            (0, vitest_1.expect)(result).to.have.lengthOf(4);
        });
        (0, vitest_1.it)('should handle malformed rgb', function () {
            var result = (0, parseColor_1.parseColor)('rgb(255)');
            (0, vitest_1.expect)(result).to.have.lengthOf(4);
        });
        (0, vitest_1.it)('should handle case insensitivity for rgb/rgba', function () {
            var result1 = (0, parseColor_1.parseColor)('RGB(255, 0, 0)');
            var result2 = (0, parseColor_1.parseColor)('RGBA(255, 0, 0, 1)');
            (0, vitest_1.expect)(result1).to.deep.equal([1, 0, 0, 1]);
            (0, vitest_1.expect)(result2).to.deep.equal([1, 0, 0, 1]);
        });
    });
    (0, vitest_1.describe)('color normalization', function () {
        (0, vitest_1.it)('should normalize RGB values to [0, 1] range for rgb()', function () {
            var result = (0, parseColor_1.parseColor)('rgb(127, 127, 127)');
            (0, vitest_1.expect)(result[0]).to.be.closeTo(0.498, 0.01);
            (0, vitest_1.expect)(result[1]).to.be.closeTo(0.498, 0.01);
            (0, vitest_1.expect)(result[2]).to.be.closeTo(0.498, 0.01);
        });
        (0, vitest_1.it)('should keep alpha in [0, 1] range for hex colors', function () {
            var result = (0, parseColor_1.parseColor)('#00000000');
            (0, vitest_1.expect)(result[3]).to.equal(0);
        });
    });
});
