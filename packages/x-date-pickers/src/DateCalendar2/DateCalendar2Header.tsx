import * as React from 'react';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import { styled, useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Fade from '@mui/material/Fade';
import { useRtl } from '@mui/system/RtlProvider';
import useSlotProps from '@mui/utils/useSlotProps';
import { Calendar, useCalendarContext } from '../internals/base/Calendar';
import { usePickerTranslations } from '../hooks';
import { ArrowDropDownIcon, ArrowLeftIcon, ArrowRightIcon } from '../icons';
import { useUtils } from '../internals/hooks/useUtils';
import { useDateCalendar2Context } from './DateCalendar2Context';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';

const DateCalendar2HeaderRoot = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'HeaderRoot',
  overridesResolver: (props, styles) => styles.headerRoot,
})({
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

const DateCalendar2HeaderLabelContainer = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'HeaderLabelContainer',
  overridesResolver: (props, styles) => styles.headerLabelContainer,
})(({ theme }) => ({
  display: 'flex',
  overflow: 'hidden',
  alignItems: 'center',
  cursor: 'pointer',
  marginRight: 'auto',
  ...theme.typography.body1,
  fontWeight: theme.typography.fontWeightMedium,
}));

const DateCalendar2HeaderLabelTransitionGroup = styled(TransitionGroup, {
  name: 'MuiDateCalendar2',
  slot: 'HeaderLabelTransitionGroup',
  overridesResolver: (props, styles) => styles.headerLabelTransitionGroup,
})({
  display: 'block',
  position: 'relative',
});

const DateCalendar2HeaderLabelContent = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'HeaderLabelContent',
  overridesResolver: (props, styles) => styles.headerLabelContent,
})({
  marginRight: 6,
});

const DateCalendar2HeaderSwitchViewButton = styled(IconButton, {
  name: 'MuiDateCalendar2',
  slot: 'HeaderSwitchViewButton',
  overridesResolver: (props, styles) => styles.headerSwitchViewButton,
})({
  marginRight: 'auto',
});

const DateCalendar2HeaderSwitchViewIcon = styled(ArrowDropDownIcon, {
  name: 'MuiDateCalendar2',
  slot: 'HeaderSwitchViewIcon',
  overridesResolver: (props, styles) => styles.headerSwitchViewIcon,
})(({ theme }) => ({
  willChange: 'transform',
  transition: theme.transitions.create('transform'),
  transform: 'rotate(0deg)',
  '&[data-view="year"]': {
    transform: 'rotate(180deg)',
  },
}));

const DateCalendar2HeaderNavigation = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'HeaderNavigation',
  overridesResolver: (props, styles) => styles.headerNavigation,
})({
  display: 'flex',
});

const DateCalendar2HeaderNavigationButton = styled(IconButton, {
  name: 'MuiDateCalendar2',
  slot: 'HeaderNavigationButton',
  overridesResolver: (props, styles) => styles.headerNavigationButton,
})({
  '&:disabled': {
    visibility: 'hidden',
  },
});

const DateCalendar2HeaderNavigationSpacer = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'HeaderNavigationSpacer',
  overridesResolver: (props, styles) => styles.headerNavigationSpacer,
})(({ theme }) => ({
  width: theme.spacing(3),
}));

export const DateCalendar2Header = React.forwardRef(function DateCalendar2Header(
  props: DateCalendar2HeaderProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const utils = useUtils();
  const translations = usePickerTranslations();
  const { ownerState } = usePickerPrivateContext();
  const theme = useTheme();
  const isRtl = useRtl();
  const { visibleDate, disabled } = useCalendarContext();
  const { classes, slots, slotProps, view, setView, views, labelId } = useDateCalendar2Context();

  const { format = `${utils.formats.month} ${utils.formats.year}`, ...other } = props;

  const handleToggleView = () => {
    if (view === 'year' && views.month) {
      setView('month');
    } else if (view === 'year' && views.day) {
      setView('day');
    } else if (view === 'month' && views.day) {
      setView('day');
    } else if (view === 'month' && views.year) {
      setView('year');
    } else if (view === 'day' && views.month) {
      setView('month');
    } else if (view === 'day' && views.year) {
      setView('year');
    }
  };

  const label = React.useMemo(
    () => utils.formatByString(visibleDate, format),
    [visibleDate, format, utils],
  );

  const viewCount = Object.values(views).filter(Boolean).length;

  const SwitchViewButton = slots?.switchViewButton ?? DateCalendar2HeaderSwitchViewButton;
  const switchViewButtonProps = useSlotProps({
    elementType: SwitchViewButton,
    externalSlotProps: slotProps?.switchViewButton,
    additionalProps: {
      size: 'small',
      'aria-label': translations.calendarViewSwitchingButtonAriaLabel(view),
    },
    className: classes.headerSwitchViewButton,
    ownerState,
  });

  const SwitchViewIcon = slots?.switchViewIcon ?? DateCalendar2HeaderSwitchViewIcon;
  const switchViewIconProps = useSlotProps({
    elementType: SwitchViewIcon,
    externalSlotProps: slotProps?.switchViewIcon,
    additionalProps: {
      'data-view': view,
    },
    className: classes.headerSwitchViewIcon,
    ownerState,
  });

  const PreviousNavigationButton = slots?.navigationButton ?? DateCalendar2HeaderNavigationButton;
  const previousNavigationButton = useSlotProps({
    elementType: PreviousNavigationButton,
    externalSlotProps: slotProps?.navigationButton,
    additionalProps: {
      size: 'medium',
      title: translations.previousMonth,
      'aria-label': translations.previousMonth,
      edge: 'end',
    },
    className: classes.headerNavigationButton,
    ownerState: { ...ownerState, target: 'previous' },
  });

  const NextNavigationButton = slots?.navigationButton ?? DateCalendar2HeaderNavigationButton;
  const nextNavigationButton = useSlotProps({
    elementType: PreviousNavigationButton,
    externalSlotProps: slotProps?.navigationButton,
    additionalProps: {
      size: 'medium',
      title: translations.nextMonth,
      'aria-label': translations.nextMonth,
      edge: 'start',
    },
    className: classes.headerNavigationButton,
    ownerState: { ...ownerState, target: 'next' },
  });

  const LeftNavigationIcon = slots?.leftNavigationIcon ?? ArrowLeftIcon;
  const leftNavigationIconProps = useSlotProps({
    elementType: LeftNavigationIcon,
    externalSlotProps: slotProps?.leftNavigationIcon,
    additionalProps: {
      fontSize: 'inherit',
    },
    ownerState,
  });

  const RightNavigationIcon = slots?.rightNavigationIcon ?? ArrowRightIcon;
  const rightNavigationIconProps = useSlotProps({
    elementType: RightNavigationIcon,
    externalSlotProps: slotProps?.rightNavigationIcon,
    additionalProps: {
      fontSize: 'inherit',
    },
    ownerState,
  });

  if (!views.day && !views.month && views.year) {
    return null;
  }

  return (
    <DateCalendar2HeaderRoot className={classes.headerRoot} ref={ref} {...other}>
      <DateCalendar2HeaderLabelContainer
        role="presentation"
        onClick={handleToggleView}
        // putting this on the label item element below breaks when using transition
        aria-live="polite"
        className={classes.headerLabelContainer}
      >
        <DateCalendar2HeaderLabelTransitionGroup className={classes.headerLabelTransitionGroup}>
          <Fade
            appear={false}
            mountOnEnter
            unmountOnExit
            key={label}
            timeout={{
              appear: theme.transitions.duration.enteringScreen,
              enter: theme.transitions.duration.enteringScreen,
              exit: 0,
            }}
          >
            <DateCalendar2HeaderLabelContent id={labelId} className={classes.headerLabelContent}>
              {label}
            </DateCalendar2HeaderLabelContent>
          </Fade>
        </DateCalendar2HeaderLabelTransitionGroup>
        {viewCount > 1 && !disabled && (
          <SwitchViewButton {...switchViewButtonProps}>
            <SwitchViewIcon {...switchViewIconProps} />
          </SwitchViewButton>
        )}
      </DateCalendar2HeaderLabelContainer>
      <Fade in={view === 'day'}>
        <DateCalendar2HeaderNavigation className={classes.headerNavigation}>
          <Calendar.SetVisibleMonth
            target="previous"
            render={<PreviousNavigationButton {...previousNavigationButton} />}
          >
            {isRtl ? (
              <RightNavigationIcon {...rightNavigationIconProps} />
            ) : (
              <LeftNavigationIcon {...leftNavigationIconProps} />
            )}
          </Calendar.SetVisibleMonth>
          <DateCalendar2HeaderNavigationSpacer className={classes.headerNavigationSpacer} />
          <Calendar.SetVisibleMonth
            target="next"
            render={<NextNavigationButton {...nextNavigationButton} />}
          >
            {isRtl ? (
              <LeftNavigationIcon {...leftNavigationIconProps} />
            ) : (
              <RightNavigationIcon {...rightNavigationIconProps} />
            )}
          </Calendar.SetVisibleMonth>
        </DateCalendar2HeaderNavigation>
      </Fade>
    </DateCalendar2HeaderRoot>
  );
});

export interface DateCalendar2HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Format used to display the date.
   * @default `${adapter.formats.month} ${adapter.formats.year}`
   */
  format?: string;
}
