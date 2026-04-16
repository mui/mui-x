import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  getSectionVisibleValue,
  parseSelectedSections,
  getSectionsBoundaries,
} from './useField.utils';

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

const DEFAULT_LOCALIZED_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

describe('useField utility functions', () => {
  describe('getSectionVisibleValue', () => {
    it('should not add invisible space when target = "non-input"', () => {
      expect(
        getSectionVisibleValue(
          { ...COMMON_PROPERTIES, value: '1', placeholder: '', hasLeadingZerosInInput: true },
          'non-input',
          DEFAULT_LOCALIZED_DIGITS,
        ),
      ).to.equal('1');
    });

    it('should add invisible space when target = "input-ltr" and the value is a single digit with non-trailing zeroes', () => {
      expect(
        getSectionVisibleValue(
          { ...COMMON_PROPERTIES, value: '1', placeholder: '', hasLeadingZerosInInput: false },
          'input-ltr',
          DEFAULT_LOCALIZED_DIGITS,
        ),
      ).to.equal('1\u200e');
    });

    it('should add invisible space and RTL boundaries when target = "input-rtl" and the value is a single digit with non-trailing zeroes', () => {
      expect(
        getSectionVisibleValue(
          { ...COMMON_PROPERTIES, value: '1', placeholder: '', hasLeadingZerosInInput: false },
          'input-rtl',
          DEFAULT_LOCALIZED_DIGITS,
        ),
      ).to.equal('\u20681\u200e\u2069');
    });

    it('should add RTL boundaries when target = "input-rtl"', () => {
      expect(
        getSectionVisibleValue(
          { ...COMMON_PROPERTIES, value: '1', placeholder: '', hasLeadingZerosInInput: true },
          'input-rtl',
          DEFAULT_LOCALIZED_DIGITS,
        ),
      ).to.equal('\u20681\u2069');
    });
  });

  describe('parseSelectedSections', () => {
    it('should return null when selectedSections is not available in sections', () => {
      expect(parseSelectedSections('year', [])).to.equal(null);
    });
  });
  describe('getSectionsBoundaries', () => {
    const adapter = new AdapterDateFns();
    const timezone = 'default';

    it('should return correct boundaries for hours with "h" format', () => {
      const boundaries = getSectionsBoundaries(adapter, DEFAULT_LOCALIZED_DIGITS, timezone);
      const hoursBoundaries = boundaries.hours({ currentDate: null, format: 'h', contentType: 'digit' });
      expect(hoursBoundaries.minimum).to.equal(1);
      expect(hoursBoundaries.maximum).to.equal(12);
    });

    it('should return correct boundaries for hours with "K" format', () => {
      const boundaries = getSectionsBoundaries(adapter, DEFAULT_LOCALIZED_DIGITS, timezone);
      const hoursBoundaries = boundaries.hours({ currentDate: null, format: 'K', contentType: 'digit' });
      expect(hoursBoundaries.minimum).to.equal(0);
      expect(hoursBoundaries.maximum).to.equal(11);
    });

    it('should return correct boundaries for hours with "HH" format', () => {
      const boundaries = getSectionsBoundaries(adapter, DEFAULT_LOCALIZED_DIGITS, timezone);
      const hoursBoundaries = boundaries.hours({ currentDate: null, format: 'HH', contentType: 'digit' });
      expect(hoursBoundaries.minimum).to.equal(0);
      expect(hoursBoundaries.maximum).to.equal(23);
    });
  });
});
