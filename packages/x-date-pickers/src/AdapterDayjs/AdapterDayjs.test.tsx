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
  expectInputValue,
  MockedDataTransfer,
} from 'test/utils/pickers-utils';
import 'dayjs/locale/fr';
import 'dayjs/locale/de';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro';

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
  describe('Localization', () => {
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
          render(<DateTimePicker label="test" />);

          expectInputValue(
            screen.getByRole('textbox'),
            localizedTexts[localeKey].placeholder,
            true,
          );
        });

        it('should have well formatted value', () => {
          render(<DateTimePicker label="test" value={adapter.date(testDate)} />);

          expectInputValue(screen.getByRole('textbox'), localizedTexts[localeKey].value, true);
        });
      });
    });

    it('should return the correct week number', () => {
      const localizedAdapter = new AdapterDayjs({ locale: 'fr' });

      const dateToTest = localizedAdapter.date(new Date(2022, 10, 10));

      expect(localizedAdapter.getWeekNumber!(dateToTest)).to.equal(45);
    });
  });

  describe('UTC plugin', () => {
    const { render } = createPickerRenderer({
      clock: 'fake',
      adapterName: 'dayjs',
    });

    it('should not create UTC dates when no instance passed', () => {
      const onChange = spy();
      render(<DateCalendar defaultValue={dayjs('2022-04-10')} onChange={onChange} />);

      userEvent.mousePress(screen.getByRole('gridcell', { name: '1' }));

      const date = onChange.lastCall.firstArg;
      expect(date).to.not.equal(null);
      expect(date!.isUTC()).to.equal(false);
    });

    it('should create UTC dates when the instance is a UTC instance', () => {
      const onChange = spy();
      render(
        <LocalizationProvider dateAdapter={AdapterDayjs} dateLibInstance={dayjs.utc}>
          <DateCalendar defaultValue={dayjs.utc('2022-04-10')} onChange={onChange} />
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
      const initialValue: [any, any] = [dayjs.utc('2022-04-10'), dayjs.utc('2022-04-12')];
      render(
        <LocalizationProvider dateAdapter={AdapterDayjs} dateLibInstance={dayjs.utc}>
          <DateRangeCalendar onChange={onChange} defaultValue={initialValue} calendars={1} />
        </LocalizationProvider>,
      );

      executeDateDrag(
        screen.getByRole('gridcell', { name: '12', selected: true }),
        screen.getByRole('gridcell', { name: '13' }),
        screen.getByRole('gridcell', { name: '14' }),
      );

      expect(onChange.callCount).to.equal(1);
      const [startDate, endDate] = onChange.lastCall.firstArg;
      expect(startDate.isUTC()).to.equal(true);
      expect(endDate.isUTC()).to.equal(true);
    });
  });
});
