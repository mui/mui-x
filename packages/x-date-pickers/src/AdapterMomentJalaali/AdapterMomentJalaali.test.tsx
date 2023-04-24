import * as React from 'react';
import jMoment from 'moment-jalaali';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterMomentJalaali } from '@mui/x-date-pickers/AdapterMomentJalaali';
import { screen } from '@mui/monorepo/test/utils/createRenderer';
import { expect } from 'chai';
import {
  createPickerRenderer,
  expectInputPlaceholder,
  expectInputValue,
} from 'test/utils/pickers-utils';
import 'moment/locale/fa';
import moment from 'moment';
import { AdapterFormats } from '@mui/x-date-pickers/models';
import { TEST_DATE_ISO } from '@mui/x-date-pickers/tests/describeGregorianAdapter';

describe('<AdapterMomentJalaali />', () => {
  describe('Adapter behaviors', () => {
    before(() => {
      jMoment.loadPersian({ dialect: 'persian-modern', usePersianDigits: true });
    });

    after(() => {
      moment.locale('en');
    });

    const adapter = new AdapterMomentJalaali();
    const testDate = adapter.date(TEST_DATE_ISO)!;

    it('Method: toJMoment', () => {
      // @ts-ignore
      const date = adapter.toJMoment(adapter.date()!);

      expect(date).to.not.equal(null);
    });

    it('Method: date', () => {
      expect(adapter.date(null)).to.equal(null);
    });

    it('Method: parse', () => {
      expect(adapter.parse('', 'jYYYY/jM/jD')).to.equal(null);
      expect(adapter.parse('01/01/1395', 'jYYYY/jM/jD')).to.not.equal(null);
    });

    it('Method: formatNumber', () => {
      expect(adapter.formatNumber('1')).to.equal('۱');
      expect(adapter.formatNumber('2')).to.equal('۲');
    });

    it('Method: isEqual', () => {
      const anotherDate = adapter.date(TEST_DATE_ISO);

      expect(adapter.isEqual(testDate, anotherDate)).to.equal(true);
      expect(adapter.isEqual(null, null)).to.equal(true);
    });

    it('Methods: isAfterYear', () => {
      const afterYear = testDate.clone().add(2, 'year');
      expect(adapter.isAfterYear(afterYear, testDate)).to.equal(true);
    });

    it('Methods: isBeforeYear', () => {
      const afterYear = testDate.clone().add(2, 'year');
      expect(adapter.isBeforeYear(testDate, afterYear)).to.equal(true);
    });

    it('Method: startOfYear', () => {
      expect(adapter.startOfYear(testDate).toISOString()).to.equal('2018-03-21T00:00:00.000Z');
    });

    it('Method: startOfMonth', () => {
      expect(adapter.startOfMonth(testDate).toISOString()).to.equal('2018-10-23T00:00:00.000Z');
    });

    it('Method: endOfYear', () => {
      expect(adapter.endOfYear(testDate).toISOString()).to.equal('2019-03-20T23:59:59.999Z');
    });

    it('Method: endOfMonth', () => {
      expect(adapter.endOfMonth(testDate).toISOString()).to.equal('2018-11-21T23:59:59.999Z');
    });

    it('Methods: getYear', () => {
      expect(adapter.getYear(testDate)).to.equal(1397);
    });

    it('Method: getMonth', () => {
      expect(adapter.getMonth(testDate)).to.equal(7);
    });

    it('Method: getDate', () => {
      expect(adapter.getDate(testDate)).to.equal(8);
    });

    it('Method: setYear', () => {
      expect(adapter.setYear(testDate, 1398).toISOString()).to.equal('2019-10-30T11:44:00.000Z');
    });

    it('Method: setDate', () => {
      expect(adapter.setDate(testDate, 9).toISOString()).to.equal('2018-10-31T11:44:00.000Z');
    });

    it('Method: getNextMonth', () => {
      expect(adapter.getNextMonth(testDate).toISOString()).to.equal('2018-11-29T11:44:00.000Z');
    });

    it('Method: getPreviousMonth', () => {
      expect(adapter.getPreviousMonth(testDate).toISOString()).to.equal('2018-09-30T11:44:00.000Z');
    });

    it('Method: getWeekdays', () => {
      expect(adapter.getWeekdays()).to.deep.equal(['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']);
    });

    it('Method: getWeekArray', () => {
      const array = adapter.getWeekArray(testDate);

      expect(array.map((innerArray) => innerArray.map((dt) => dt.toISOString()))).to.deep.equal([
        [
          '2018-10-20T00:00:00.000Z',
          '2018-10-21T00:00:00.000Z',
          '2018-10-22T00:00:00.000Z',
          '2018-10-23T00:00:00.000Z',
          '2018-10-24T00:00:00.000Z',
          '2018-10-25T00:00:00.000Z',
          '2018-10-26T00:00:00.000Z',
        ],
        [
          '2018-10-27T00:00:00.000Z',
          '2018-10-28T00:00:00.000Z',
          '2018-10-29T00:00:00.000Z',
          '2018-10-30T00:00:00.000Z',
          '2018-10-31T00:00:00.000Z',
          '2018-11-01T00:00:00.000Z',
          '2018-11-02T00:00:00.000Z',
        ],
        [
          '2018-11-03T00:00:00.000Z',
          '2018-11-04T00:00:00.000Z',
          '2018-11-05T00:00:00.000Z',
          '2018-11-06T00:00:00.000Z',
          '2018-11-07T00:00:00.000Z',
          '2018-11-08T00:00:00.000Z',
          '2018-11-09T00:00:00.000Z',
        ],
        [
          '2018-11-10T00:00:00.000Z',
          '2018-11-11T00:00:00.000Z',
          '2018-11-12T00:00:00.000Z',
          '2018-11-13T00:00:00.000Z',
          '2018-11-14T00:00:00.000Z',
          '2018-11-15T00:00:00.000Z',
          '2018-11-16T00:00:00.000Z',
        ],
        [
          '2018-11-17T00:00:00.000Z',
          '2018-11-18T00:00:00.000Z',
          '2018-11-19T00:00:00.000Z',
          '2018-11-20T00:00:00.000Z',
          '2018-11-21T00:00:00.000Z',
          '2018-11-22T00:00:00.000Z',
          '2018-11-23T00:00:00.000Z',
        ],
      ]);
    });

    it('Method: getWeekNumber', () => {
      expect(adapter.getWeekNumber!(testDate)).to.equal(33);
    });

    it('Method: getYearRange', () => {
      const anotherDate = adapter.setYear(testDate, 1400);
      const yearRange = adapter.getYearRange(testDate, anotherDate);
      expect(yearRange).to.have.length(4);
    });

    it('Method: getMeridiemText', () => {
      expect(adapter.getMeridiemText('am')).to.equal('ق.ظ');
      expect(adapter.getMeridiemText('pm')).to.equal('ب.ظ');
    });
  });

  describe('Adapter localization', () => {
    before(() => {
      jMoment.loadPersian({ dialect: 'persian-modern', usePersianDigits: true });
    });

    after(() => {
      moment.locale('en');
    });

    it('Formatting', () => {
      const adapter = new AdapterMomentJalaali();

      const expectDate = (format: keyof AdapterFormats, expectedWithEn: string) => {
        const date = adapter.date('2020-02-01T23:44:00.000Z')!;

        expect(adapter.format(date, format)).to.equal(expectedWithEn);
      };

      expectDate('fullDate', '۱۳۹۸، بهمن ۱م');
      expectDate('fullDateWithWeekday', 'شنبه ۱م بهمن ۱۳۹۸');
      expectDate('fullDateTime', '۱۳۹۸، بهمن ۱م، ۱۱:۴۴ ب.ظ');
      expectDate('fullDateTime12h', '۱۲ بهمن ۱۱:۴۴ ب.ظ');
      expectDate('fullDateTime24h', '۱۲ بهمن ۲۳:۴۴');
      expectDate('keyboardDate', '۱۳۹۸/۱۱/۱۲');
      expectDate('keyboardDateTime', '۱۳۹۸/۱۱/۱۲ ۲۳:۴۴');
      expectDate('keyboardDateTime12h', '۱۳۹۸/۱۱/۱۲ ۱۱:۴۴ ب.ظ');
      expectDate('keyboardDateTime24h', '۱۳۹۸/۱۱/۱۲ ۲۳:۴۴');
    });
  });

  describe('Picker localization', () => {
    before(() => {
      jMoment.loadPersian();
    });

    after(() => {
      moment.locale('en');
    });

    const testDate = new Date(2018, 4, 15, 9, 35);
    const localizedTexts = {
      fa: {
        placeholder: 'YYYY/MM/DD hh:mm',
        value: '1397/02/25 09:35',
      },
    };

    Object.keys(localizedTexts).forEach((localeKey) => {
      const localeObject = { code: localeKey };

      describe(`test with the locale "${localeKey}"`, () => {
        const { render, adapter } = createPickerRenderer({
          clock: 'fake',
          adapterName: 'moment-jalaali',
          locale: localeObject,
        });

        it('should have correct placeholder', () => {
          render(<DateTimePicker />);

          expectInputPlaceholder(
            screen.getByRole('textbox'),
            localizedTexts[localeKey].placeholder,
          );
        });

        it('should have well formatted value', () => {
          render(<DateTimePicker value={adapter.date(testDate)} />);

          expectInputValue(screen.getByRole('textbox'), localizedTexts[localeKey].value);
        });
      });
    });
  });
});
