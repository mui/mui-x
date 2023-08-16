import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Fade from '@mui/material/Fade';
import { styled, SxProps, Theme, useThemeProps } from '@mui/material/styles';
import { SlotComponentProps, useSlotProps } from '@mui/base/utils';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import { SlideDirection } from '../DateCalendar/PickersSlideTransition';
import { useLocaleText, useUtils } from '../internals/hooks/useUtils';
import { PickersFadeTransitionGroup } from '../DateCalendar/PickersFadeTransitionGroup';
import { ArrowDropDownIcon } from '../icons';
import {
  PickersArrowSwitcher,
  ExportedPickersArrowSwitcherProps,
  PickersArrowSwitcherSlotsComponent,
  PickersArrowSwitcherSlotsComponentsProps,
} from '../internals/components/PickersArrowSwitcher';
import {
  usePreviousMonthDisabled,
  useNextMonthDisabled,
  MonthValidationOptions,
} from '../internals/hooks/date-helpers-hooks';
import { DateView } from '../models';
import {
  getPickersCalendarHeaderUtilityClass,
  pickersCalendarHeaderClasses,
  PickersCalendarHeaderClasses,
} from './pickersCalendarHeaderClasses';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';

export type ExportedPickersCalendarHeaderProps<TDate> = Pick<
  PickersCalendarHeaderProps<TDate>,
  'classes' | 'slots' | 'slotProps'
>;

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
    MonthValidationOptions<TDate> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<PickersCalendarHeaderSlotsComponent>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: PickersCalendarHeaderSlotsComponentsProps<TDate>;
  currentMonth: TDate;
  disabled?: boolean;
  views: readonly DateView[];
  onMonthChange: (date: TDate, slideDirection: SlideDirection) => void;
  view: DateView;
  reduceAnimations: boolean;
  onViewChange?: (view: DateView) => void;
  labelId?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<PickersCalendarHeaderClasses>;
  /**
   * className applied to the root element.
   */
  className?: string;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
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
  ...(ownerState.view === 'year' && {
    [`.${pickersCalendarHeaderClasses.switchViewIcon}`]: {
      transform: 'rotate(180deg)',
    },
  }),
}));

const PickersCalendarHeaderSwitchViewIcon = styled(ArrowDropDownIcon, {
  name: 'MuiPickersCalendarHeader',
  slot: 'SwitchViewIcon',
  overridesResolver: (_, styles) => styles.switchViewIcon,
})(({ theme }) => ({
  willChange: 'transform',
  transition: theme.transitions.create('transform'),
  transform: 'rotate(0deg)',
}));

type PickersCalendarHeaderComponent = (<TDate>(
  props: PickersCalendarHeaderProps<TDate> & React.RefAttributes<HTMLButtonElement>,
) => React.JSX.Element) & { propTypes?: any };

const PickersCalendarHeader = React.forwardRef(function PickersCalendarHeader<TDate>(
  inProps: PickersCalendarHeaderProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const localeText = useLocaleText<TDate>();
  const utils = useUtils<TDate>();

  const props = useThemeProps({ props: inProps, name: 'MuiPickersCalendarHeader' });

  const {
    slots,
    slotProps,
    currentMonth: month,
    disabled,
    disableFuture,
    disablePast,
    maxDate,
    minDate,
    onMonthChange,
    onViewChange,
    view,
    reduceAnimations,
    views,
    labelId,
    className,
    timezone,
    ...other
  } = props;

  const ownerState = props;

  const classes = useUtilityClasses(props);

  const SwitchViewButton = slots?.switchViewButton ?? PickersCalendarHeaderSwitchViewButton;
  const switchViewButtonProps = useSlotProps({
    elementType: SwitchViewButton,
    externalSlotProps: slotProps?.switchViewButton,
    additionalProps: {
      size: 'small',
      'aria-label': localeText.calendarViewSwitchingButtonAriaLabel(view),
    },
    ownerState,
    className: classes.switchViewButton,
  });

  const SwitchViewIcon = slots?.switchViewIcon ?? PickersCalendarHeaderSwitchViewIcon;
  // The spread is here to avoid this bug mui/material-ui#34056
  const { ownerState: switchViewIconOwnerState, ...switchViewIconProps } = useSlotProps({
    elementType: SwitchViewIcon,
    externalSlotProps: slotProps?.switchViewIcon,
    ownerState: undefined,
    className: classes.switchViewIcon,
  });

  const selectNextMonth = () => onMonthChange(utils.addMonths(month, 1), 'left');
  const selectPreviousMonth = () => onMonthChange(utils.addMonths(month, -1), 'right');

  const isNextMonthDisabled = useNextMonthDisabled(month, {
    disableFuture,
    maxDate,
    timezone,
  });
  const isPreviousMonthDisabled = usePreviousMonthDisabled(month, {
    disablePast,
    minDate,
    timezone,
  });

  const handleToggleView = () => {
    if (views.length === 1 || !onViewChange || disabled) {
      return;
    }

    if (views.length === 2) {
      onViewChange(views.find((el) => el !== view) || views[0]);
    } else {
      // switching only between first 2
      const nextIndexToOpen = views.indexOf(view) !== 0 ? 0 : 1;
      onViewChange(views[nextIndexToOpen]);
    }
  };

  // No need to display more information
  if (views.length === 1 && views[0] === 'year') {
    return null;
  }

  return (
    <PickersCalendarHeaderRoot
      {...other}
      ownerState={ownerState}
      className={clsx(className, classes.root)}
      ref={ref}
    >
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
      <Fade in={view === 'day'}>
        <PickersArrowSwitcher
          slots={slots}
          slotProps={slotProps}
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
}) as PickersCalendarHeaderComponent;

PickersCalendarHeader.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * className applied to the root element.
   */
  className: PropTypes.string,
  currentMonth: PropTypes.any.isRequired,
  disabled: PropTypes.bool,
  disableFuture: PropTypes.bool,
  disablePast: PropTypes.bool,
  labelId: PropTypes.string,
  maxDate: PropTypes.any.isRequired,
  minDate: PropTypes.any.isRequired,
  onMonthChange: PropTypes.func.isRequired,
  onViewChange: PropTypes.func,
  reduceAnimations: PropTypes.bool.isRequired,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  timezone: PropTypes.string.isRequired,
  view: PropTypes.oneOf(['day', 'month', 'year']).isRequired,
  views: PropTypes.arrayOf(PropTypes.oneOf(['day', 'month', 'year']).isRequired).isRequired,
} as any;

export { PickersCalendarHeader };
