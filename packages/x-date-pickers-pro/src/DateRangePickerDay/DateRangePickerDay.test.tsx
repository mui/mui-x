import * as React from 'react';
import {
  DateRangePickerDay,
  dateRangePickerDayClasses as classes,
} from '@mui/x-date-pickers-pro/DateRangePickerDay';
import { createPickerRenderer, adapterToUse } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<DateRangePickerDay />', () => {
  const { render } = createPickerRenderer();

  describeConformance(
    <DateRangePickerDay
      day={adapterToUse.date()}
      outsideCurrentMonth={false}
      selected
      onDaySelect={() => {}}
      isHighlighting
      isPreviewing
      isStartOfPreviewing
      isEndOfPreviewing
      isStartOfHighlighting
      isEndOfHighlighting
      isFirstVisibleCell
      isLastVisibleCell={false}
    />,
    () => ({
      classes,
      inheritComponent: 'button',
      muiName: 'MuiDateRangePickerDay',
      render,
      refInstanceof: window.HTMLButtonElement,
      // cannot test reactTestRenderer because of required context
      skip: [
        'componentProp',
        'rootClass', // forwards classes to DateRangePickerDayDay, but applies root class on DateRangePickerDayRoot
        'mergeClassName', // forwards other props (i.e. data-test-id) to the DateRangePickerDayDay, but `className` is applied on the root
        'componentsProp',
        // TODO: Fix DateRangePickerDays is not spreading props on root
        'themeDefaultProps',
        'themeVariants',
      ],
    }),
  );
});
