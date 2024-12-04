import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { styled } from '@mui/material/styles';
import {
  PickersLayoutProps,
  usePickerLayout,
  pickersLayoutClasses,
  PickersLayoutRoot,
  PickersLayoutContentWrapper,
  PickerLayoutOwnerState,
} from '@mui/x-date-pickers/PickersLayout';
import { PickersShortcutsItem } from '@mui/x-date-pickers/PickersShortcuts';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { DateRange } from '@mui/x-date-pickers-pro/models';
import { Layout } from './themes/themes.types';

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

interface CustomLayoutProps extends PickersLayoutProps<DateRange<Dayjs>, 'day'> {
  layout: Layout;
}

const CustomPickersLayoutRoot = styled(PickersLayoutRoot, {
  shouldForwardProp: (prop) => prop !== 'layout',
})(({ ownerState }: { ownerState: PickerLayoutOwnerState & { layout: Layout } }) => ({
  [`.${pickersLayoutClasses.shortcuts}`]:
    ownerState.layout === 'horizontal'
      ? { gridColumn: 2, gridRow: 2 }
      : {
          gridColumn: 1,
          gridRow: 2,
          display: 'flex',
          flexDirection: 'row',
          gap: '4px',
        },
  [`.${pickersLayoutClasses.contentWrapper}`]:
    ownerState.layout === 'horizontal'
      ? {
          gridColumn: 1,
          gridRow: 2,
        }
      : { gridColumn: 1, gridRow: 3 },
  [`.${pickersLayoutClasses.actionBar}`]:
    ownerState.layout === 'horizontal'
      ? { gridColumnStart: 1, gridColumnEnd: 3, gridRow: 3 }
      : { gridColumn: 1, gridRow: 4 },

  [`.${pickersLayoutClasses.toolbar}`]:
    ownerState.layout === 'horizontal'
      ? { gridColumnStart: 1, gridColumnEnd: 3, gridRow: 1 }
      : { gridColumn: 1, gridRow: 1 },
}));

function CustomLayout(props: CustomLayoutProps) {
  const { toolbar, tabs, content, actionBar, shortcuts, ownerState } = usePickerLayout(props);

  return (
    <CustomPickersLayoutRoot ownerState={{ ...ownerState, layout: props.layout }}>
      {toolbar}
      {shortcuts}
      <PickersLayoutContentWrapper
        className={pickersLayoutClasses.contentWrapper}
        ownerState={ownerState}
      >
        {tabs}
        {content}
      </PickersLayoutContentWrapper>
      {actionBar}
    </CustomPickersLayoutRoot>
  );
}

export default function CustomLayoutPicker({ layout }: { layout: Layout }) {
  return (
    <StaticDateRangePicker
      defaultValue={[dayjs('2022-04-17'), dayjs('2022-04-21')]}
      slots={{
        layout: CustomLayout as any,
      }}
      slotProps={{
        shortcuts: {
          items: shortcutsItems,
        },
        layout: { layout } as CustomLayoutProps,
        actionBar: { actions: ['accept', 'clear', 'cancel'] },
      }}
    />
  );
}
