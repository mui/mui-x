'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Fade from '@mui/material/Fade';
import { styled, useThemeProps } from '@mui/material/styles';
import useSlotProps from '@mui/utils/useSlotProps';
import composeClasses from '@mui/utils/composeClasses';
import IconButton from '@mui/material/IconButton';
import { usePickerTranslations } from '../hooks/usePickerTranslations';
import { useUtils } from '../internals/hooks/useUtils';
import { PickersFadeTransitionGroup } from '../DateCalendar/PickersFadeTransitionGroup';
import { ArrowDropDownIcon } from '../icons';
import { PickersArrowSwitcher } from '../internals/components/PickersArrowSwitcher';
import {
  usePreviousMonthDisabled,
  useNextMonthDisabled,
} from '../internals/hooks/date-helpers-hooks';
import {
  getPickersCalendarHeaderUtilityClass,
  PickersCalendarHeaderClasses,
  pickersCalendarHeaderClasses,
} from './pickersCalendarHeaderClasses';
import { PickersCalendarHeaderProps } from './PickersCalendarHeader.types';
import { PickerOwnerState } from '../models/pickers';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';

const useUtilityClasses = (classes: Partial<PickersCalendarHeaderClasses> | undefined) => {
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
  ownerState: PickerOwnerState;
}>({
  display: 'flex',
  alignItems: 'center',
  marginTop: 12,
  marginBottom: 4,
  paddingLeft: 24,
  paddingRight: 12,
  // prevent jumping in safari
  maxHeight: 40,
  minHeight: 40,
});

const PickersCalendarHeaderLabelContainer = styled('div', {
  name: 'MuiPickersCalendarHeader',
  slot: 'LabelContainer',
  overridesResolver: (_, styles) => styles.labelContainer,
})<{
  ownerState: PickerOwnerState;
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
  ownerState: PickerOwnerState;
}>({
  marginRight: 6,
});

const PickersCalendarHeaderSwitchViewButton = styled(IconButton, {
  name: 'MuiPickersCalendarHeader',
  slot: 'SwitchViewButton',
  overridesResolver: (_, styles) => styles.switchViewButton,
})<{
  ownerState: PickerOwnerState;
}>({
  marginRight: 'auto',
  variants: [
    {
      props: { view: 'year' },
      style: {
        [`.${pickersCalendarHeaderClasses.switchViewIcon}`]: {
          transform: 'rotate(180deg)',
        },
      },
    },
  ],
});

const PickersCalendarHeaderSwitchViewIcon = styled(ArrowDropDownIcon, {
  name: 'MuiPickersCalendarHeader',
  slot: 'SwitchViewIcon',
  overridesResolver: (_, styles) => styles.switchViewIcon,
})<{
  ownerState: PickerOwnerState;
}>(({ theme }) => ({
  willChange: 'transform',
  transition: theme.transitions.create('transform'),
  transform: 'rotate(0deg)',
}));

type PickersCalendarHeaderComponent = ((
  props: PickersCalendarHeaderProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

/**
 * Demos:
 *
 * - [DateCalendar](https://mui.com/x/react-date-pickers/date-calendar/)
 * - [DateRangeCalendar](https://mui.com/x/react-date-pickers/date-range-calendar/)
 * - [Custom slots and subcomponents](https://mui.com/x/react-date-pickers/custom-components/)
 *
 * API:
 *
 * - [PickersCalendarHeader API](https://mui.com/x/api/date-pickers/pickers-calendar-header/)
 */
const PickersCalendarHeader = React.forwardRef(function PickersCalendarHeader(
  inProps: PickersCalendarHeaderProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const translations = usePickerTranslations();
  const utils = useUtils();

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
    classes: classesProp,
    timezone,
    format = `${utils.formats.month} ${utils.formats.year}`,
    ...other
  } = props;

  const { ownerState } = usePickerPrivateContext();
  const classes = useUtilityClasses(classesProp);

  const SwitchViewButton = slots?.switchViewButton ?? PickersCalendarHeaderSwitchViewButton;
  const switchViewButtonProps = useSlotProps({
    elementType: SwitchViewButton,
    externalSlotProps: slotProps?.switchViewButton,
    additionalProps: {
      size: 'small',
      'aria-label': translations.calendarViewSwitchingButtonAriaLabel(view),
    },
    ownerState,
    className: classes.switchViewButton,
  });

  const SwitchViewIcon = slots?.switchViewIcon ?? PickersCalendarHeaderSwitchViewIcon;
  // The spread is here to avoid this bug mui/material-ui#34056
  const { ownerState: switchViewIconOwnerState, ...switchViewIconProps } = useSlotProps({
    elementType: SwitchViewIcon,
    externalSlotProps: slotProps?.switchViewIcon,
    ownerState,
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

  const label = utils.formatByString(month, format);

  return (
    <PickersCalendarHeaderRoot
      {...other}
      ownerState={ownerState}
      className={clsx(classes.root, className)}
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
        <PickersFadeTransitionGroup reduceAnimations={reduceAnimations} transKey={label}>
          <PickersCalendarHeaderLabel
            id={labelId}
            data-testid="calendar-month-and-year-text"
            ownerState={ownerState}
            className={classes.label}
          >
            {label}
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
          previousLabel={translations.previousMonth}
          onGoToNext={selectNextMonth}
          isNextDisabled={isNextMonthDisabled}
          nextLabel={translations.nextMonth}
        />
      </Fade>
    </PickersCalendarHeaderRoot>
  );
}) as PickersCalendarHeaderComponent;

PickersCalendarHeader.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  currentMonth: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  disableFuture: PropTypes.bool,
  disablePast: PropTypes.bool,
  /**
   * Format used to display the date.
   * @default `${adapter.formats.month} ${adapter.formats.year}`
   */
  format: PropTypes.string,
  /**
   * Id of the calendar text element.
   * It is used to establish an `aria-labelledby` relationship with the calendar `grid` element.
   */
  labelId: PropTypes.string,
  maxDate: PropTypes.object.isRequired,
  minDate: PropTypes.object.isRequired,
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
