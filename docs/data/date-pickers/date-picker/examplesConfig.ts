import { StaticDatePicker, StaticDatePickerProps } from '@mui/x-date-pickers/StaticDatePicker';
import { DesktopDatePicker, DesktopDatePickerProps } from '@mui/x-date-pickers/DesktopDatePicker';
import { DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

export const customizationLabels: { [k: string]: string } = {
  customTheme: 'Custom Theme',
  styledComponents: 'Styled Components',
  sxProp: 'SX Prop',
};

type CustomizationItemsType = Partial<{ [k in keyof typeof customizationLabels]: string }>;

type PickerExamplesType<TComponent, TComponentProps> = {
  name: string;
  component: TComponent;
  componentProps: TComponentProps;
  examples: { [k: string]: CustomizationItemsType };
};

export const staticDatePickerExamples: { [k: string]: CustomizationItemsType } = {
  PickersToolbar: {
    customTheme: 'ToolbarCustomTheme.styling.ts',
    styledComponents: 'ToolbarStyledComponents.styling.ts',
  },
  DateCalendar: {
    customTheme: 'DateCalendarCustomTheme.styling.ts',
    styledComponents: 'DateCalendarStyledComponents.styling.ts',
  },
  PickersCalendarHeader: {
    customTheme: 'CalendarHeaderCustomTheme.styling.ts',
    styledComponents: 'CalendarHeaderStyledComponents.styling.ts',
  },
  DayCalendar: {
    customTheme: 'DayCalendarCustomTheme.styling.ts',
    styledComponents: 'DayCalendarStyledComponents.styling.ts',
  },
};

export const datePickerExamples: { [k: string]: CustomizationItemsType } = {
  DateCalendar: {
    customTheme: 'DateCalendarCustomTheme.styling.ts',
    styledComponents: 'DesktopDatePicker/DateCalendarStyledComponents.styling.tsx',
  },
  PickersCalendarHeader: {
    customTheme: 'CalendarHeaderCustomTheme.styling.ts',
    styledComponents: 'DesktopDatePicker/CalendarHeaderStyledComponents.styling.tsx',
  },
  DayCalendar: {
    customTheme: 'DayCalendarCustomTheme.styling.ts',
    styledComponents: 'DesktopDatePicker/DayCalendarStyledComponents.styling.tsx',
  },
};

const pickerProps: DatePickerProps<Dayjs> = {
  views: ['day', 'month', 'year'],
  monthsPerRow: 3,
  yearsPerRow: 3,
  minDate: dayjs(new Date(2020, 0, 1)),
  maxDate: dayjs(new Date(2028, 12, 31)),
};

export const pickerExamples = [
  {
    name: 'StaticDatePicker',
    component: StaticDatePicker,
    componentProps: { ...pickerProps },
    examples: staticDatePickerExamples,
  } as PickerExamplesType<typeof StaticDatePicker, StaticDatePickerProps<Dayjs>>,
  {
    name: 'DesktopDatePicker',
    component: DesktopDatePicker,
    componentProps: {
      open: true,
      slotProps: {
        popper: {
          disablePortal: true,
          placement: 'bottom-start',
          modifiers: [
            {
              name: 'flip',
              options: {
                fallbackPlacements: ['bottom-start'],
              },
            },
          ],
        },
      },
      ...pickerProps,
    },
    examples: datePickerExamples,
  } as PickerExamplesType<typeof DesktopDatePicker, DesktopDatePickerProps<Dayjs>>,
];
