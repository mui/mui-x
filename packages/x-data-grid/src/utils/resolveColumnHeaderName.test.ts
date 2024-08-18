import { expect } from 'chai';
import { resolveColumnHeaderName, isStringHeaderName } from './resolveColumnHeaderName';

describe('resolveColumnHeaderName', () => {
  describe('isStringHeaderName', () => {
    it('[headerName: string]', () => {
      const headerName = resolveColumnHeaderName('Field', isStringHeaderName);

      expect(headerName).to.equal('Field');
    });

    it('[headerName: (): string]', () => {
      const headerName = resolveColumnHeaderName(() => 'Field', isStringHeaderName);

      expect(headerName).to.equal('Field');
    });

    it('[headerName: (): number]', () => {
      const headerName3 = resolveColumnHeaderName(() => 3, isStringHeaderName);

      expect(headerName3).to.equal(undefined);
    });
  });
});
