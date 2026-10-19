// Review surface for the pickers density enhancer, routed from
// `docs/pages/x/density-experiment-pickers.js`. Remove or turn into a docs demo before merge.
import * as React from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { MonthCalendar } from '@mui/x-date-pickers/MonthCalendar';
import { YearCalendar } from '@mui/x-date-pickers/YearCalendar';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { MobileDateTimeRangePicker } from '@mui/x-date-pickers-pro/MobileDateTimeRangePicker';
import { MobileTimeRangePicker } from '@mui/x-date-pickers-pro/MobileTimeRangePicker';
import { DesktopTimeRangePicker } from '@mui/x-date-pickers-pro/DesktopTimeRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { unstable_enhanceDensity as enhancePickers } from '@mui/x-date-pickers-pro/density';
import DensityExperimentShell, { createEnhancedTheme } from './DensityExperimentShell';

const enhanced = createEnhancedTheme(enhancePickers);
const value = dayjs('2026-04-17T09:30');
const range: [dayjs.Dayjs, dayjs.Dayjs] = [dayjs('2026-04-14T09:30'), dayjs('2026-04-22T17:00')];
const noActions = { actionBar: { actions: [] } } as const;
const variants = ['outlined', 'filled', 'standard'] as const;
const sizes = ['medium', 'small'] as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        sx={{ flexWrap: 'wrap', alignItems: 'flex-start' }}
      >
        {children}
      </Stack>
    </div>
  );
}

export default function DensityExperimentPickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DensityExperimentShell
        title="Date and Time Pickers density — material enhancer + pickers enhancer chain"
        description={
          <React.Fragment>
            Right column: <code>enhancePickers(enhanceMaterial(createTheme(...)))</code> with the
            Pro enhancer (community underneath). Each field row compares a material TextField with
            the picker fields of the same variant and size. The date time range and time range
            pickers open in a dialog: click their field to review the tabs and toolbars.
          </React.Fragment>
        }
        enhanced={enhanced}
        componentNames={[
          'MuiPickerDay',
          'MuiDayCalendar',
          'MuiDateCalendar',
          'MuiPickersCalendarHeader',
          'MuiPickersArrowSwitcher',
          'MuiMonthCalendar',
          'MuiYearCalendar',
          'MuiDigitalClock',
          'MuiMultiSectionDigitalClockSection',
          'MuiClock',
          'MuiPickersToolbar',
          'MuiPickersToolbarButton',
          'MuiDatePickerToolbar',
          'MuiTimePickerToolbar',
          'MuiDateTimePickerToolbar',
          'MuiPickersInputBase',
          'MuiPickersOutlinedInput',
          'MuiPickersFilledInput',
          'MuiPickersInput',
          'MuiDateRangePickerDay',
          'MuiDateRangeCalendar',
          'MuiDateTimeRangePickerTabs',
          'MuiTimeRangePickerTabs',
          'MuiTimeRangePickerToolbar',
        ]}
      >
        {() => (
          <React.Fragment>
            <Section title="Calendars">
              <DateCalendar defaultValue={value} />
              <DateCalendar defaultValue={value} displayWeekNumber />
              <MonthCalendar defaultValue={value} />
              <YearCalendar defaultValue={value} />
            </Section>
            <Section title="Toolbars and clocks">
              <StaticDatePicker defaultValue={value} slotProps={noActions} />
              <StaticDatePicker
                defaultValue={value}
                orientation="landscape"
                slotProps={noActions}
              />
              <StaticTimePicker defaultValue={value} slotProps={noActions} />
              <StaticDateTimePicker defaultValue={value} slotProps={noActions} />
              <DigitalClock defaultValue={value} />
              <MultiSectionDigitalClock defaultValue={value} />
            </Section>
            <Section title="Fields">
              {variants.map((variant) =>
                sizes.map((size) => (
                  <Stack
                    key={`${variant}-${size}`}
                    direction="row"
                    spacing={1.5}
                    useFlexGap
                    sx={{ flexWrap: 'wrap' }}
                  >
                    <TextField
                      variant={variant}
                      size={size}
                      label="Text"
                      defaultValue="04/17/2026"
                      sx={{ width: 150 }}
                    />
                    <DateField
                      variant={variant}
                      size={size}
                      label="Date"
                      defaultValue={value}
                      sx={{ width: 150 }}
                    />
                    <DateField variant={variant} size={size} label="Empty" sx={{ width: 150 }} />
                    <DatePicker
                      label="Picker"
                      defaultValue={value}
                      slotProps={{ textField: { variant, size, sx: { width: 180 } } }}
                    />
                  </Stack>
                )),
              )}
            </Section>
            <Section title="Range (Pro)">
              <DateRangeCalendar defaultValue={range} />
              <StaticDateRangePicker defaultValue={range} slotProps={noActions} />
              <SingleInputDateRangeField label="Range" defaultValue={range} />
              <SingleInputDateRangeField label="Small range" size="small" defaultValue={range} />
              <MobileDateTimeRangePicker
                label="Date time range (opens a dialog)"
                defaultValue={range}
              />
              <MobileTimeRangePicker label="Time range (opens a dialog)" defaultValue={range} />
              <DesktopTimeRangePicker label="Time range (desktop)" defaultValue={range} />
            </Section>
          </React.Fragment>
        )}
      </DensityExperimentShell>
    </LocalizationProvider>
  );
}
