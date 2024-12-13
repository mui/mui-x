import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { fireEvent, screen } from '@mui/internal-test-utils';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { getDateOffset, describeAdapters } from 'test/utils/pickers';

const TIMEZONE_TO_TEST = ['UTC', 'system', 'America/New_York'];

const get24HourFromDigitalClock = () => {
  const results = /([0-9]+):([0-9]+) (AM|PM)/.exec(
    screen.queryByRole('option', { selected: true })!.innerHTML,
  )!;

  return Number(results[1]) + (results[3] === 'AM' ? 0 : 12);
};

describe('<DigitalClock /> - Timezone', () => {
  describeAdapters('Timezone prop', DigitalClock, ({ adapter, render }) => {
    if (!adapter.isTimezoneCompatible) {
      return;
    }

    it('should use default timezone for rendering and onChange when no value and no timezone prop are provided', () => {
      const onChange = spy();
      render(<DigitalClock onChange={onChange} />);

      fireEvent.click(screen.getByRole('option', { name: '08:00 AM' }));

      const expectedDate = adapter.setHours(adapter.date(), 8);

      // Check the `onChange` value (uses default timezone, for example: UTC, see TZ env variable)
      const actualDate = onChange.lastCall.firstArg;

      // On dayjs, we are not able to know if a date is UTC because it's the system timezone or because it was created as UTC.
      // In a real world scenario, this should probably never occur.
      expect(adapter.getTimezone(actualDate)).to.equal(adapter.lib === 'dayjs' ? 'UTC' : 'system');
      expect(actualDate).toEqualDateTime(expectedDate);
    });

    it('should render correct time options when fall back DST occurs', () => {
      render(
        <DigitalClock
          referenceDate={adapter.date('2023-11-05T12:00:00', 'America/New_York')}
          timezone="America/New_York"
          timeStep={30}
        />,
      );
      const oneAM = adapter.setMinutes(adapter.setHours(adapter.date(undefined, 'default'), 1), 0);
      const elevenPM = adapter.setMinutes(
        adapter.setHours(adapter.date(undefined, 'default'), 23),
        0,
      );
      expect(
        screen.getAllByText(
          adapter.format(
            oneAM,
            adapter.is12HourCycleInCurrentLocale() ? 'fullTime12h' : 'fullTime24h',
          ),
        ),
      ).to.have.length(adapter.lib === 'dayjs' ? 1 : 2);
      expect(
        screen.getAllByText(
          adapter.format(
            elevenPM,
            adapter.is12HourCycleInCurrentLocale() ? 'fullTime12h' : 'fullTime24h',
          ),
        ),
      ).to.have.length(1);
    });

    it('should contain time options until the end of day when spring forward DST occurs', () => {
      render(
        <DigitalClock
          referenceDate={adapter.date('2024-03-10T12:00:00', 'America/New_York')}
          timezone="America/New_York"
          timeStep={30}
        />,
      );
      const startOfDay = adapter.setMinutes(
        adapter.setHours(adapter.date(undefined, 'default'), 0),
        0,
      );
      const eleven30PM = adapter.setMinutes(
        adapter.setHours(adapter.date(undefined, 'default'), 23),
        30,
      );
      expect(
        screen.getAllByText(
          adapter.format(
            startOfDay,
            adapter.is12HourCycleInCurrentLocale() ? 'fullTime12h' : 'fullTime24h',
          ),
        ),
      ).to.have.length(1);
      expect(
        screen.getAllByText(
          adapter.format(
            eleven30PM,
            adapter.is12HourCycleInCurrentLocale() ? 'fullTime12h' : 'fullTime24h',
          ),
        ),
      ).to.have.length(1);
    });

    TIMEZONE_TO_TEST.forEach((timezone) => {
      describe(`Timezone: ${timezone}`, () => {
        it('should use timezone prop for onChange when no value is provided', () => {
          const onChange = spy();
          render(<DigitalClock onChange={onChange} timezone={timezone} />);

          fireEvent.click(screen.getByRole('option', { name: '08:00 AM' }));

          const expectedDate = adapter.setHours(
            adapter.startOfDay(adapter.date(undefined, timezone)),
            8,
          );

          // Check the `onChange` value (uses timezone prop)
          const actualDate = onChange.lastCall.firstArg;
          expect(adapter.getTimezone(actualDate)).to.equal(
            adapter.lib === 'dayjs' && timezone === 'system' ? 'UTC' : timezone,
          );
          expect(actualDate).toEqualDateTime(expectedDate);
        });

        it('should use timezone prop for rendering and value timezone for onChange when a value is provided', () => {
          const onChange = spy();
          const value = adapter.date('2022-04-17T04:30', timezone);

          render(
            <DigitalClock defaultValue={value} onChange={onChange} timezone="America/Chicago" />,
          );

          const renderedHourBefore = get24HourFromDigitalClock();

          const offsetDiff =
            getDateOffset(adapter, adapter.setTimezone(value, 'America/Chicago')) -
            getDateOffset(adapter, value);

          expect(renderedHourBefore).to.equal(
            (adapter.getHours(value) + offsetDiff / 60 + 24) % 24,
          );

          fireEvent.click(screen.getByRole('option', { name: '08:30 PM' }));

          const actualDate = onChange.lastCall.firstArg;

          const renderedHourAfter = get24HourFromDigitalClock();
          expect(renderedHourAfter).to.equal(
            (adapter.getHours(actualDate) + offsetDiff / 60 + 24) % 24,
          );

          const expectedDate = adapter.addHours(value, renderedHourAfter - renderedHourBefore);

          expect(adapter.getTimezone(actualDate)).to.equal(timezone);
          expect(actualDate).toEqualDateTime(expectedDate);
        });
      });
    });
  });
});
