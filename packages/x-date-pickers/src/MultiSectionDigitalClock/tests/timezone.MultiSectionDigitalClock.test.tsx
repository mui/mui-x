import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import moment from 'moment';
import momentTZ from 'moment-timezone';
import { fireEvent, screen } from '@mui/internal-test-utils';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterName, createPickerRenderer } from 'test/utils/pickers';

const TIMEZONE_COMPATIBLE_ADAPTERS: AdapterName[] = ['dayjs', 'luxon', 'moment'];

const getHourLabels = () =>
  screen
    .getAllByRole('option')
    .filter((option) => option.getAttribute('aria-label')?.endsWith('hours'))
    .map((option) => option.textContent);

const HOURS_12H = ['12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'];
const HOURS_24H = Array.from({ length: 24 }, (_, h) => h.toString().padStart(2, '0'));

describe('<MultiSectionDigitalClock /> - Timezone', () => {
  TIMEZONE_COMPATIBLE_ADAPTERS.forEach((adapterName) => {
    describe(`adapter: ${adapterName}`, () => {
      const instance = adapterName === 'moment' ? momentTZ : undefined;

      if (adapterName === 'moment') {
        // Other suites can leave moment's global locale on a non-`en` value
        // (e.g. Arabic-Hindi digits), which would break the literal label
        // assertions below. Reset before instantiating any renderers.
        moment.locale('en');
      }

      describe('DST spring-forward day', () => {
        // The `now` ref captured by `useNow` lands on the DST day, which is
        // what triggers the duplicate-label bug from issue #22084.
        const { render, adapter } = createPickerRenderer({
          adapterName,
          clock: 'fake',
          clockConfig: new Date('2026-03-08T15:00:00.000Z'),
          instance,
        });

        it('should render every 12-hour hour exactly once', () => {
          const value = adapter.date('2026-03-08T04:00:00', 'America/Chicago');
          render(<MultiSectionDigitalClock defaultValue={value} timezone="America/Chicago" ampm />);

          expect(getHourLabels()).to.deep.equal(HOURS_12H);
        });

        it('should render every 24-hour hour exactly once', () => {
          const value = adapter.date('2026-03-08T04:00:00', 'America/Chicago');
          render(
            <MultiSectionDigitalClock
              defaultValue={value}
              timezone="America/Chicago"
              ampm={false}
            />,
          );

          expect(getHourLabels()).to.deep.equal(HOURS_24H);
        });

        it('should render exactly one non-disabled "3 hours" entry', () => {
          // Issue #22084: duplicate disabled "3 hours" entry. Without the fix
          // `getAllByRole` returns 2 matches.
          const value = adapter.date('2026-03-08T03:00:00', 'America/Chicago');
          render(<MultiSectionDigitalClock defaultValue={value} timezone="America/Chicago" ampm />);

          const threeHoursOptions = screen.getAllByRole('option', { name: '3 hours' });
          expect(threeHoursOptions).to.have.length(1);
          expect(threeHoursOptions[0].getAttribute('aria-disabled')).to.equal(null);
        });

        it('should select 4 AM when the user clicks "4 hours"', () => {
          const onChange = spy();
          const value = adapter.date('2026-03-08T03:00:00', 'America/Chicago');
          render(
            <MultiSectionDigitalClock
              defaultValue={value}
              timezone="America/Chicago"
              ampm
              onChange={onChange}
            />,
          );

          fireEvent.click(screen.getByRole('option', { name: '4 hours' }));

          expect(onChange.callCount).to.equal(1);
          expect(adapter.getHours(onChange.lastCall.firstArg)).to.equal(4);
        });

        it('should respect a non-default `timeSteps.hours`', () => {
          const value = adapter.date('2026-03-08T04:00:00', 'America/Chicago');
          render(
            <MultiSectionDigitalClock
              defaultValue={value}
              timezone="America/Chicago"
              ampm
              timeSteps={{ hours: 3 }}
            />,
          );

          expect(getHourLabels()).to.deep.equal(['12', '03', '06', '09']);
        });
      });

      describe('DST fall-back day', () => {
        const { render, adapter } = createPickerRenderer({
          adapterName,
          clock: 'fake',
          clockConfig: new Date('2026-11-01T15:00:00.000Z'),
          instance,
        });

        it('should still render every hour exactly once', () => {
          const value = adapter.date('2026-11-01T04:00:00', 'America/Chicago');
          render(<MultiSectionDigitalClock defaultValue={value} timezone="America/Chicago" ampm />);

          expect(getHourLabels()).to.deep.equal(HOURS_12H);
        });
      });

      describe('midnight DST transition', () => {
        // Brazil's spring-forward used to happen at midnight — last observed
        // 2018-11-04 in `America/Sao_Paulo`.
        const { render, adapter } = createPickerRenderer({
          adapterName,
          clock: 'fake',
          clockConfig: new Date('2018-11-04T15:00:00.000Z'),
          instance,
        });

        it('should not duplicate the midnight label', () => {
          const value = adapter.date('2018-11-04T04:00:00', 'America/Sao_Paulo');
          render(
            <MultiSectionDigitalClock defaultValue={value} timezone="America/Sao_Paulo" ampm />,
          );

          expect(getHourLabels()).to.deep.equal(HOURS_12H);
        });
      });
    });
  });

  describe('Custom hour format on a DST day', () => {
    // `LocalizationProvider`-level plumbing; one adapter is enough.
    const { render, adapter } = createPickerRenderer({
      adapterName: 'dayjs',
      clock: 'fake',
      clockConfig: new Date('2026-03-08T15:00:00.000Z'),
    });

    it('should respect a custom unpadded `hours12h` format', () => {
      const value = adapter.date('2026-03-08T04:00:00', 'America/Chicago');
      render(
        <LocalizationProvider dateAdapter={AdapterDayjs} dateFormats={{ hours12h: 'h' }}>
          <MultiSectionDigitalClock defaultValue={value} timezone="America/Chicago" ampm />
        </LocalizationProvider>,
      );

      expect(getHourLabels()).to.deep.equal([
        '12',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
      ]);
    });
  });
});
