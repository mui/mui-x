import { expect } from 'chai';
import { getColumnHeaderName, isStringHeaderName } from './getColumnHeaderName';

describe('getColumnHeaderName', () => {
  describe('isStringHeaderName', () => {
    it('[headerName: string]', () => {
      const headerName = getColumnHeaderName(
        {
          headerName: 'Field',
          field: 'field',
        },
        isStringHeaderName,
      );

      expect(headerName).to.equal('Field');
    });

    it('[headerName: (): string]', () => {
      const headerName = getColumnHeaderName(
        {
          headerName: () => 'Field',
          field: 'field',
        },
        isStringHeaderName,
      );

      expect(headerName).to.equal('Field');
    });

    it('[headerName: (): number]', () => {
      const headerName3 = getColumnHeaderName(
        {
          headerName: () => 3,
          field: 'field',
        },
        isStringHeaderName,
      );

      expect(headerName3).to.equal('field');
    });
  });

  describe('fallbackToField', () => {
    it('enabled', () => {
      const headerName = getColumnHeaderName(
        {
          field: 'field',
        },
        isStringHeaderName,
        true,
      );

      expect(headerName).to.equal('field');
    });

    it('disabled', () => {
      const headerName = getColumnHeaderName(
        {
          headerName: undefined,
          field: 'field',
        },
        isStringHeaderName,
        false,
      );

      expect(headerName).to.equal(undefined);
    });
  });
});
