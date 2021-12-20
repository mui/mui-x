import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DesktopDateTimePicker, DesktopDateTimePickerProps } from '../DesktopDateTimePicker';
import { MobileDateTimePicker, MobileDateTimePickerProps } from '../MobileDateTimePicker';

export interface DateTimePickerProps<TDate = unknown>
  extends DesktopDateTimePickerProps<TDate>,
    MobileDateTimePickerProps<TDate> {
  /**
   * CSS media query when `Mobile` mode will be changed to `Desktop`.
   * @default '@media (pointer: fine)'
   * @example '@media (min-width: 720px)' or theme.breakpoints.up("sm")
   */
  desktopModeMediaQuery?: string;
}

type DateTimePickerComponent = (<TDate>(
  props: DateTimePickerProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

/**
 *
 * Demos:
 *
 * - [Date Time Picker](https://mui.com/components/date-time-picker/)
 * - [Pickers](https://mui.com/components/pickers/)
 *
 * API:
 *
 * - [DateTimePicker API](https://mui.com/api/date-time-picker/)
 */
export const DateTimePicker = React.forwardRef(function DateTimePicker<TDate>(
  inProps: DateTimePickerProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiDateTimePicker' });
  const {
    cancelText,
    clearable,
    clearText,
    desktopModeMediaQuery = '@media (pointer: fine)',
    DialogProps,
    okText,
    PopperProps,
    showTodayButton,
    todayText,
    TransitionComponent,
    ...other
  } = props;

  const isDesktop = useMediaQuery(desktopModeMediaQuery);

  return isDesktop ? (
    <DesktopDateTimePicker
      ref={ref}
      PopperProps={PopperProps}
      TransitionComponent={TransitionComponent}
      {...other}
    />
  ) : (
    <MobileDateTimePicker
      ref={ref}
      cancelText={cancelText}
      clearable={clearable}
      clearText={clearText}
      DialogProps={DialogProps}
      okText={okText}
      showTodayButton={showTodayButton}
      todayText={todayText}
      {...other}
    />
  );
}) as DateTimePickerComponent;
