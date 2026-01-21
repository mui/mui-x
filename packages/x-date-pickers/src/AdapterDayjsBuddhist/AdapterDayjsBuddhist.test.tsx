import { Dayjs } from 'dayjs';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { AdapterDayjsBuddhist } from '@mui/x-date-pickers/AdapterDayjsBuddhist';
import {
  createPickerRenderer,
  expectFieldValueV7,
  buildFieldInteractions,
} from 'test/utils/pickers';
import 'dayjs/locale/th';

const BUDDHIST_YEAR_OFFSET = 543;

describe('<AdapterDayjsBuddhist />', () => {
  // Test date: 2018-10-30T11:44:00.000Z
  const TEST_DATE_ISO_STRING = '2018-10-30T11:44:00.000Z';

  describe('Adapter methods', () => {
    const adapter = new AdapterDayjsBuddhist();
    const testDate = adapter.date(TEST_DATE_ISO_STRING) as Dayjs;

    it('Method: getYear - should return Buddhist year', () => {
      // 2018 + 543 = 2561
      expect(adapter.getYear(testDate)).to.equal(2018 + BUDDHIST_YEAR_OFFSET);
    });

    it('Method: setYear - should accept Buddhist year', () => {
      // Setting Buddhist year 2565 should result in Gregorian 2022
      const newDate = adapter.setYear(testDate, 2565) as Dayjs;
      expect(adapter.toJsDate(newDate).getFullYear()).to.equal(2022);
      expect(adapter.getYear(newDate)).to.equal(2565);
    });

    it('Method: parse - should parse Buddhist year format', () => {
      const parsed = adapter.parse('01/02/2565', 'DD/MM/BBBB') as Dayjs;
      expect(parsed).not.to.equal(null);
      expect(adapter.isValid(parsed)).to.equal(true);
      // Buddhist year 2565 = Gregorian 2022
      expect(adapter.toJsDate(parsed).getFullYear()).to.equal(2022);
      expect(adapter.getYear(parsed)).to.equal(2565);
    });

    it('Method: parse - should handle empty string', () => {
      expect(adapter.parse('', 'DD/MM/BBBB')).to.equal(null);
    });

    it('Method: parse - should work with non-Buddhist format', () => {
      const parsed = adapter.parse('01/02/2022', 'DD/MM/YYYY') as Dayjs;
      expect(parsed).not.to.equal(null);
      expect(adapter.toJsDate(parsed).getFullYear()).to.equal(2022);
    });

    it('Method: format - should format with Buddhist year', () => {
      const formatted = adapter.formatByString(testDate, 'DD/MM/BBBB');
      expect(formatted).to.equal('30/10/2561');
    });

    it('Method: isValid', () => {
      expect(adapter.isValid(testDate)).to.equal(true);
      expect(adapter.isValid(null)).to.equal(false);
    });

    it('Method: isSameYear - should compare correctly', () => {
      const sameYear = adapter.date('2018-05-15T00:00:00.000Z') as Dayjs;
      const differentYear = adapter.date('2019-10-30T00:00:00.000Z') as Dayjs;
      expect(adapter.isSameYear(testDate, sameYear)).to.equal(true);
      expect(adapter.isSameYear(testDate, differentYear)).to.equal(false);
    });

    it('should use BBBB format for year by default', () => {
      expect(adapter.formats.year).to.equal('BBBB');
    });
  });

  describe('Picker localization', () => {
    const testDate = '2018-05-15T09:35:00';

    describe('with Thai locale', () => {
      const { render, adapter } = createPickerRenderer({
        adapterName: 'dayjs-buddhist',
        locale: 'th',
      });

      const { renderWithProps } = buildFieldInteractions({
        render,
        Component: DateTimeField,
      });

      it('should have well formatted value', () => {
        const view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          value: adapter.date(testDate),
        });

        // Thai locale format with Buddhist year
        expectFieldValueV7(view.getSectionsContainer(), '15/05/2561 09:35 ก่อนเที่ยง');
      });
    });
  });
});
