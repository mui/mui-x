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
        // Smoke check across adapters with a DST-day `value`. `describeAdapters`
        // pins the system clock to June 15 so this does not actually reproduce
        // https://github.com/mui/mui-x/issues/22084 — the per-adapter blocks
        // below mock the system clock onto the transition day for that.
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

          expect(getHourLabels()).to.deep.equal(
            Array.from({ length: 24 }, (_, h) => h.toString().padStart(2, '0')),
          );
        });
      });
    },
  );

  // `describeAdapters` hardcodes a `clockConfig` on a non-transition day
  // (June 15), so its tests never put `now` on a transition day. Mock the
  // system clock to the spring-forward day per adapter to actually reproduce
  // the regression.
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
    // Smoke check the symmetric (fall-back) transition where 1 AM occurs twice.
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
    // Guards against regressing to hard-coded label formatting: a custom
    // `hours12h` token from `LocalizationProvider` must reach the rendered labels.
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
