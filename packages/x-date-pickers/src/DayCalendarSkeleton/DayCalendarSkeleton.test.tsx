import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  DayCalendarSkeleton,
  dayCalendarSkeletonClasses as classes,
} from '@mui/x-date-pickers/DayCalendarSkeleton';
import { createPickerRenderer } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';
import { describe, it, expect } from 'vitest';

describe('<DayCalendarSkeleton />', () => {
  const { render } = createPickerRenderer();

  describeConformance(<DayCalendarSkeleton />, () => ({
    classes,
    inheritComponent: 'div',
    render,
    muiName: 'MuiDayCalendarSkeleton',
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'refForwarding', 'themeVariants'],
  }));

  it('should pass the owner state to every slot', () => {
    const theme = createTheme({
      components: {
        MuiDayCalendarSkeleton: {
          styleOverrides: {
            root: ({ ownerState }) => ({
              opacity: ownerState.className ? 0.5 : 1,
            }),
          },
        },
      },
    });

    render(
      <ThemeProvider theme={theme}>
        <DayCalendarSkeleton />
      </ThemeProvider>,
    );

    expect(document.querySelectorAll(`.${classes.daySkeleton}`)).to.have.length(35);
  });
});
