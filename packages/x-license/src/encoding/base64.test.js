"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var base64_1 = require("./base64");
describe('License: base64', function () {
    var clearStr1 = "HELLO my name is Bryan amd I'm awesome!";
    var encodedStr1 = 'SEVMTE8gbXkgbmFtZSBpcyBCcnlhbiBhbWQgSSdtIGF3ZXNvbWUh';
    var clearStr2 = 'COMPANY=DAMIEN_INC,EXPIRY=20/08/2021,VERSION=1.1.31';
    var encodedStr2 = 'Q09NUEFOWT1EQU1JRU5fSU5DLEVYUElSWT0yMC8wOC8yMDIxLFZFUlNJT049MS4xLjMx';
    it('should encode string properly', function () {
        expect((0, base64_1.base64Encode)(clearStr1)).to.equal(encodedStr1);
        expect((0, base64_1.base64Encode)(clearStr2)).to.equal(encodedStr2);
    });
    it('should decode string properly', function () {
        expect((0, base64_1.base64Decode)(encodedStr1)).to.equal(clearStr1);
        expect((0, base64_1.base64Decode)(encodedStr2)).to.equal(clearStr2);
    });
    it('should fail if using none ASCII string', function () {
        expect(function () { return (0, base64_1.base64Encode)('✓ à la mode'); }).to.throw(/ASCII only support/);
    });
});
