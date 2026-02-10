"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var domUtils_1 = require("./domUtils");
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
