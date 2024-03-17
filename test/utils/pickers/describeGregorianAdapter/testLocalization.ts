import { expect } from 'chai';
import { AdapterFormats } from '@mui/x-date-pickers/models';
import { cleanText } from 'test/utils/pickers';
import { DescribeGregorianAdapterTestSuite } from './describeGregorianAdapter.types';
import { TEST_DATE_ISO_STRING } from './describeGregorianAdapter.utils';

export const testLocalization: DescribeGregorianAdapterTestSuite = ({ adapter }) => {
  const testDateIso = adapter.date(TEST_DATE_ISO_STRING)!;

  it('Method: formatNumber', () => {
    expect(adapter.formatNumber('1')).to.equal('1');
  });

  it('Method: expandFormat', () => {
    const testFormat = (formatKey: keyof AdapterFormats) => {
      const formatString = adapter.formats[formatKey];
      const expandedFormat = cleanText(adapter.expandFormat(formatString));

      if (
        expandedFormat === formatString ||
        (adapter.lib === 'luxon' && formatString === 'ccccc')
      ) {
        // Luxon format 'ccccc' is not supported by the field components since multiple day can have the same one-letter value (e.g: Tuesday and Thursday).
        // It is used in the calendar header to display the day of the weeks.
        // Format 'ccccc' is not supported for the field fomrat since multiple day can have the same short
        // It's used to display calendar days.
        return;
      }

      // The expanded format should be fully expanded
      expect(cleanText(adapter.expandFormat(expandedFormat))).to.equal(expandedFormat);

      // Both format should be equivalent
      expect(cleanText(adapter.formatByString(testDateIso, expandedFormat))).to.equal(
        cleanText(adapter.format(testDateIso, formatKey)),
      );
    };

    Object.keys(adapter.formats).forEach((formatKey) => {
      testFormat(formatKey as keyof AdapterFormats);
    });
  });

  it('Method: getCurrentLocaleCode', () => {
    // Returns the default locale
    expect(adapter.getCurrentLocaleCode()).to.match(/en/);
  });
};
