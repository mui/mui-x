import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import {
  PickersLayoutProps,
  usePickerLayout,
  pickersLayoutClasses,
  PickersLayoutRoot,
  PickersLayoutContentWrapper,
} from '@mui/x-date-pickers/PickersLayout';
import { TimeView } from '@mui/x-date-pickers/models';

const StyledLayout = styled(PickersLayoutRoot)({
  overflow: 'auto',
  minWidth: 'fit-content',
  [`.${pickersLayoutClasses.toolbar}`]: {
    padding: '4px 16px',
  },
  [`.${pickersLayoutClasses.contentWrapper}`]: {
    '& .MuiTimeClock-root': {
      width: 'fit-content',
    },
    '& .MuiPickersArrowSwitcher-root': {
      justifyContent: 'space-between',
      width: '100%',
      right: 0,
      top: '2px',
    },
  },
});

function CustomLayout(props: PickersLayoutProps<Dayjs | null, Dayjs, TimeView>) {
  const { actionBar, content, toolbar } = usePickerLayout(props);
  return (
    <StyledLayout ownerState={props}>
      {toolbar}
      <PickersLayoutContentWrapper className={pickersLayoutClasses.contentWrapper}>
        {content}
        {actionBar}
      </PickersLayoutContentWrapper>
    </StyledLayout>
  );
}
export default function Clock() {
  return (
    <Card variant="outlined">
      <StaticTimePicker defaultValue={dayjs('2022-04-17T15:30')} slots={{ layout: CustomLayout }} />
    </Card>
  );
}
