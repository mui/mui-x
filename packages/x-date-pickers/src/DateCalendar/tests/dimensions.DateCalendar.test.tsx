import * as React from 'react';
import {
  DateCalendar,
  dateCalendarClasses,
  dayCalendarClasses,
} from '@mui/x-date-pickers/DateCalendar';
import { monthCalendarClasses } from '@mui/x-date-pickers/MonthCalendar';
import { yearCalendarClasses } from '@mui/x-date-pickers/YearCalendar';
import { createPickerRenderer, adapterToUse } from 'test/utils/pickers';
import { screen } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';

const DEFAULT_ROOT = { width: 320, height: 336 };

describe.skipIf(isJSDOM)('<DateCalendar /> - dimensions', () => {
  const { render } = createPickerRenderer();

  const getDimensions = (container: HTMLElement, selector: string) => {
    const { width, height } = container.querySelector(selector)!.getBoundingClientRect();
    return { width, height };
  };

  // Filler cells don't receive `slotProps.day`, so the assertions target an actual day.
  const getDay = () => screen.getByRole('gridcell', { name: '1' });

  const getCalendarDimensions = (container: HTMLElement) => {
    const { width, height } = getDay().getBoundingClientRect();

    return {
      root: getDimensions(container, `.${dateCalendarClasses.root}`),
      day: { width, height },
      weekDayLabel: getDimensions(container, `.${dayCalendarClasses.weekDayLabel}`),
      header: getDimensions(container, `.${dayCalendarClasses.header}`),
    };
  };

  it('uses the default day size when `--PickerCalendar-daySize` is not set', () => {
    const { container } = render(<DateCalendar defaultValue={adapterToUse.date('2019-01-01')} />);

    const { root, day, weekDayLabel, header } = getCalendarDimensions(container);

    expect(day).to.deep.equal({ width: 36, height: 36 });
    expect(weekDayLabel).to.deep.equal({ width: 36, height: 36 });
    expect(header.height).to.equal(40);
    expect(root).to.deep.equal(DEFAULT_ROOT);
  });

  it('derives every dimension from `--PickerCalendar-daySize` when it is set on the calendar', () => {
    const { container } = render(
      <DateCalendar
        defaultValue={adapterToUse.date('2019-01-01')}
        sx={{ '--PickerCalendar-daySize': '24px' }}
      />,
    );

    const { root, day, weekDayLabel, header } = getCalendarDimensions(container);

    expect(day).to.deep.equal({ width: 24, height: 24 });
    expect(weekDayLabel).to.deep.equal({ width: 24, height: 24 });
    expect(header.height).to.equal(28);
    expect(root.height).to.equal(56 + 28 * 7);
    expect(root.width).to.equal(40 + 28 * 7);
  });

  it('inherits `--PickerCalendar-daySize` from an ancestor of the calendar', () => {
    const { container } = render(
      <div style={{ '--PickerCalendar-daySize': '48px' } as React.CSSProperties}>
        <DateCalendar defaultValue={adapterToUse.date('2019-01-01')} />
      </div>,
    );

    const { root, day, weekDayLabel, header } = getCalendarDimensions(container);

    expect(day).to.deep.equal({ width: 48, height: 48 });
    expect(weekDayLabel).to.deep.equal({ width: 48, height: 48 });
    expect(header.height).to.equal(52);
    expect(root.height).to.equal(56 + 52 * 7);
    expect(root.width).to.equal(40 + 52 * 7);
  });

  describe('`--PickerDay-*` variables', () => {
    it('resizes the day without resizing the calendar when `--PickerDay-size` is set on the day', () => {
      const { container } = render(
        <DateCalendar
          defaultValue={adapterToUse.date('2019-01-01')}
          slotProps={{ day: { sx: { '--PickerDay-size': '24px' } } }}
        />,
      );

      const { root, day } = getCalendarDimensions(container);

      expect(day).to.deep.equal({ width: 24, height: 24 });
      expect(root).to.deep.equal(DEFAULT_ROOT);
    });

    it('keeps declaring `--PickerDay-size` on the day so custom styles can read it', () => {
      render(<DateCalendar defaultValue={adapterToUse.date('2019-01-01')} />);

      const day = getDay();

      expect(window.getComputedStyle(day).getPropertyValue('--PickerDay-size')).to.equal('36px');
      expect(
        window.getComputedStyle(day).getPropertyValue('--PickerDay-horizontalMargin'),
      ).to.equal('2px');
    });

    it('applies the day margin without resizing the calendar', () => {
      const { container } = render(
        <DateCalendar
          defaultValue={adapterToUse.date('2019-01-01')}
          slotProps={{ day: { sx: { '--PickerDay-horizontalMargin': '8px' } } }}
        />,
      );

      const { root } = getCalendarDimensions(container);
      const day = getDay();

      expect(window.getComputedStyle(day).marginLeft).to.equal('8px');
      expect(root).to.deep.equal(DEFAULT_ROOT);
    });

    it('lays out the calendar when the day margin is set without a unit', () => {
      const { container } = render(
        <DateCalendar
          defaultValue={adapterToUse.date('2019-01-01')}
          slotProps={{ day: { sx: { '--PickerDay-horizontalMargin': 0 } } }}
        />,
      );

      const { root, day, weekDayLabel, header } = getCalendarDimensions(container);

      expect(day).to.deep.equal({ width: 36, height: 36 });
      expect(weekDayLabel).to.deep.equal({ width: 36, height: 36 });
      expect(header.height).to.equal(40);
      expect(root).to.deep.equal(DEFAULT_ROOT);
    });
  });

  it('keeps the year view as wide as the day view', () => {
    const { container } = render(
      <DateCalendar
        defaultValue={adapterToUse.date('2019-01-01')}
        view="year"
        sx={{ '--PickerCalendar-daySize': '24px' }}
      />,
    );

    expect(getDimensions(container, `.${yearCalendarClasses.root}`).width).to.equal(40 + 28 * 7);
  });

  it('keeps the month view as wide as the day view', () => {
    const { container } = render(
      <DateCalendar
        defaultValue={adapterToUse.date('2019-01-01')}
        views={['month']}
        view="month"
        sx={{ '--PickerCalendar-daySize': '24px' }}
      />,
    );

    expect(getDimensions(container, `.${monthCalendarClasses.root}`).width).to.equal(40 + 28 * 7);
  });
});
