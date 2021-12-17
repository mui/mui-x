import * as React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DatePickerProps } from './DatePickerProps';
import { useDatePickerProps } from './useDatePickerProps';

import { DatePickerDesktop } from '../DatePickerDesktop';
import { DatePickerMobile } from '../DatePickerMobile';

/**
 * TODO: Fix name duplicate with core `MuiCalendarPicker` component
 */
export const DatePicker = (inProps: DatePickerProps) => {
  const props = useDatePickerProps(inProps);

  const { ...other } = props;

  const isDesktop = useMediaQuery('@media (pointer: fine)');

  if (isDesktop) {
    return <DatePickerDesktop {...other} />;
  }

  return <DatePickerMobile {...other} />;
};
