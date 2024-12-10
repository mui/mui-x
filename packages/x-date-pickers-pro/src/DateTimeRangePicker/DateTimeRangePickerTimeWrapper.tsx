import { DefaultizedProps } from '@mui/x-internals/types';
import {
  PickerSelectionState,
  PickerViewRenderer,
  isInternalTimeView,
  useUtils,
  TimeViewWithMeridiem,
  BaseClockProps,
  PickerRangeValue,
} from '@mui/x-date-pickers/internals';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { UseRangePositionResponse } from '../internals/hooks/useRangePosition';
import { isRangeValid } from '../internals/utils/date-utils';
import { calculateRangeChange } from '../internals/utils/date-range-manager';

export type DateTimeRangePickerTimeWrapperProps<
  TView extends TimeViewWithMeridiem,
  TComponentProps extends DefaultizedProps<
    Omit<BaseClockProps<TView>, 'value' | 'defaultValue' | 'onChange'>,
    'views'
  >,
> = Pick<UseRangePositionResponse, 'rangePosition' | 'onRangePositionChange'> &
  Omit<
    TComponentProps,
    'views' | 'view' | 'onViewChange' | 'value' | 'defaultValue' | 'onChange'
  > & {
    view: TView;
    onViewChange?: (view: TView) => void;
    views: readonly TView[];
    value?: PickerRangeValue;
    defaultValue?: PickerRangeValue;
    onChange?: (
      value: PickerRangeValue,
      selectionState: PickerSelectionState,
      selectedView: TView,
    ) => void;
    viewRenderer?: PickerViewRenderer<PickerRangeValue, TView, TComponentProps, any> | null;
    openTo?: TView;
  };

/**
 * @ignore - internal component.
 */
function DateTimeRangePickerTimeWrapper<
  TView extends TimeViewWithMeridiem,
  TComponentProps extends DefaultizedProps<
    Omit<BaseClockProps<TView>, 'value' | 'defaultValue' | 'onChange'>,
    'views'
  >,
>(props: DateTimeRangePickerTimeWrapperProps<TView, TComponentProps>) {
  const utils = useUtils();

  const {
    rangePosition,
    onRangePositionChange,
    viewRenderer,
    value,
    onChange,
    defaultValue,
    onViewChange,
    views,
    className,
    ...other
  } = props;

  if (!viewRenderer) {
    return null;
  }

  const currentValue = (rangePosition === 'start' ? value?.[0] : value?.[1]) ?? null;
  const currentDefaultValue =
    (rangePosition === 'start' ? defaultValue?.[0] : defaultValue?.[1]) ?? null;
  const handleOnChange = (
    newDate: PickerValidDate | null,
    selectionState: PickerSelectionState,
    selectedView: TView,
  ) => {
    if (!onChange || !value) {
      return;
    }
    const { newRange } = calculateRangeChange({
      newDate,
      utils,
      range: value,
      rangePosition,
    });
    const isFullRangeSelected = rangePosition === 'end' && isRangeValid(utils, newRange);
    const timeViews = views.filter(isInternalTimeView);
    // reset view to the first time view and swap range position after selecting the last time view (start or end position)
    if (selectedView === timeViews[timeViews.length - 1] && onViewChange) {
      onViewChange(views[0]);
      onRangePositionChange(rangePosition === 'start' ? 'end' : 'start');
    }
    onChange(newRange, isFullRangeSelected ? 'finish' : 'partial', selectedView);
  };

  return viewRenderer({
    ...other,
    views,
    onViewChange,
    value: currentValue,
    onChange: handleOnChange,
    defaultValue: currentDefaultValue,
  });
}

export { DateTimeRangePickerTimeWrapper };
