import {
  DateRangePickerDay2,
  dateRangePickerDay2Classes as classes,
} from '@mui/x-date-pickers-pro/DateRangePickerDay2';
import { createPickerRenderer, adapterToUse } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<DateRangePickerDay2 />', () => {
  const { render } = createPickerRenderer();

  describeConformance(
    <DateRangePickerDay2
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
      muiName: 'MuiDateRangePickerDay2',
      render,
      refInstanceof: window.HTMLButtonElement,
      // cannot test reactTestRenderer because of required context
      skip: ['componentProp', 'componentsProp', 'themeVariants'],
    }),
  );
});
