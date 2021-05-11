import { expect } from 'chai';
import { md5 } from './md5';

describe('License: md5', () => {
  const clearStr1 =
    'TkFNRT1EQU1JRU5fVEFTU09ORSxERVZFTE9QRVJfQ09VTlQ9OSxFWFBJUlk9MjAvMDEvMjAyMSxWRVJTSU9OPTIzMg==';
  const encodedStr1 = '7f4bf70a5169db5bc60d8bd34533ccd4';
  const clearStr2 = 'COMPANY=DAMIEN_INC,EXPIRY=20/08/2021,VERSION=1.1.31';
  const encodedStr2 = '7b8ffdf88743eeba24113175aee97a97';
  const clearStr3 = 'Je suis a la mode';
  const encodedStr3 = '8a59b141a26e95b5020e04ed5d4877dd';

  it('should hash string properly', () => {
    expect(md5(clearStr1)).to.equal(encodedStr1);
    expect(md5(clearStr2)).to.equal(encodedStr2);
    expect(md5(clearStr3)).to.equal(encodedStr3);
  });
});
