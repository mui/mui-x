import { expect } from 'chai';
import { base64Decode, base64Encode } from './base64';

describe('License: base64', () => {
  const clearStr1 = "HELLO my name is Bryan amd I'm awesome!";
  const encodedStr1 = 'SEVMTE8gbXkgbmFtZSBpcyBCcnlhbiBhbWQgSSdtIGF3ZXNvbWUh';
  const clearStr2 = 'COMPANY=DAMIEN_INC,EXPIRY=20/08/2021,VERSION=1.1.31';
  const encodedStr2 = 'Q09NUEFOWT1EQU1JRU5fSU5DLEVYUElSWT0yMC8wOC8yMDIxLFZFUlNJT049MS4xLjMx';
  const clearStr3 = '✓ à la mode';
  const encodedStr3 = '4pyTIMOgIGxhIG1vZGU=';

  it('should encode string properly', () => {
    expect(base64Encode(clearStr1)).to.equal(encodedStr1);
    expect(base64Encode(clearStr2)).to.equal(encodedStr2);
    expect(base64Encode(clearStr3)).to.equal(encodedStr3);
  });

  it('should decode string properly', () => {
    expect(base64Decode(encodedStr1)).to.equal(clearStr1);
    expect(base64Decode(encodedStr2)).to.equal(clearStr2);
    expect(base64Decode(encodedStr3)).to.equal(clearStr3);
  });
});
