import * as React from 'react';
import clsx from 'clsx';
import Divider from '@mui/material/Divider';
import {
  PickersLayoutContentWrapper,
  PickersLayoutProps,
  PickersLayoutRoot,
  pickersLayoutClasses,
  usePickerLayout,
} from '@mui/x-date-pickers/PickersLayout';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { DateRange } from '../models';
import { DateTimeRangePickerView } from '../internals/models/dateTimeRange';

/**
 * @ignore - internal component.
 */
export function DesktopDateTimeRangePickerLayout<TDate extends PickerValidDate>(
  props: PickersLayoutProps<DateRange<TDate>, TDate, DateTimeRangePickerView>,
) {
  const { toolbar, tabs, content, actionBar, shortcuts } = usePickerLayout(props);
  const { sx, className, isLandscape, ref } = props;
  const isActionBarVisible = actionBar && (actionBar.props.actions?.length ?? 0) > 0;

  return (
    <PickersLayoutRoot
      ref={ref}
      className={clsx(className, pickersLayoutClasses.root)}
      sx={[
        {
          [`& .${pickersLayoutClasses.tabs}`]: { gridRow: 4, gridColumn: '1 / 4' },
          [`& .${pickersLayoutClasses.actionBar}`]: { gridRow: 5 },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
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
      {isActionBarVisible && <Divider sx={{ gridRow: 3, gridColumn: '1/4' }} />}
      {tabs}
      {actionBar}
    </PickersLayoutRoot>
  );
}
