import * as React from 'react';
import clsx from 'clsx';
import {
  PickersLayoutContentWrapper,
  PickersLayoutProps,
  PickersLayoutRoot,
  pickersLayoutClasses,
  usePickerLayout,
} from '@mui/x-date-pickers/PickersLayout';
import { DateRange } from '../models';
import { DateTimeRangePickerView } from '../internals/models/dateTimeRange';

/**
 * @ignore - internal component.
 */
export function DesktopDateTimeRangePickerLayout<TDate>(
  props: PickersLayoutProps<DateRange<TDate>, TDate, DateTimeRangePickerView>,
) {
  const { toolbar, tabs, content, actionBar, shortcuts } = usePickerLayout(props);
  const { sx, className, isLandscape, ref } = props;

  return (
    <PickersLayoutRoot
      ref={ref}
      className={clsx(className, pickersLayoutClasses.root)}
      sx={{
        [`& .${pickersLayoutClasses.tabs}`]: { gridRow: 3, gridColumn: '1 / 4' },
        [`& .${pickersLayoutClasses.actionBar}`]: { gridRow: 4 },
        ...sx,
      }}
      ownerState={props}
    >
      {isLandscape ? shortcuts : toolbar}
      {isLandscape ? toolbar : shortcuts}
      <PickersLayoutContentWrapper
        className={pickersLayoutClasses.contentWrapper}
        sx={{ flexDirection: 'row' }}
      >
        {content}
      </PickersLayoutContentWrapper>
      {tabs}
      {actionBar}
    </PickersLayoutRoot>
  );
}
