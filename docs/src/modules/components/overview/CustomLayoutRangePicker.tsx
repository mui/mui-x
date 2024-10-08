import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  PickersLayoutProps,
  usePickerLayout,
  pickersLayoutClasses,
  PickersLayoutRoot,
  PickersLayoutContentWrapper,
} from '@mui/x-date-pickers/PickersLayout';
import { PickersShortcutsItem } from '@mui/x-date-pickers/PickersShortcuts';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { DateRange } from '@mui/x-date-pickers-pro/models';

const shortcutsItems: PickersShortcutsItem<DateRange<Dayjs>>[] = [
  {
    label: 'This Week',
    getValue: () => {
      const today = dayjs();
      return [today.startOf('week'), today.endOf('week')];
    },
  },
  {
    label: 'Last Week',
    getValue: () => {
      const today = dayjs();
      const prevWeek = today.subtract(7, 'day');
      return [prevWeek.startOf('week'), prevWeek.endOf('week')];
    },
  },
  {
    label: 'Last 7 Days',
    getValue: () => {
      const today = dayjs();
      return [today.subtract(7, 'day'), today];
    },
  },
  {
    label: 'Current Month',
    getValue: () => {
      const today = dayjs();
      return [today.startOf('month'), today.endOf('month')];
    },
  },
  {
    label: 'Next Month',
    getValue: () => {
      const today = dayjs();
      const startOfNextMonth = today.endOf('month').add(1, 'day');
      return [startOfNextMonth, startOfNextMonth.endOf('month')];
    },
  },
  { label: 'Reset', getValue: () => [null, null] },
];

const CustomPickersLayoutRoot = styled(PickersLayoutRoot)({
  overflow: 'auto',
  [`.${pickersLayoutClasses.contentWrapper}`]: {
    gridColumn: 1,
    gridRow: 2,
  },
  [`.${pickersLayoutClasses.toolbar}`]: {
    gridColumnStart: 1,
    gridColumnEnd: 3,
    gridRow: 1,
  },
  [`.${pickersLayoutClasses.actionBar}`]: {
    gridColumnStart: 1,
    gridColumnEnd: 3,
    gridRow: 3,
  },
  [`.${pickersLayoutClasses.shortcuts}`]: {
    gridColumn: 2,
    gridRow: 2,
  },
});

function CustomLayout(props: PickersLayoutProps<DateRange<Dayjs>, Dayjs, 'day'>) {
  const { toolbar, tabs, content, actionBar, shortcuts } = usePickerLayout(props);

  return (
    <CustomPickersLayoutRoot ownerState={props}>
      {toolbar}
      {shortcuts}
      <PickersLayoutContentWrapper className={pickersLayoutClasses.contentWrapper}>
        {tabs}
        {content}
      </PickersLayoutContentWrapper>
      {actionBar}
    </CustomPickersLayoutRoot>
  );
}
export default function CustomLayoutPicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDateRangePicker
        // views={['year', 'month', 'day']}
        defaultValue={[dayjs('2022-04-17'), dayjs('2022-04-21')]}
        slots={{
          layout: CustomLayout,
        }}
        slotProps={{
          shortcuts: {
            items: shortcutsItems,
          },
          actionBar: { actions: ['accept', 'clear', 'cancel'] },
        }}
      />
    </LocalizationProvider>
  );
}
