import * as React from 'react';
import {
  DateCalendar,
  dateCalendarClasses,
  dayCalendarClasses,
} from '@mui/x-date-pickers/DateCalendar';
import { pickerDayClasses } from '@mui/x-date-pickers/PickerDay';
import { monthCalendarClasses } from '@mui/x-date-pickers/MonthCalendar';
import { yearCalendarClasses } from '@mui/x-date-pickers/YearCalendar';
import { createPickerRenderer, adapterToUse } from 'test/utils/pickers';
import { isJSDOM } from 'test/utils/skipIf';

describe.skipIf(isJSDOM)('<DateCalendar /> - dimensions', () => {
  const { render } = createPickerRenderer();

  const getDimensions = (container: HTMLElement, selector: string) => {
    const { width, height } = container.querySelector(selector)!.getBoundingClientRect();
    return { width, height };
  };

  const getCalendarDimensions = (container: HTMLElement) => ({
    root: getDimensions(container, `.${dateCalendarClasses.root}`),
    day: getDimensions(container, `.${pickerDayClasses.root}`),
    weekDayLabel: getDimensions(container, `.${dayCalendarClasses.weekDayLabel}`),
    header: getDimensions(container, `.${dayCalendarClasses.header}`),
  });

  it('uses the default day size when `--PickerDay-size` is not set', () => {
    const { container } = render(<DateCalendar defaultValue={adapterToUse.date('2019-01-01')} />);

    const { root, day, weekDayLabel, header } = getCalendarDimensions(container);

    expect(day).to.deep.equal({ width: 36, height: 36 });
    expect(weekDayLabel).to.deep.equal({ width: 36, height: 36 });
    expect(header.height).to.equal(40);
    expect(root).to.deep.equal({ width: 320, height: 336 });
  });

  it('derives every dimension from `--PickerDay-size` when it is set on the calendar', () => {
    const { container } = render(
      <DateCalendar
        defaultValue={adapterToUse.date('2019-01-01')}
        sx={{ '--PickerDay-size': '24px' }}
      />,
    );

    const { root, day, weekDayLabel, header } = getCalendarDimensions(container);

    expect(day).to.deep.equal({ width: 24, height: 24 });
    expect(weekDayLabel).to.deep.equal({ width: 24, height: 24 });
    expect(header.height).to.equal(28);
    expect(root.height).to.equal(56 + 28 * 7);
    expect(root.width).to.equal(40 + 28 * 7);
  });

  it('inherits `--PickerDay-size` from an ancestor of the calendar', () => {
    const { container } = render(
      <div style={{ '--PickerDay-size': '48px' } as React.CSSProperties}>
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

  it('takes `--PickerDay-horizontalMargin` into account', () => {
    const { container } = render(
      <DateCalendar
        defaultValue={adapterToUse.date('2019-01-01')}
        sx={{ '--PickerDay-size': '24px', '--PickerDay-horizontalMargin': '0px' }}
      />,
    );

    const { root, weekDayLabel, header } = getCalendarDimensions(container);

    expect(weekDayLabel).to.deep.equal({ width: 24, height: 24 });
    expect(header.height).to.equal(24);
    expect(root.height).to.equal(56 + 24 * 7);
    expect(root.width).to.equal(40 + 24 * 7);
  });

  it('lays out the day grid even when the margin is set without a unit', () => {
    const { container } = render(
      <DateCalendar
        defaultValue={adapterToUse.date('2019-01-01')}
        sx={{ '--PickerDay-horizontalMargin': 0 }}
      />,
    );

    const { day, weekDayLabel, header } = getCalendarDimensions(container);

    expect(day).to.deep.equal({ width: 36, height: 36 });
    expect(weekDayLabel).to.deep.equal({ width: 36, height: 36 });
    expect(header.height).to.equal(36);
  });

  it('keeps the year view as wide as the day view', () => {
    const { container } = render(
      <DateCalendar
        defaultValue={adapterToUse.date('2019-01-01')}
        view="year"
        sx={{ '--PickerDay-size': '24px' }}
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
        sx={{ '--PickerDay-size': '24px' }}
      />,
    );

    expect(getDimensions(container, `.${monthCalendarClasses.root}`).width).to.equal(40 + 28 * 7);
  });
});
