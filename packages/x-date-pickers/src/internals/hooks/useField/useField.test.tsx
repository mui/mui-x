import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DEFAULT_LOCALE } from '@mui/x-date-pickers/locales';
import {
  getSectionVisibleValue,
  getSectionsBoundaries,
  parseSelectedSections,
} from './useField.utils';
import { buildSectionsFromFormat } from './buildSectionsFromFormat';

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
    const boundaries = getSectionsBoundaries(adapter, DEFAULT_LOCALIZED_DIGITS, 'default');

    it('should return correct boundaries for "h" format (hour 1-12)', () => {
      const result = boundaries.hours({ currentDate: null, format: 'h', contentType: 'digit' });
      expect(result.minimum).to.equal(1);
      expect(result.maximum).to.equal(12);
    });

    it('should return correct boundaries for "hh" format (hour 1-12, padded)', () => {
      const result = boundaries.hours({ currentDate: null, format: 'hh', contentType: 'digit' });
      expect(result.minimum).to.equal(1);
      expect(result.maximum).to.equal(12);
    });

    it('should return correct boundaries for "K" format (hour 0-11)', () => {
      const result = boundaries.hours({ currentDate: null, format: 'K', contentType: 'digit' });
      expect(result.minimum).to.equal(0);
      expect(result.maximum).to.equal(11);
    });

    it('should return correct boundaries for "KK" format (hour 0-11, padded)', () => {
      const result = boundaries.hours({ currentDate: null, format: 'KK', contentType: 'digit' });
      expect(result.minimum).to.equal(0);
      expect(result.maximum).to.equal(11);
    });

    it('should return correct boundaries for "H" format (hour 0-23)', () => {
      const result = boundaries.hours({ currentDate: null, format: 'H', contentType: 'digit' });
      expect(result.minimum).to.equal(0);
      expect(result.maximum).to.equal(23);
    });

    it('should return correct boundaries for "HH" format (hour 0-23, padded)', () => {
      const result = boundaries.hours({ currentDate: null, format: 'HH', contentType: 'digit' });
      expect(result.minimum).to.equal(0);
      expect(result.maximum).to.equal(23);
    });

    it('should return correct boundaries for "k" format (hour 1-24)', () => {
      const result = boundaries.hours({ currentDate: null, format: 'k', contentType: 'digit' });
      expect(result.minimum).to.equal(1);
      expect(result.maximum).to.equal(24);
    });

    it('should return correct boundaries for "kk" format (hour 1-24, padded)', () => {
      const result = boundaries.hours({ currentDate: null, format: 'kk', contentType: 'digit' });
      expect(result.minimum).to.equal(1);
      expect(result.maximum).to.equal(24);
    });
  });

  describe('buildSectionsFromFormat – formatTokenMap section parsing', () => {
    const adapter = new AdapterDateFns();
    const BASE_PARAMS = {
      adapter,
      formatDensity: 'dense' as const,
      isRtl: false,
      shouldRespectLeadingZeros: false,
      localeText: DEFAULT_LOCALE,
      localizedDigits: DEFAULT_LOCALIZED_DIGITS,
      date: null,
    };

    it('should parse "KK:mm aa" into [hours, minutes, meridiem] sections', () => {
      const sections = buildSectionsFromFormat({ ...BASE_PARAMS, format: 'KK:mm aa' });
      expect(sections.map((s) => s.type)).to.deep.equal(['hours', 'minutes', 'meridiem']);
      expect(sections[0].format).to.equal('KK');
    });

    it('should parse "kk:mm" into [hours, minutes] sections', () => {
      const sections = buildSectionsFromFormat({ ...BASE_PARAMS, format: 'kk:mm' });
      expect(sections.map((s) => s.type)).to.deep.equal(['hours', 'minutes']);
      expect(sections[0].format).to.equal('kk');
    });
  });
});
