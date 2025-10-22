"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var skipIf_1 = require("test/utils/skipIf");
var domUtils_1 = require("./domUtils");
describe('domUtils', function () {
    describe('getStyleString', function () {
        it('should convert style object to a string', function () {
            var style = {
                fontSize: 12,
                fontFamily: 'Arial',
                fontLanguageOverride: 'body',
            };
            expect((0, domUtils_1.getStyleString)(style)).to.eq('font-size:12px;font-family:Arial;font-language-override:body;');
        });
    });
    describe('measureText', function () {
        beforeEach(function () {
            (0, domUtils_1.clearStringMeasurementCache)();
        });
        // Skip measurement tests in jsdom as it doesn't properly support getBoundingClientRect for SVG
        it.skipIf(skipIf_1.isJSDOM)('should measure text width and height', function () {
            var size = (0, domUtils_1.measureText)('Hello World', { fontSize: 16, fontFamily: 'Arial' });
            expect(size.width).to.be.greaterThan(0);
            expect(size.height).to.be.greaterThan(0);
        });
        it('should return zero dimensions for null text', function () {
            var size = (0, domUtils_1.measureText)(null);
            expect(size.width).to.equal(0);
            expect(size.height).to.equal(0);
        });
        it('should return zero dimensions for undefined text', function () {
            var size = (0, domUtils_1.measureText)(undefined);
            expect(size.width).to.equal(0);
            expect(size.height).to.equal(0);
        });
        it.skipIf(skipIf_1.isJSDOM)('should cache results', function () {
            var size1 = (0, domUtils_1.measureText)('Test', { fontSize: 14 });
            var size2 = (0, domUtils_1.measureText)('Test', { fontSize: 14 });
            // Should return the same cached object
            expect(size1).to.deep.equal(size2);
        });
        it.skipIf(skipIf_1.isJSDOM)('should handle letterSpacing style', function () {
            var sizeWithoutSpacing = (0, domUtils_1.measureText)('Test', { fontSize: 16 });
            var sizeWithSpacing = (0, domUtils_1.measureText)('TestSpaced', { fontSize: 16, letterSpacing: 5 });
            expect(sizeWithoutSpacing.width).to.be.greaterThan(0);
            expect(sizeWithSpacing.width).to.be.greaterThan(0);
        });
        it.skipIf(skipIf_1.isJSDOM)('should convert number text to string', function () {
            var size = (0, domUtils_1.measureText)(123, { fontSize: 16 });
            expect(size.width).to.be.greaterThan(0);
            expect(size.height).to.be.greaterThan(0);
        });
    });
    describe('measureTextBatch', function () {
        beforeEach(function () {
            (0, domUtils_1.clearStringMeasurementCache)();
        });
        it.skipIf(skipIf_1.isJSDOM)('should measure multiple strings', function () {
            var _a, _b, _c;
            var texts = ['Apple', 'Banana', 'Cherry'];
            var sizeMap = (0, domUtils_1.measureTextBatch)(texts, { fontSize: 14 });
            expect(sizeMap.size).to.equal(3);
            expect((_a = sizeMap.get('Apple')) === null || _a === void 0 ? void 0 : _a.width).to.be.greaterThan(0);
            expect((_b = sizeMap.get('Banana')) === null || _b === void 0 ? void 0 : _b.width).to.be.greaterThan(0);
            expect((_c = sizeMap.get('Cherry')) === null || _c === void 0 ? void 0 : _c.width).to.be.greaterThan(0);
        });
        it.skipIf(skipIf_1.isJSDOM)('should use cached values when available', function () {
            var _a, _b;
            // Pre-populate cache
            (0, domUtils_1.measureText)('Cached', { fontSize: 14 });
            var texts = ['Cached', 'New'];
            var sizeMap = (0, domUtils_1.measureTextBatch)(texts, { fontSize: 14 });
            expect(sizeMap.size).to.equal(2);
            expect((_a = sizeMap.get('Cached')) === null || _a === void 0 ? void 0 : _a.width).to.be.greaterThan(0);
            expect((_b = sizeMap.get('New')) === null || _b === void 0 ? void 0 : _b.width).to.be.greaterThan(0);
        });
        it('should handle empty iterable', function () {
            var sizeMap = (0, domUtils_1.measureTextBatch)([], { fontSize: 14 });
            expect(sizeMap.size).to.equal(0);
        });
        it.skipIf(skipIf_1.isJSDOM)('should handle numbers in the iterable', function () {
            var _a;
            var texts = [1, 2, 3];
            var sizeMap = (0, domUtils_1.measureTextBatch)(texts, { fontSize: 14 });
            expect(sizeMap.size).to.equal(3);
            expect((_a = sizeMap.get(1)) === null || _a === void 0 ? void 0 : _a.width).to.be.greaterThan(0);
        });
    });
    describe('clearStringMeasurementCache', function () {
        it.skipIf(skipIf_1.isJSDOM)('should clear the cache', function () {
            // Pre-populate cache
            (0, domUtils_1.measureText)('Test', { fontSize: 14 });
            (0, domUtils_1.clearStringMeasurementCache)();
            // After clearing, measuring the same text should work
            var size = (0, domUtils_1.measureText)('Test', { fontSize: 14 });
            expect(size.width).to.be.greaterThan(0);
        });
    });
});
