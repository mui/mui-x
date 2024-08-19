import * as React from 'react';
import { Dayjs } from 'dayjs';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { StaticTimePicker, StaticTimePickerProps } from '@mui/x-date-pickers/StaticTimePicker';
import {
  PickersLayoutProps,
  usePickerLayout,
  pickersLayoutClasses,
  PickersLayoutRoot,
  PickersLayoutContentWrapper,
} from '@mui/x-date-pickers/PickersLayout';
import { renderMultiSectionDigitalClockTimeView } from '@mui/x-date-pickers/timeViewRenderers';
import { TimeView } from '@mui/x-date-pickers/models';

const StyledLayout = styled(PickersLayoutRoot)({
  overflow: 'auto',
  [`.${pickersLayoutClasses.contentWrapper}`]: {
    '& .MuiClock-root': {
      width: 'fit-content',
    },
  },
});

function CustomLayout(props: PickersLayoutProps<Dayjs | null, Dayjs, TimeView>) {
  const { actionBar, content } = usePickerLayout(props);
  return (
    <StyledLayout ownerState={props}>
      <PickersLayoutContentWrapper className={pickersLayoutClasses.contentWrapper}>
        {content}
        {actionBar}
      </PickersLayoutContentWrapper>
    </StyledLayout>
  );
}
export default function DigitalClock() {
  return (
    <Card variant="outlined" sx={{ padding: 0.8, height: 'fit-content' }}>
      <Typography variant="subtitle2" sx={{ pt: 1, pb: 2 }}>
        Book now!
      </Typography>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          flexWrap: 'wrap',
          padding: 0,
        }}
      >
        <StaticTimePicker
          slots={{ layout: CustomLayout }}
          viewRenderers={
            {
              hours: renderMultiSectionDigitalClockTimeView,
              minutes: renderMultiSectionDigitalClockTimeView,
              meridiem: renderMultiSectionDigitalClockTimeView,
            } as StaticTimePickerProps<Dayjs>['viewRenderers']
          }
        />
      </Paper>
    </Card>
  );
}
