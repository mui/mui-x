import { DefaultizedProps } from '@mui/x-internals/types';
import {
  PickerSelectionState,
  PickerViewRenderer,
  useUtils,
  TimeViewWithMeridiem,
  BaseClockProps,
  PickerRangeValue,
  PickerViewsRendererProps,
} from '@mui/x-date-pickers/internals';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { isRangeValid } from '../internals/utils/date-utils';
import { calculateRangeChange } from '../internals/utils/date-range-manager';
import { usePickerRangePositionContext } from '../hooks';

export type TimeRangePickerTimeWrapperProps<
  TComponentProps extends DefaultizedProps<
    Omit<BaseClockProps<TimeViewWithMeridiem>, 'value' | 'defaultValue' | 'onChange'>,
    'views'
  >,
> = Omit<
  TComponentProps,
  'views' | 'view' | 'onViewChange' | 'value' | 'defaultValue' | 'onChange'
> & {
  view: TimeViewWithMeridiem;
  onViewChange?: (view: TimeViewWithMeridiem) => void;
  views: readonly TimeViewWithMeridiem[];
  value?: PickerRangeValue;
  defaultValue?: PickerRangeValue;
  onChange?: (
    value: PickerRangeValue,
    selectionState: PickerSelectionState,
    selectedView: TimeViewWithMeridiem,
  ) => void;
  viewRenderer: PickerViewRenderer<PickerRangeValue, TComponentProps> | null;
  openTo?: TimeViewWithMeridiem;
};

/**
 * @ignore - internal component.
 */
function TimeRangePickerTimeWrapper<
  TComponentProps extends DefaultizedProps<
    Omit<BaseClockProps<TimeViewWithMeridiem>, 'value' | 'defaultValue' | 'onChange'>,
    'views'
  >,
>(props: TimeRangePickerTimeWrapperProps<TComponentProps>) {
  const utils = useUtils();

  const { viewRenderer, value, onChange, defaultValue, onViewChange, views, className, ...other } =
    props;

  const { rangePosition, setRangePosition } = usePickerRangePositionContext();

  if (!viewRenderer) {
    return null;
  }

  const currentValue = (rangePosition === 'start' ? value?.[0] : value?.[1]) ?? null;
  const currentDefaultValue =
    (rangePosition === 'start' ? defaultValue?.[0] : defaultValue?.[1]) ?? null;
  const handleOnChange = (
    newDate: PickerValidDate | null,
    selectionState: PickerSelectionState,
    selectedView: TimeViewWithMeridiem,
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
    if (selectionState === 'finish') {
      setRangePosition(rangePosition === 'start' ? 'end' : 'start');
      onViewChange?.(views[0]);
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
  } as any as PickerViewsRendererProps<PickerRangeValue, TimeViewWithMeridiem, TComponentProps>);
}

export { TimeRangePickerTimeWrapper };
