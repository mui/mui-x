import { expect } from 'chai';
import { getSectionVisibleValue } from './useField.utils';

const COMMON_PROPERTIES = {
  startSeparator: '',
  endSeparator: '',
  contentType: 'digit',
  type: 'year',
  modified: false,
  format: 'YYYY',
  hasLeadingZerosInFormat: true,
  maxLength: 4,
} as const;

describe('useField utility functions', () => {
  describe('getSectionVisibleValue', () => {
    it('should not add invisible space when target = "non-input"', () => {
      expect(
        getSectionVisibleValue(
          { ...COMMON_PROPERTIES, value: '1', placeholder: '', hasLeadingZerosInInput: true },
          'non-input',
        ),
      ).to.equal('1');
    });

    it('should add invisible space when target = "input-ltr" and the value is a single digit with non-trailing zeroes', () => {
      expect(
        getSectionVisibleValue(
          { ...COMMON_PROPERTIES, value: '1', placeholder: '', hasLeadingZerosInInput: false },
          'input-ltr',
        ),
      ).to.equal('1\u200e');
    });

    it('should add invisible space and RTL boundaries when target = "input-rtl" and the value is a single digit with non-trailing zeroes', () => {
      expect(
        getSectionVisibleValue(
          { ...COMMON_PROPERTIES, value: '1', placeholder: '', hasLeadingZerosInInput: false },
          'input-rtl',
        ),
      ).to.equal('\u20681\u200e\u2069');
    });

    it('should add RTL boundaries when target = "input-rtl"', () => {
      expect(
        getSectionVisibleValue(
          { ...COMMON_PROPERTIES, value: '1', placeholder: '', hasLeadingZerosInInput: true },
          'input-rtl',
        ),
      ).to.equal('\u20681\u2069');
    });
  });
});
