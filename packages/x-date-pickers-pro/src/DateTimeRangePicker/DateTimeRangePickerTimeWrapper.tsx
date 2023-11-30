import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';
import { TimeViewWithMeridiem } from '@mui/x-date-pickers/internals/models';
import { BaseClockProps } from '@mui/x-date-pickers/internals/models/props/clock';
import {
  PickerSelectionState,
  PickerViewRenderer,
  isInternalTimeView,
  useUtils,
} from '@mui/x-date-pickers/internals';
import { DateRange } from '../internals/models';
import { UseRangePositionResponse } from '../internals/hooks/useRangePosition';
import { isRangeValid } from '../internals/utils/date-utils';
import { calculateRangeChange } from '../internals/utils/date-range-manager';

export type DateTimeRangePickerTimeWrapperProps<
  TDate,
  TView extends TimeViewWithMeridiem,
  TComponentProps extends Omit<BaseClockProps<TDate, TView>, 'value' | 'defaultValue' | 'onChange'>,
> = Pick<UseRangePositionResponse, 'rangePosition' | 'onRangePositionChange'> &
  Omit<
    TComponentProps,
    'views' | 'view' | 'onViewChange' | 'value' | 'defaultValue' | 'onChange'
  > & {
    view: TView;
    onViewChange?: (view: TView) => void;
    views: readonly TView[];
    value?: DateRange<TDate>;
    defaultValue?: DateRange<TDate>;
    onChange?: (
      value: DateRange<TDate>,
      selectionState: PickerSelectionState,
      selectedView: TView,
    ) => void;
    viewRenderer?: PickerViewRenderer<DateRange<TDate>, TView, any, TComponentProps> | null;
    openTo?: TView;
  };

const DateTimeRangePickerTimeWrapperRoot = styled('div', {
  name: 'DateTimeRangePickerTimeWrapper',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})({});

function DateTimeRangePickerTimeWrapper<
  TDate,
  TView extends TimeViewWithMeridiem,
  TComponentProps extends Omit<BaseClockProps<TDate, TView>, 'value' | 'defaultValue' | 'onChange'>,
>(
  inProps: DateTimeRangePickerTimeWrapperProps<TDate, TView, TComponentProps>,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiDateTimeRangePickerTimeWrapper' });
  const utils = useUtils<TDate>();

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
    newDate: TDate | null,
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

  return (
    <DateTimeRangePickerTimeWrapperRoot className={className}>
      {viewRenderer({
        ...other,
        ref,
        views,
        onViewChange,
        value: currentValue,
        onChange: handleOnChange,
        defaultValue: currentDefaultValue,
      })}
    </DateTimeRangePickerTimeWrapperRoot>
  );
}

export { DateTimeRangePickerTimeWrapper };
