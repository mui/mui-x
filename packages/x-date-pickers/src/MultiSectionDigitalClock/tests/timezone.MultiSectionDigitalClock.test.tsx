import { spy } from 'sinon';
import { screen } from '@mui/internal-test-utils';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createPickerRenderer, describeAdapters } from 'test/utils/pickers';

const getHourLabels = () =>
  screen
    .getAllByRole('option')
    .filter((option) => option.getAttribute('aria-label')?.endsWith('hours'))
    .map((option) => option.textContent);

describe('<MultiSectionDigitalClock /> - Timezone', () => {
  describeAdapters(
    'DST spring-forward handling',
    MultiSectionDigitalClock,
    ({ adapter, render }) => {
      describe.skipIf(!adapter.isTimezoneCompatible)('timezoneCompatible', () => {
        // On this day Chicago switches from CST (UTC-6) to CDT (UTC-5);
        // local time jumps from 2:00 AM directly to 3:00 AM so 2 AM does not exist.
        // Regression test for https://github.com/mui/mui-x/issues/22084 — labels for
        // each hour should be computed independently of DST so there are no duplicates
        // and no missing entries.
        it('should render each 12-hour hour with a unique label on a spring-forward day', () => {
          const value = adapter.date('2026-03-08T04:00:00', 'America/Chicago');

          render(<MultiSectionDigitalClock defaultValue={value} timezone="America/Chicago" ampm />);

          expect(getHourLabels()).to.deep.equal([
            '12',
            '01',
            '02',
            '03',
            '04',
            '05',
            '06',
            '07',
            '08',
            '09',
            '10',
            '11',
          ]);
        });

        it('should render each 24-hour hour with a unique label on a spring-forward day', () => {
          const value = adapter.date('2026-03-08T04:00:00', 'America/Chicago');

          render(
            <MultiSectionDigitalClock
              defaultValue={value}
              timezone="America/Chicago"
              ampm={false}
            />,
          );

          // Hours 0–23 in order, all unique and zero-padded.
          expect(getHourLabels()).to.deep.equal(
            Array.from({ length: 24 }, (_, h) => h.toString().padStart(2, '0')),
          );
        });
      });
    },
  );

  // The describeAdapters block above uses `clockConfig: new Date(2022, 5, 15)`
  // (June 15, 2022 — not a DST day), so the adapter's `now` never lands on a
  // transition day and never exercises the original regression. The blocks
  // below explicitly mock the system clock to a DST day so `now` ends up on
  // 2026-03-08 in the picker timezone, faithfully reproducing
  // https://github.com/mui/mui-x/issues/22084.
  //
  // Each timezone-compatible adapter is exercised individually because
  // describeAdapters hardcodes its own clockConfig.
  (['dayjs', 'luxon', 'moment'] as const).forEach((adapterName) => {
    describe(`DST spring-forward — ${adapterName} adapter, system clock on DST day`, () => {
      const { render, adapter } = createPickerRenderer({
        adapterName,
        clockConfig: new Date('2026-03-08T15:00:00.000Z'),
      });

      it('should render every 12-hour hour exactly once', () => {
        const value = adapter.date('2026-03-08T04:00:00', 'America/Chicago');

        render(<MultiSectionDigitalClock defaultValue={value} timezone="America/Chicago" ampm />);

        expect(getHourLabels()).to.deep.equal([
          '12',
          '01',
          '02',
          '03',
          '04',
          '05',
          '06',
          '07',
          '08',
          '09',
          '10',
          '11',
        ]);
      });

      it('should render every 24-hour hour exactly once', () => {
        const value = adapter.date('2026-03-08T04:00:00', 'America/Chicago');

        render(
          <MultiSectionDigitalClock defaultValue={value} timezone="America/Chicago" ampm={false} />,
        );

        expect(getHourLabels()).to.deep.equal(
          Array.from({ length: 24 }, (_, h) => h.toString().padStart(2, '0')),
        );
      });

      it('should select 4 AM when the user clicks "4 hours"', async () => {
        const onChange = spy();
        const value = adapter.date('2026-03-08T03:00:00', 'America/Chicago');

        const { user } = render(
          <MultiSectionDigitalClock
            defaultValue={value}
            timezone="America/Chicago"
            ampm
            onChange={onChange}
          />,
        );

        await user.click(screen.getByRole('option', { name: '4 hours' }));

        expect(onChange.callCount).to.equal(1);
        expect(adapter.getHours(onChange.lastCall.firstArg)).to.equal(4);
      });
    });
  });

  describe('DST fall-back — dayjs adapter, system clock on DST day', () => {
    // 2026-11-01 is the fall-back day in America/Chicago: 2:00 AM CDT rewinds
    // to 1:00 AM CST, so 1 AM occurs twice. Verifies the fix doesn't accidentally
    // regress the symmetric transition.
    const { render, adapter } = createPickerRenderer({
      adapterName: 'dayjs',
      clockConfig: new Date('2026-11-01T15:00:00.000Z'),
    });

    it('should still render every hour exactly once on the fall-back day', () => {
      const value = adapter.date('2026-11-01T04:00:00', 'America/Chicago');

      render(<MultiSectionDigitalClock defaultValue={value} timezone="America/Chicago" ampm />);

      expect(getHourLabels()).to.deep.equal([
        '12',
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
      ]);
    });
  });

  describe('Custom hour format on a DST day', () => {
    // The labels are produced via `adapter.format(setHours(reference, hour), 'hours12h')`
    // so a custom `hours12h` token from `LocalizationProvider` (here: `'h'` for
    // unpadded) must flow through to the rendered labels. Guards against a future
    // regression to a hard-coded `padStart(2, '0')` fallback.
    const { render, adapter } = createPickerRenderer({
      adapterName: 'dayjs',
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
