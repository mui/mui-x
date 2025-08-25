"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var md5_1 = require("./md5");
describe('License: md5', function () {
    var clearStr1 = 'TkFNRT1EQU1JRU5fVEFTU09ORSxERVZFTE9QRVJfQ09VTlQ9OSxFWFBJUlk9MjAvMDEvMjAyMSxWRVJTSU9OPTIzMg==';
    var encodedStr1 = '7f4bf70a5169db5bc60d8bd34533ccd4';
    var clearStr2 = 'COMPANY=DAMIEN_INC,EXPIRY=20/08/2021,VERSION=1.1.31';
    var encodedStr2 = '7b8ffdf88743eeba24113175aee97a97';
    var clearStr3 = 'Je suis a la mode';
    var encodedStr3 = '8a59b141a26e95b5020e04ed5d4877dd';
    it('should hash string properly', function () {
        expect((0, md5_1.md5)(clearStr1)).to.equal(encodedStr1);
        expect((0, md5_1.md5)(clearStr2)).to.equal(encodedStr2);
        expect((0, md5_1.md5)(clearStr3)).to.equal(encodedStr3);
    });
});
