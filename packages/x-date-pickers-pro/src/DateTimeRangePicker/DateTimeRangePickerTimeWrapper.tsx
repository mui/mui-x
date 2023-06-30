import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { UseRangePositionResponse } from '../internal/hooks/useRangePosition';

export interface DateTimeRangePickerTimeWrapperProps
  extends Pick<UseRangePositionResponse, 'rangePosition' | 'onRangePositionChange'> {
  children?: React.ReactNode;
}

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

const DateTimeRangePickerTimeWrapper = React.forwardRef(function DateTimeRangePickerTimeWrapper(
  inProps: DateTimeRangePickerTimeWrapperProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiDateTimeRangePickerTimeWrapper' });

  const { rangePosition, onRangePositionChange, children } = props;

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
      {children}
    </DateTimeRangePickerTimeWrapperRoot>
  );
});

export { DateTimeRangePickerTimeWrapper };
