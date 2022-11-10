import * as React from 'react';
import Fade from '@mui/material/Fade';
import { styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { SlideDirection } from './PickersSlideTransition';
import { useLocaleText, useUtils } from '../internals/hooks/useUtils';
import { PickersFadeTransitionGroup } from './PickersFadeTransitionGroup';
import { ExportedDateValidationProps } from '../internals/hooks/validation/useDateValidation';
import { ArrowDropDown } from '../internals/components/icons';
import {
  PickersArrowSwitcher,
  ExportedArrowSwitcherProps,
  PickersArrowSwitcherSlotsComponent,
  PickersArrowSwitcherSlotsComponentsProps,
} from '../internals/components/PickersArrowSwitcher';
import {
  usePreviousMonthDisabled,
  useNextMonthDisabled,
} from '../internals/hooks/date-helpers-hooks';
import { CalendarPickerView } from '../internals/models';
import { buildDeprecatedPropsWarning } from '../internals/utils/warning';
import {
  getPickersCalendarHeaderUtilityClass,
  PickersCalendarHeaderClasses,
} from './pickersCalendarHeaderClasses';

export type ExportedCalendarHeaderProps<TDate> = Pick<
  PickersCalendarHeaderProps<TDate>,
  'getViewSwitchingButtonText' | 'leftArrowButtonText' | 'rightArrowButtonText' | 'classes'
>;

export interface PickersCalendarHeaderSlotsComponent extends PickersArrowSwitcherSlotsComponent {
  /**
   * Button displayed to switch between different calendar views.
   * @default IconButton
   */
  SwitchViewButton: React.ElementType;
  /**
   * Icon displayed in the SwitchViewButton. Rotated by 180° when the open view is 'year'.
   * @default ArrowDropDown
   */
  SwitchViewIcon: React.ElementType;
}

// We keep the interface to allow module augmentation
export interface PickersCalendarHeaderComponentsPropsOverrides {}

export interface PickersCalendarHeaderSlotsComponentsProps
  extends PickersArrowSwitcherSlotsComponentsProps {
  switchViewButton: React.ComponentPropsWithRef<typeof IconButton> &
    PickersCalendarHeaderComponentsPropsOverrides;
}

export interface PickersCalendarHeaderProps<TDate>
  extends ExportedArrowSwitcherProps,
    Omit<ExportedDateValidationProps<TDate>, 'shouldDisableDate'> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: Partial<PickersCalendarHeaderSlotsComponent>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: Partial<PickersCalendarHeaderSlotsComponentsProps>;
  currentMonth: TDate;
  disabled?: boolean;
  views: readonly CalendarPickerView[];
  /**
   * Get aria-label text for switching between views button.
   * @param {CalendarPickerView} currentView The view from which we want to get the button text.
   * @returns {string} The label of the view.
   * @deprecated Use the `localeText` prop of `LocalizationProvider` instead, see https://mui.com/x/react-date-pickers/localization/.
   */
  getViewSwitchingButtonText?: (currentView: CalendarPickerView) => string;
  onMonthChange: (date: TDate, slideDirection: SlideDirection) => void;
  openView: CalendarPickerView;
  reduceAnimations: boolean;
  onViewChange?: (view: CalendarPickerView) => void;
  labelId?: string;
  classes?: Partial<PickersCalendarHeaderClasses>;
}

const useUtilityClasses = (ownerState: PickersCalendarHeaderProps<any>) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    labelContainer: ['labelContainer'],
    label: ['label'],
    switchViewButton: ['switchViewButton'],
    switchViewIcon: ['switchViewIcon'],
  };

  return composeClasses(slots, getPickersCalendarHeaderUtilityClass, classes);
};

const PickersCalendarHeaderRoot = styled('div', {
  name: 'MuiPickersCalendarHeader',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{
  ownerState: PickersCalendarHeaderProps<any>;
}>({
  display: 'flex',
  alignItems: 'center',
  marginTop: 16,
  marginBottom: 8,
  paddingLeft: 24,
  paddingRight: 12,
  // prevent jumping in safari
  maxHeight: 30,
  minHeight: 30,
});

const PickersCalendarHeaderLabelContainer = styled('div', {
  name: 'MuiPickersCalendarHeader',
  slot: 'LabelContainer',
  overridesResolver: (_, styles) => styles.labelContainer,
})<{
  ownerState: PickersCalendarHeaderProps<any>;
}>(({ theme }) => ({
  display: 'flex',
  maxHeight: 30,
  overflow: 'hidden',
  alignItems: 'center',
  cursor: 'pointer',
  marginRight: 'auto',
  ...theme.typography.body1,
  fontWeight: theme.typography.fontWeightMedium,
}));

const PickersCalendarHeaderLabel = styled('div', {
  name: 'MuiPickersCalendarHeader',
  slot: 'Label',
  overridesResolver: (_, styles) => styles.label,
})<{
  ownerState: PickersCalendarHeaderProps<any>;
}>({
  marginRight: 6,
});

const PickersCalendarHeaderSwitchViewButton = styled(IconButton, {
  name: 'MuiPickersCalendarHeader',
  slot: 'SwitchViewButton',
  overridesResolver: (_, styles) => styles.switchViewButton,
})({
  marginRight: 'auto',
});

const PickersCalendarHeaderSwitchViewIcon = styled(ArrowDropDown, {
  name: 'MuiPickersCalendarHeader',
  slot: 'SwitchViewIcon',
  overridesResolver: (_, styles) => styles.switchViewIcon,
})<{
  ownerState: PickersCalendarHeaderProps<any>;
}>(({ theme, ownerState }) => ({
  willChange: 'transform',
  transition: theme.transitions.create('transform'),
  transform: 'rotate(0deg)',
  ...(ownerState.openView === 'year' && {
    transform: 'rotate(180deg)',
  }),
}));

const deprecatedPropsWarning = buildDeprecatedPropsWarning(
  'Props for translation are deprecated. See https://mui.com/x/react-date-pickers/localization for more information.',
);

/**
 * @ignore - do not document.
 */
export function PickersCalendarHeader<TDate>(inProps: PickersCalendarHeaderProps<TDate>) {
  const props = useThemeProps({ props: inProps, name: 'MuiPickersCalendarHeader' });
  const {
    components = {},
    componentsProps = {},
    currentMonth: month,
    disabled,
    disableFuture,
    disablePast,
    getViewSwitchingButtonText: getViewSwitchingButtonTextProp,
    leftArrowButtonText: leftArrowButtonTextProp,
    maxDate,
    minDate,
    onMonthChange,
    onViewChange,
    openView: currentView,
    reduceAnimations,
    rightArrowButtonText: rightArrowButtonTextProp,
    views,
    labelId,
  } = props;

  deprecatedPropsWarning({
    leftArrowButtonText: leftArrowButtonTextProp,
    rightArrowButtonText: rightArrowButtonTextProp,
    getViewSwitchingButtonText: getViewSwitchingButtonTextProp,
  });

  const localeText = useLocaleText();

  const leftArrowButtonText = leftArrowButtonTextProp ?? localeText.previousMonth;
  const rightArrowButtonText = rightArrowButtonTextProp ?? localeText.nextMonth;
  const getViewSwitchingButtonText =
    getViewSwitchingButtonTextProp ?? localeText.calendarViewSwitchingButtonAriaLabel;

  const utils = useUtils<TDate>();
  const classes = useUtilityClasses(props);

  const switchViewButtonProps = componentsProps.switchViewButton || {};

  const selectNextMonth = () => onMonthChange(utils.getNextMonth(month), 'left');
  const selectPreviousMonth = () => onMonthChange(utils.getPreviousMonth(month), 'right');

  const isNextMonthDisabled = useNextMonthDisabled(month, {
    disableFuture,
    maxDate,
  });
  const isPreviousMonthDisabled = usePreviousMonthDisabled(month, {
    disablePast,
    minDate,
  });

  const handleToggleView = () => {
    if (views.length === 1 || !onViewChange || disabled) {
      return;
    }

    if (views.length === 2) {
      onViewChange(views.find((view) => view !== currentView) || views[0]);
    } else {
      // switching only between first 2
      const nextIndexToOpen = views.indexOf(currentView) !== 0 ? 0 : 1;
      onViewChange(views[nextIndexToOpen]);
    }
  };

  // No need to display more information
  if (views.length === 1 && views[0] === 'year') {
    return null;
  }

  const ownerState = props;

  return (
    <PickersCalendarHeaderRoot ownerState={ownerState} className={classes.root}>
      <PickersCalendarHeaderLabelContainer
        role="presentation"
        onClick={handleToggleView}
        ownerState={ownerState}
        // putting this on the label item element below breaks when using transition
        aria-live="polite"
        className={classes.labelContainer}
      >
        <PickersFadeTransitionGroup
          reduceAnimations={reduceAnimations}
          transKey={utils.format(month, 'monthAndYear')}
        >
          <PickersCalendarHeaderLabel
            id={labelId}
            data-mui-test="calendar-month-and-year-text"
            ownerState={ownerState}
            className={classes.label}
          >
            {utils.format(month, 'monthAndYear')}
          </PickersCalendarHeaderLabel>
        </PickersFadeTransitionGroup>
        {views.length > 1 && !disabled && (
          <PickersCalendarHeaderSwitchViewButton
            size="small"
            as={components.SwitchViewButton}
            aria-label={getViewSwitchingButtonText(currentView)}
            className={classes.switchViewButton}
            {...switchViewButtonProps}
          >
            <PickersCalendarHeaderSwitchViewIcon
              as={components.SwitchViewIcon}
              ownerState={ownerState}
              className={classes.switchViewIcon}
            />
          </PickersCalendarHeaderSwitchViewButton>
        )}
      </PickersCalendarHeaderLabelContainer>
      <Fade in={currentView === 'day'}>
        <PickersArrowSwitcher
          leftArrowButtonText={leftArrowButtonText}
          rightArrowButtonText={rightArrowButtonText}
          components={components}
          componentsProps={componentsProps}
          onLeftClick={selectPreviousMonth}
          onRightClick={selectNextMonth}
          isLeftDisabled={isPreviousMonthDisabled}
          isRightDisabled={isNextMonthDisabled}
        />
      </Fade>
    </PickersCalendarHeaderRoot>
  );
}
