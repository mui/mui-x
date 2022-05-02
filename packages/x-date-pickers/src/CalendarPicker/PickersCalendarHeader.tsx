import * as React from 'react';
import Fade from '@mui/material/Fade';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { SlideDirection } from './PickersSlideTransition';
import { useUtils } from '../internals/hooks/useUtils';
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

export type ExportedCalendarHeaderProps<TDate> = Pick<
  PickersCalendarHeaderProps<TDate>,
  'getViewSwitchingButtonText' | 'leftArrowButtonText' | 'rightArrowButtonText'
>;

export interface PickersCalendarHeaderSlotsComponent extends PickersArrowSwitcherSlotsComponent {
  SwitchViewButton: React.ElementType;
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
   * The components used for each slot.
   * Either a string to use an HTML element or a component.
   * @default {}
   */
  components?: Partial<PickersCalendarHeaderSlotsComponent>;
  /**
   * The props used for each slot inside.
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
   */
  getViewSwitchingButtonText?: (currentView: CalendarPickerView) => string;
  onMonthChange: (date: TDate, slideDirection: SlideDirection) => void;
  openView: CalendarPickerView;
  reduceAnimations: boolean;
  onViewChange?: (view: CalendarPickerView) => void;
}

const PickersCalendarHeaderRoot = styled('div')<{
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

const PickersCalendarHeaderLabel = styled('div')<{
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

const PickersCalendarHeaderLabelItem = styled('div')<{
  ownerState: PickersCalendarHeaderProps<any>;
}>({
  marginRight: 6,
});

const PickersCalendarHeaderSwitchViewButton = styled(IconButton)({
  marginRight: 'auto',
});

const PickersCalendarHeaderSwitchView = styled(ArrowDropDown)<{
  ownerState: PickersCalendarHeaderProps<any>;
}>(({ theme, ownerState }) => ({
  willChange: 'transform',
  transition: theme.transitions.create('transform'),
  transform: 'rotate(0deg)',
  ...(ownerState.openView === 'year' && {
    transform: 'rotate(180deg)',
  }),
}));

function getSwitchingViewAriaText(view: CalendarPickerView) {
  return view === 'year'
    ? 'year view is open, switch to calendar view'
    : 'calendar view is open, switch to year view';
}

/**
 * @ignore - do not document.
 */
export function PickersCalendarHeader<TDate>(props: PickersCalendarHeaderProps<TDate>) {
  const {
    components = {},
    componentsProps = {},
    currentMonth: month,
    disabled,
    disableFuture,
    disablePast,
    getViewSwitchingButtonText = getSwitchingViewAriaText,
    leftArrowButtonText = 'Previous month',
    maxDate,
    minDate,
    onMonthChange,
    onViewChange,
    openView: currentView,
    reduceAnimations,
    rightArrowButtonText = 'Next month',
    views,
  } = props;

  const utils = useUtils<TDate>();

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
    <PickersCalendarHeaderRoot ownerState={ownerState}>
      <PickersCalendarHeaderLabel
        role="presentation"
        onClick={handleToggleView}
        ownerState={ownerState}
      >
        <PickersFadeTransitionGroup
          reduceAnimations={reduceAnimations}
          transKey={utils.format(month, 'monthAndYear')}
        >
          <PickersCalendarHeaderLabelItem
            aria-live="polite"
            data-mui-test="calendar-month-and-year-text"
            ownerState={ownerState}
          >
            {utils.format(month, 'monthAndYear')}
          </PickersCalendarHeaderLabelItem>
        </PickersFadeTransitionGroup>
        {views.length > 1 && !disabled && (
          <PickersCalendarHeaderSwitchViewButton
            size="small"
            as={components.SwitchViewButton}
            aria-label={getViewSwitchingButtonText(currentView)}
            {...switchViewButtonProps}
          >
            <PickersCalendarHeaderSwitchView
              as={components.SwitchViewIcon}
              ownerState={ownerState}
            />
          </PickersCalendarHeaderSwitchViewButton>
        )}
      </PickersCalendarHeaderLabel>
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
