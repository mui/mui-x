import { spy } from 'sinon';
import { vi } from 'vitest';
import { screen } from '@mui/internal-test-utils';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { describeAdapters, createPickerRenderer } from 'test/utils/pickers';

const getHourLabels = () =>
  screen
    .getAllByRole('option')
    .filter((option) => option.getAttribute('aria-label')?.endsWith('hours'))
    .map((option) => option.textContent);

const HOURS_12H = ['12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'];
const HOURS_24H = Array.from({ length: 24 }, (_, h) => h.toString().padStart(2, '0'));

describe('<MultiSectionDigitalClock /> - Timezone', () => {
  describeAdapters('DST handling', MultiSectionDigitalClock, ({ adapter, render }) => {
    // `describeAdapters` pins `now` to June 15. Each scenario below overrides
    // it via `vi.setSystemTime` so `now` lands on the relevant transition day —
    // that is where https://github.com/mui/mui-x/issues/22084 actually surfaces.

    describe('spring-forward day', () => {
      beforeEach(() => {
        vi.setSystemTime(new Date('2026-03-08T15:00:00.000Z'));
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

      it('should render exactly one non-disabled "3 hours" entry', () => {
        // Issue #22084 specifically reported a duplicate "3 hours" entry
        // rendered as disabled (because hour=2 had its label rolled forward
        // to "03"). Without the fix, `getAllByRole` returns 2 matches.
        const value = adapter.date('2026-03-08T03:00:00', 'America/Chicago');
        render(<MultiSectionDigitalClock defaultValue={value} timezone="America/Chicago" ampm />);

        const threeHoursOptions = screen.getAllByRole('option', { name: '3 hours' });
        expect(threeHoursOptions).to.have.length(1);
        expect(threeHoursOptions[0].getAttribute('aria-disabled')).to.equal(null);
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

    describe('fall-back day', () => {
      beforeEach(() => {
        vi.setSystemTime(new Date('2026-11-01T15:00:00.000Z'));
      });

      it('should still render every hour exactly once', () => {
        const value = adapter.date('2026-11-01T04:00:00', 'America/Chicago');
        render(<MultiSectionDigitalClock defaultValue={value} timezone="America/Chicago" ampm />);

        expect(getHourLabels()).to.deep.equal(HOURS_12H);
      });
    });

    describe.skipIf(!adapter.isTimezoneCompatible)('midnight DST transition', () => {
      // Brazil's spring-forward used to happen at midnight (00:00 → 01:00) —
      // last observed on 2018-11-04 in `America/Sao_Paulo`. Skipped on TZ-
      // incompatible adapters since the picker `timezone` prop is a no-op there.
      beforeEach(() => {
        vi.setSystemTime(new Date('2018-11-04T15:00:00.000Z'));
      });

      it('should not duplicate the midnight label', () => {
        const value = adapter.date('2018-11-04T04:00:00', 'America/Sao_Paulo');
        render(<MultiSectionDigitalClock defaultValue={value} timezone="America/Sao_Paulo" ampm />);

        expect(getHourLabels()).to.deep.equal(HOURS_12H);
      });
    });
  });

  describe('Custom hour format on a DST day', () => {
    // Tests `LocalizationProvider`-level locale plumbing, which is shared
    // infrastructure; running it on dayjs alone is enough to lock in the
    // format-token path.
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
