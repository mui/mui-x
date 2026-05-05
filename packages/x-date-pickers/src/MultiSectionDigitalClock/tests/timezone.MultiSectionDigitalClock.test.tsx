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

const HOURS_12H = ['12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'];

const HOURS_24H = Array.from({ length: 24 }, (_, h) => h.toString().padStart(2, '0'));

describe('<MultiSectionDigitalClock /> - Timezone', () => {
  describeAdapters(
    'DST spring-forward handling',
    MultiSectionDigitalClock,
    ({ adapter, render }) => {
      describe.skipIf(!adapter.isTimezoneCompatible)('timezoneCompatible', () => {
        it('should render each 12-hour hour with a unique label on a spring-forward day', () => {
          const value = adapter.date('2026-03-08T04:00:00', 'America/Chicago');

          render(<MultiSectionDigitalClock defaultValue={value} timezone="America/Chicago" ampm />);

          expect(getHourLabels()).to.deep.equal(HOURS_12H);
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

          expect(getHourLabels()).to.deep.equal(HOURS_24H);
        });
      });
    },
  );

  // Mock the system clock onto the transition day per adapter — that is where
  // the regression actually surfaces (`describeAdapters` pins `now` to a
  // non-transition day). `date-fns` is included even though its `timezone`
  // prop is currently a no-op; the bug still surfaces through the system TZ.
  (['dayjs', 'luxon', 'moment', 'date-fns'] as const).forEach((adapterName) => {
    describe(`DST spring-forward — ${adapterName} adapter, system clock on DST day`, () => {
      const { render, adapter } = createPickerRenderer({
        adapterName,
        clockConfig: new Date('2026-03-08T15:00:00.000Z'),
      });

      it('should render every 12-hour hour exactly once', () => {
        const value = adapter.date('2026-03-08T04:00:00', 'America/Chicago');

        render(<MultiSectionDigitalClock defaultValue={value} timezone="America/Chicago" ampm />);

        expect(getHourLabels()).to.deep.equal(HOURS_12H);
      });

      it('should render every 24-hour hour exactly once', () => {
        const value = adapter.date('2026-03-08T04:00:00', 'America/Chicago');

        render(
          <MultiSectionDigitalClock defaultValue={value} timezone="America/Chicago" ampm={false} />,
        );

        expect(getHourLabels()).to.deep.equal(HOURS_24H);
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

  (['dayjs', 'luxon', 'moment', 'date-fns'] as const).forEach((adapterName) => {
    describe(`DST fall-back — ${adapterName} adapter, system clock on DST day`, () => {
      const { render, adapter } = createPickerRenderer({
        adapterName,
        clockConfig: new Date('2026-11-01T15:00:00.000Z'),
      });

      it('should still render every hour exactly once on the fall-back day', () => {
        const value = adapter.date('2026-11-01T04:00:00', 'America/Chicago');

        render(<MultiSectionDigitalClock defaultValue={value} timezone="America/Chicago" ampm />);

        expect(getHourLabels()).to.deep.equal(HOURS_12H);
      });
    });
  });

  describe('Midnight DST transition — dayjs adapter, system clock on DST day', () => {
    // Brazil's spring-forward used to happen at midnight (00:00 → 01:00) — last
    // observed on 2018-11-04 in `America/Sao_Paulo`. Covers the "hour 0 does
    // not exist" variant of the same root cause.
    const { render, adapter } = createPickerRenderer({
      adapterName: 'dayjs',
      clockConfig: new Date('2018-11-04T15:00:00.000Z'),
    });

    it('should not duplicate the midnight label', () => {
      const value = adapter.date('2018-11-04T04:00:00', 'America/Sao_Paulo');

      render(<MultiSectionDigitalClock defaultValue={value} timezone="America/Sao_Paulo" ampm />);

      expect(getHourLabels()).to.deep.equal(HOURS_12H);
    });
  });

  describe('`timeSteps.hours` on a DST day — dayjs adapter, system clock on DST day', () => {
    const { render, adapter } = createPickerRenderer({
      adapterName: 'dayjs',
      clockConfig: new Date('2026-03-08T15:00:00.000Z'),
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

  describe('Custom hour format on a DST day', () => {
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
