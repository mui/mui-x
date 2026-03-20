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
      skip: ['componentProp', 'componentsProp', 'themeVariants'],
    }),
  );
});
