import { spy } from 'sinon';
import { screen } from '@mui/internal-test-utils';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { createPickerRenderer, describeAdapters } from 'test/utils/pickers';

describe('<MultiSectionDigitalClock /> - Timezone', () => {
  describeAdapters(
    'DST spring-forward handling',
    MultiSectionDigitalClock,
    ({ adapter, render }) => {
      describe.skipIf(!adapter.isTimezoneCompatible)('timezoneCompatible', () => {
        // On this day Chicago switches from CST (UTC-6) to CDT (UTC-5);
        // local time jumps from 2:00 AM directly to 3:00 AM so 2 AM does not exist.
        // Regression test for https://github.com/mui/mui-x/issues/21669 — labels for
        // each hour should be computed independently of DST so there are no duplicates
        // and no missing entries.
        it('should render each 12-hour hour with a unique label on a spring-forward day', () => {
          const value = adapter.date('2026-03-08T04:00:00', 'America/Chicago');

          render(<MultiSectionDigitalClock defaultValue={value} timezone="America/Chicago" ampm />);

          const hourOptionLabels = screen
            .getAllByRole('option')
            .filter((option) => option.getAttribute('aria-label')?.endsWith('hours'))
            .map((option) => option.textContent);

          expect(hourOptionLabels).to.have.length(12);
          expect(new Set(hourOptionLabels).size).to.equal(12);
          expect(hourOptionLabels).to.deep.equal([
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

          const hourOptionLabels = screen
            .getAllByRole('option')
            .filter((option) => option.getAttribute('aria-label')?.endsWith('hours'))
            .map((option) => option.textContent);

          expect(hourOptionLabels).to.have.length(24);
          expect(new Set(hourOptionLabels).size).to.equal(24);
        });
      });
    },
  );

  describe('DST spring-forward handling with system clock on DST day', () => {
    // Reproduces https://github.com/mui/mui-x/issues/21669 more faithfully: the
    // adapter's internal `now` falls on the DST spring-forward day, which previously
    // corrupted the hour labels derived from it.
    const { render, adapter } = createPickerRenderer({
      adapterName: 'dayjs',
      clockConfig: new Date('2026-03-08T15:00:00.000Z'),
    });

    it('should render each 12-hour hour with a unique label', () => {
      const value = adapter.date('2026-03-08T04:00:00', 'America/Chicago');

      render(<MultiSectionDigitalClock defaultValue={value} timezone="America/Chicago" ampm />);

      const hourOptionLabels = screen
        .getAllByRole('option')
        .filter((option) => option.getAttribute('aria-label')?.endsWith('hours'))
        .map((option) => option.textContent);

      expect(hourOptionLabels).to.have.length(12);
      expect(new Set(hourOptionLabels).size).to.equal(12);
      expect(hourOptionLabels).to.deep.equal([
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

    it('should allow selecting 4 AM', async () => {
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
