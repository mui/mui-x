import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
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
  TDate extends unknown,
  TView extends TimeViewWithMeridiem,
  TComponentProps extends BaseClockProps<TDate, TView>,
> = Pick<UseRangePositionResponse, 'rangePosition' | 'onRangePositionChange'> &
  Omit<
    TComponentProps,
    'views' | 'openTo' | 'view' | 'onViewChange' | 'value' | 'defaultValue' | 'onChange'
  > & {
    view: TView;
    onViewChange?: (view: TView) => void;
    views: readonly TView[];
    value: DateRange<TDate>;
    defaultValue?: DateRange<TDate>;
    onChange?: (
      value: DateRange<TDate>,
      selectionState: PickerSelectionState,
      selectedView: TView,
    ) => void;
    // TODO: fix types
    viewRenderer: PickerViewRenderer<TDate, TView, any, {}>;
  };

const DateTimeRangePickerTimeWrapperRoot = styled('div', {
  name: 'DateTimeRangePickerTimeWrapper',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})({});

const DateTimeRangePickerTimeWrapperContainer = styled('div', {
  name: 'DateTimeRangePickerTimeWrapper',
  slot: 'Container',
  overridesResolver: (_, styles) => styles.root,
})({
  display: 'flex',
  flexDirection: 'row',
  padding: '0 6px',
  justifyContent: 'space-between',
  height: 32,
});

const DateTimeRangePickerTimeWrapper = React.forwardRef(function DateTimeRangePickerTimeWrapper<
  TDate extends unknown,
  TView extends TimeViewWithMeridiem,
  TComponentProps extends BaseClockProps<TDate, TView>,
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
    ...other
  } = props;

  const currentValue = (rangePosition === 'start' ? value?.[0] : value?.[1]) ?? null;
  const currentDefaultValue =
    (rangePosition === 'start' ? defaultValue?.[0] : defaultValue?.[1]) ?? null;
  const handleOnChange = (
    newDate: TDate | null,
    selectionState: PickerSelectionState,
    selectedView: TView,
  ) => {
    if (!onChange) {
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
      onViewChange(timeViews[0]);
      onRangePositionChange(rangePosition === 'start' ? 'end' : 'start');
    }
    onChange(newRange, isFullRangeSelected ? 'finish' : 'partial', selectedView);
  };

  return (
    <DateTimeRangePickerTimeWrapperRoot ref={ref}>
      <DateTimeRangePickerTimeWrapperContainer>
        <Button
          variant="text"
          color={rangePosition === 'start' ? 'primary' : 'inherit'}
          onClick={() => onRangePositionChange('start')}
          size="small"
          sx={{ minWidth: 0 }}
        >
          Start
        </Button>
        <Button
          variant="text"
          color={rangePosition === 'end' ? 'primary' : 'inherit'}
          onClick={() => onRangePositionChange('end')}
          size="small"
          sx={{ minWidth: 0 }}
        >
          End
        </Button>
      </DateTimeRangePickerTimeWrapperContainer>
      <Divider />
      {viewRenderer({
        ...other,
        views,
        onViewChange,
        value: currentValue,
        onChange: handleOnChange,
        defaultValue: currentDefaultValue,
      })}
    </DateTimeRangePickerTimeWrapperRoot>
  );
});

export { DateTimeRangePickerTimeWrapper };
