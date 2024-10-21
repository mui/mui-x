import * as React from 'react';
import { createPickerRenderer } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';
import { PickersArrowSwitcher } from './PickersArrowSwitcher';
import { pickersArrowSwitcherClasses } from './pickersArrowSwitcherClasses';

describe('<PickersArrowSwitcher /> - Describes', () => {
  const { render } = createPickerRenderer({ clock: 'fake' });

  describeConformance(
    <PickersArrowSwitcher
      isPreviousDisabled={false}
      onGoToPrevious={() => {}}
      previousLabel="previous"
      isNextDisabled={false}
      nextLabel="next"
      onGoToNext={() => {}}
    />,
    () => ({
      classes: pickersArrowSwitcherClasses,
      inheritComponent: 'div',
      render,
      muiName: 'MuiPickersArrowSwitcher',
      refInstanceof: window.HTMLDivElement,
      skip: ['componentProp', 'componentsProp', 'themeVariants'],
      slots: {
        previousIconButton: {
          expectedClassName: pickersArrowSwitcherClasses.previousIconButton,
        },
        nextIconButton: {
          expectedClassName: pickersArrowSwitcherClasses.nextIconButton,
        },
        leftArrowIcon: {
          expectedClassName: pickersArrowSwitcherClasses.leftArrowIcon,
        },
        rightArrowIcon: {
          expectedClassName: pickersArrowSwitcherClasses.rightArrowIcon,
        },
      },
    }),
  );
});
