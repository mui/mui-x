import * as React from 'react';
import Fade from '@mui/material/Fade';
import { styled, useThemeProps } from '@mui/material/styles';
import { SlotComponentProps, useSlotProps } from '@mui/base/utils';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import { SlideDirection } from './PickersSlideTransition';
import { useLocaleText, useUtils } from '../internals/hooks/useUtils';
import { PickersFadeTransitionGroup } from './PickersFadeTransitionGroup';
import { DateComponentValidationProps } from '../internals/hooks/validation/useDateValidation';
import { ArrowDropDown } from '../internals/components/icons';
import {
  PickersArrowSwitcher,
  ExportedPickersArrowSwitcherProps,
  PickersArrowSwitcherSlotsComponent,
  PickersArrowSwitcherSlotsComponentsProps,
} from '../internals/components/PickersArrowSwitcher';
import {
  usePreviousMonthDisabled,
  useNextMonthDisabled,
} from '../internals/hooks/date-helpers-hooks';
import { DateView } from '../internals/models';
import {
  getPickersCalendarHeaderUtilityClass,
  pickersCalendarHeaderClasses,
  PickersCalendarHeaderClasses,
} from './pickersCalendarHeaderClasses';

export type ExportedCalendarHeaderProps<TDate> = Pick<PickersCalendarHeaderProps<TDate>, 'classes'>;

export interface PickersCalendarHeaderSlotsComponent extends PickersArrowSwitcherSlotsComponent {
  /**
   * Button displayed to switch between different calendar views.
   * @default IconButton
   */
  SwitchViewButton?: React.ElementType;
  /**
   * Icon displayed in the SwitchViewButton. Rotated by 180° when the open view is 'year'.
   * @default ArrowDropDown
   */
  SwitchViewIcon?: React.ElementType;
}

// We keep the interface to allow module augmentation
export interface PickersCalendarHeaderComponentsPropsOverrides {}

type PickersCalendarHeaderOwnerState<TDate> = PickersCalendarHeaderProps<TDate>;

export interface PickersCalendarHeaderSlotsComponentsProps<TDate>
  extends PickersArrowSwitcherSlotsComponentsProps {
  switchViewButton?: SlotComponentProps<
    typeof IconButton,
    PickersCalendarHeaderComponentsPropsOverrides,
    PickersCalendarHeaderOwnerState<TDate>
  >;
  switchViewIcon?: SlotComponentProps<
    typeof SvgIcon,
    PickersCalendarHeaderComponentsPropsOverrides,
    undefined
  >;
}

export interface PickersCalendarHeaderProps<TDate>
  extends ExportedPickersArrowSwitcherProps,
    DateComponentValidationProps<TDate> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: PickersCalendarHeaderSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: PickersCalendarHeaderSlotsComponentsProps<TDate>;
  currentMonth: TDate;
  disabled?: boolean;
  views: readonly DateView[];
  onMonthChange: (date: TDate, slideDirection: SlideDirection) => void;
  openView: DateView;
  reduceAnimations: boolean;
  onViewChange?: (view: DateView) => void;
  labelId?: string;
  classes?: Partial<PickersCalendarHeaderClasses>;
}

const useUtilityClasses = (ownerState: PickersCalendarHeaderOwnerState<any>) => {
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
  ownerState: PickersCalendarHeaderOwnerState<any>;
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
  ownerState: PickersCalendarHeaderOwnerState<any>;
}>(({ theme }) => ({
  display: 'flex',
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
  ownerState: PickersCalendarHeaderOwnerState<any>;
}>({
  marginRight: 6,
});

const PickersCalendarHeaderSwitchViewButton = styled(IconButton, {
  name: 'MuiPickersCalendarHeader',
  slot: 'SwitchViewButton',
  overridesResolver: (_, styles) => styles.switchViewButton,
})<{
  ownerState: PickersCalendarHeaderOwnerState<any>;
}>(({ ownerState }) => ({
  marginRight: 'auto',
  ...(ownerState.openView === 'year' && {
    [`.${pickersCalendarHeaderClasses.switchViewIcon}`]: {
      transform: 'rotate(180deg)',
    },
  }),
}));

const PickersCalendarHeaderSwitchViewIcon = styled(ArrowDropDown, {
  name: 'MuiPickersCalendarHeader',
  slot: 'SwitchViewIcon',
  overridesResolver: (_, styles) => styles.switchViewIcon,
})(({ theme }) => ({
  willChange: 'transform',
  transition: theme.transitions.create('transform'),
  transform: 'rotate(0deg)',
}));

/**
 * @ignore - do not document.
 */
export function PickersCalendarHeader<TDate>(inProps: PickersCalendarHeaderProps<TDate>) {
  const localeText = useLocaleText();
  const utils = useUtils<TDate>();

  const props = useThemeProps({ props: inProps, name: 'MuiPickersCalendarHeader' });

  const {
    components = {},
    componentsProps = {},
    currentMonth: month,
    disabled,
    disableFuture,
    disablePast,
    maxDate,
    minDate,
    onMonthChange,
    onViewChange,
    openView: currentView,
    reduceAnimations,
    views,
    labelId,
  } = props;

  const ownerState = props;

  const classes = useUtilityClasses(props);

  const SwitchViewButton = components.SwitchViewButton ?? PickersCalendarHeaderSwitchViewButton;
  const switchViewButtonProps = useSlotProps({
    elementType: SwitchViewButton,
    externalSlotProps: componentsProps.switchViewButton,
    additionalProps: {
      size: 'small',
      'aria-label': localeText.calendarViewSwitchingButtonAriaLabel(currentView),
    },
    ownerState,
    className: classes.switchViewButton,
  });

  const SwitchViewIcon = components.SwitchViewIcon ?? PickersCalendarHeaderSwitchViewIcon;
  // The spread is here to avoid this bug mui/material-ui#34056
  const { ownerState: switchViewIconOwnerState, ...switchViewIconProps } = useSlotProps({
    elementType: SwitchViewIcon,
    externalSlotProps: componentsProps.switchViewIcon,
    ownerState: undefined,
    className: classes.switchViewIcon,
  });

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
          <SwitchViewButton {...switchViewButtonProps}>
            <SwitchViewIcon {...switchViewIconProps} />
          </SwitchViewButton>
        )}
      </PickersCalendarHeaderLabelContainer>
      <Fade in={currentView === 'day'}>
        <PickersArrowSwitcher
          components={components}
          componentsProps={componentsProps}
          onGoToPrevious={selectPreviousMonth}
          isPreviousDisabled={isPreviousMonthDisabled}
          previousLabel={localeText.previousMonth}
          onGoToNext={selectNextMonth}
          isNextDisabled={isNextMonthDisabled}
          nextLabel={localeText.nextMonth}
        />
      </Fade>
    </PickersCalendarHeaderRoot>
  );
}
