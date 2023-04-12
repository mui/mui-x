import * as React from 'react';
import { spy } from 'sinon';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { screen, userEvent } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import {
  buildPickerDragInteractions,
  createPickerRenderer,
  expectInputPlaceholder,
  expectInputValue,
  MockedDataTransfer,
} from 'test/utils/pickers-utils';
import 'dayjs/locale/fr';
import 'dayjs/locale/de';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import {
  describeGregorianAdapter,
  TEST_DATE_ISO,
} from 'packages/x-date-pickers/src/tests/describeGregorianAdapter';
import { AdapterFormats } from '@mui/x-date-pickers';

dayjs.extend(utc);

const testDate = new Date(2018, 4, 15, 9, 35);
const localizedTexts = {
  undefined: {
    placeholder: 'MM/DD/YYYY hh:mm aa',
    value: '05/15/2018 09:35 AM',
  },
  fr: {
    placeholder: 'DD/MM/YYYY hh:mm',
    value: '15/05/2018 09:35',
  },
  de: {
    placeholder: 'DD.MM.YYYY hh:mm',
    value: '15.05.2018 09:35',
  },
};
describe('<AdapterDayjs />', () => {
  describeGregorianAdapter(AdapterDayjs, { formatDateTime: 'YYYY-MM-DD HH:mm:ss' });

  describe('Adapter localization', () => {
    describe('Russian', () => {
      const adapter = new AdapterDayjs({ instance: dayjs, locale: 'ru' });
      const date = adapter.date(TEST_DATE_ISO)!;

      it('getWeekdays: should start from monday', () => {
        const result = adapter.getWeekdays();
        expect(result).to.deep.equal(['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']);
      });

      it('getWeekArray: week should start from monday', () => {
        const result = adapter.getWeekArray(date);
        expect(result[0][0].format('dd')).to.equal('пн');
      });

      it('is12HourCycleInCurrentLocale: properly determine should use meridiem or not', () => {
        expect(adapter.is12HourCycleInCurrentLocale()).to.equal(false);
      });

      it('getCurrentLocaleCode: returns locale code', () => {
        expect(adapter.getCurrentLocaleCode()).to.equal('ru');
      });
    });

    describe('English', () => {
      const adapter = new AdapterDayjs({ instance: dayjs, locale: 'en' });
      const date = adapter.date(TEST_DATE_ISO)!;

      it('getWeekdays: should start from sunday', () => {
        const result = adapter.getWeekdays();
        expect(result).to.deep.equal(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
      });

      it('getWeekArray: week should start from sunday', () => {
        const result = adapter.getWeekArray(date);
        expect(result[0][0].format('dd')).to.equal('Su');
      });

      it('is12HourCycleInCurrentLocale: properly determine should use meridiem or not', () => {
        expect(adapter.is12HourCycleInCurrentLocale()).to.equal(true);
      });
    });

    it('Formatting', () => {
      const adapter = new AdapterDayjs({ locale: 'en' });
      const adapterRu = new AdapterDayjs({ locale: 'ru' });

      const expectDate = (
        format: keyof AdapterFormats,
        expectedWithEn: string,
        expectedWithRu: string,
      ) => {
        const date = adapter.date('2020-02-01T23:44:00.000Z')!;

        expect(adapter.format(date, format)).to.equal(expectedWithEn);
        expect(adapterRu.format(date, format)).to.equal(expectedWithRu);
      };

      expectDate('fullDate', 'Feb 1, 2020', '1 февр. 2020 г.');
      expectDate('fullDateWithWeekday', 'Saturday, February 1, 2020', 'суббота, 1 февраля 2020 г.');
      expectDate('fullDateTime', 'Feb 1, 2020 11:44 PM', '1 февр. 2020 г., 23:44');
      expectDate('fullDateTime12h', 'Feb 1, 2020 11:44 PM', '1 февр. 2020 г. 11:44 вечера');
      expectDate('fullDateTime24h', 'Feb 1, 2020 23:44', '1 февр. 2020 г. 23:44');
      expectDate('keyboardDate', '02/01/2020', '01.02.2020');
      expectDate('keyboardDateTime', '02/01/2020 11:44 PM', '01.02.2020 23:44');
      expectDate('keyboardDateTime12h', '02/01/2020 11:44 PM', '01.02.2020 11:44 вечера');
      expectDate('keyboardDateTime24h', '02/01/2020 23:44', '01.02.2020 23:44');
    });
  });

  describe('Picker localization', () => {
    Object.keys(localizedTexts).forEach((localeKey) => {
      const localeName = localeKey === 'undefined' ? 'default' : `"${localeKey}"`;
      const localeObject = localeKey === 'undefined' ? undefined : { code: localeKey };

      describe(`test with the ${localeName} locale`, () => {
        const { render, adapter } = createPickerRenderer({
          clock: 'fake',
          adapterName: 'dayjs',
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

    it('should return the correct week number', () => {
      const localizedAdapter = new AdapterDayjs({ locale: 'fr' });

      const dateToTest = localizedAdapter.date(new Date(2022, 10, 10))!;

      expect(localizedAdapter.getWeekNumber(dateToTest)).to.equal(45);
    });
  });

  describe('UTC plugin', () => {
    const { render } = createPickerRenderer({
      clock: 'fake',
      adapterName: 'dayjs',
    });

    it('should not create UTC dates when no instance passed', () => {
      const onChange = spy();
      render(<DateCalendar defaultValue={dayjs('2022-04-17')} onChange={onChange} />);

      userEvent.mousePress(screen.getByRole('gridcell', { name: '1' }));

      const date = onChange.lastCall.firstArg;
      expect(date).to.not.equal(null);
      expect(date!.isUTC()).to.equal(false);
    });

    it('should create UTC dates when the instance is a UTC instance', () => {
      const onChange = spy();
      render(
        <LocalizationProvider dateAdapter={AdapterDayjs} dateLibInstance={dayjs.utc}>
          <DateCalendar defaultValue={dayjs.utc('2022-04-17')} onChange={onChange} />
        </LocalizationProvider>,
      );

      userEvent.mousePress(screen.getByRole('gridcell', { name: '1' }));

      const date = onChange.lastCall.firstArg;
      expect(date).to.not.equal(null);
      expect(date!.isUTC()).to.equal(true);
    });

    it('should not loose UTC when dragging', function test() {
      if (!document.elementFromPoint) {
        this.skip();
      }

      const dataTransfer = new MockedDataTransfer();
      const { executeDateDrag } = buildPickerDragInteractions(() => dataTransfer);

      const onChange = spy();
      const initialValue: [any, any] = [dayjs.utc('2022-04-17'), dayjs.utc('2022-04-21')];
      render(
        <LocalizationProvider dateAdapter={AdapterDayjs} dateLibInstance={dayjs.utc}>
          <DateRangeCalendar onChange={onChange} defaultValue={initialValue} calendars={1} />
        </LocalizationProvider>,
      );

      executeDateDrag(
        screen.getByRole('gridcell', { name: '21', selected: true }),
        screen.getByRole('gridcell', { name: '22' }),
        screen.getByRole('gridcell', { name: '23' }),
      );

      expect(onChange.callCount).to.equal(1);
      const [startDate, endDate] = onChange.lastCall.firstArg;
      expect(startDate.isUTC()).to.equal(true);
      expect(endDate.isUTC()).to.equal(true);
    });
  });
});
