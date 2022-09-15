import * as React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useThemeProps } from '@mui/material/styles';
import { DesktopDatePicker2 } from '../DesktopDatePicker2';
import { MobileDatePicker2 } from '../MobileDatePicker2';
import { DatePicker2Props } from './DatePicker2.types';

type DatePickerComponent = (<TDate>(
  props: DatePicker2Props<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

const DatePicker2 = React.forwardRef(function DatePicker2<TDate>(
  inProps: DatePicker2Props<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiDatePicker2' });

  const { desktopModeMediaQuery = '@media (pointer: fine)', ...other } = props;

  // defaults to `true` in environments where `window.matchMedia` would not be available (i.e. test/jsdom)
  const isDesktop = useMediaQuery(desktopModeMediaQuery, { defaultMatches: true });

  if (isDesktop) {
    return <DesktopDatePicker2 ref={ref} {...other} />;
  }

  return <MobileDatePicker2 ref={ref} {...other} />;
}) as DatePickerComponent;

export { DatePicker2 };
