import { StaticDatePicker, StaticDatePickerProps } from '@mui/x-date-pickers/StaticDatePicker';
import { DesktopDatePicker, DesktopDatePickerProps } from '@mui/x-date-pickers/DesktopDatePicker';
import { DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

export const customizationLabels: { [k: string]: string } = {
  customTheme: 'Custom Theme',
  styledComponents: 'Styled Components',
  sxProp: 'SX Prop',
};

type CustomizationItemsType = Partial<{
  [k in keyof typeof customizationLabels]: { code: string; type?: 'warning' | 'success' };
}>;

type PickerExamplesType<TComponent, TComponentProps> = {
  name: string;
  component: TComponent;
  componentProps: TComponentProps;
  examples: { [k: string]: CustomizationItemsType };
};

export const staticDatePickerExamples: { [k: string]: CustomizationItemsType } = {
  PickersToolbar: {
    customTheme: {
      code: 'ToolbarCustomTheme.styling.ts',
    },
    styledComponents: {
      code: 'ToolbarStyledComponents.styling.ts',
    },
    sxProp: {
      code: 'ToolbarSxProp.styling.tsx',
    },
  },
  DateCalendar: {
    customTheme: {
      code: 'DateCalendarCustomTheme.styling.ts',
    },
    styledComponents: {
      code: 'DateCalendarStyledComponents.styling.ts',
    },
    sxProp: {
      code: 'DateCalendarSxProp.styling.ts',
    },
  },
  PickersCalendarHeader: {
    customTheme: {
      code: 'CalendarHeaderCustomTheme.styling.ts',
    },
    styledComponents: {
      code: 'CalendarHeaderStyledComponents.styling.ts',
    },
    sxProp: {
      code: 'CalendarHeaderSxProp.styling.tsx',
    },
  },
  DayCalendar: {
    customTheme: {
      code: 'DayCalendarCustomTheme.styling.ts',
    },
    styledComponents: {
      code: 'DayCalendarStyledComponents.styling.ts',
    },
    sxProp: {
      code: 'DayCalendarSxProp.styling.tsx',
    },
  },
};

export const datePickerExamples: { [k: string]: CustomizationItemsType } = {
  DateCalendar: {
    customTheme: {
      code: 'DateCalendarCustomTheme.styling.ts',
    },

    sxProp: {
      code: 'DesktopDatePicker/DateCalendarSxProp.styling.tsx',
    },
    styledComponents: {
      code: 'DesktopDatePicker/DateCalendarStyledComponents.styling.tsx',
      type: 'warning',
    },
  },
  PickersCalendarHeader: {
    customTheme: {
      code: 'CalendarHeaderCustomTheme.styling.ts',
    },

    sxProp: {
      code: 'DesktopDatePicker/CalendarHeaderSxProp.styling.tsx',
    },
    styledComponents: {
      code: 'DesktopDatePicker/CalendarHeaderStyledComponents.styling.tsx',
      type: 'warning',
    },
  },
  DayCalendar: {
    customTheme: {
      code: 'DayCalendarCustomTheme.styling.ts',
    },

    sxProp: {
      code: 'DesktopDatePicker/DayCalendarSxProp.styling.tsx',
    },
    styledComponents: {
      code: 'DesktopDatePicker/DayCalendarStyledComponents.styling.tsx',
      type: 'warning',
    },
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
          sx: { zIndex: 1 },
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
