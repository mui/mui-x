'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import {
  PickersToolbar,
  PickersToolbarButton,
  useUtils,
  BaseToolbarProps,
  ExportedBaseToolbarProps,
  PickerVariant,
  TimeViewWithMeridiem,
  PickersToolbarText,
  getMeridiem,
  formatMeridiem,
  pickersToolbarClasses,
  pickersToolbarTextClasses,
  PickerRangeValue,
  MULTI_SECTION_CLOCK_SECTION_WIDTH,
  useToolbarOwnerState,
  PickerToolbarOwnerState,
} from '@mui/x-date-pickers/internals';
import { usePickerContext, usePickerTranslations } from '@mui/x-date-pickers/hooks';
import {
  TimeRangePickerToolbarClasses,
  getTimeRangePickerToolbarUtilityClass,
} from './timeRangePickerToolbarClasses';
import { usePickerRangePositionContext } from '../hooks';

const useUtilityClasses = (
  classes: Partial<TimeRangePickerToolbarClasses> | undefined,
  ownerState: PickerToolbarOwnerState,
) => {
  const { pickerVariant } = ownerState;
  const slots = {
    root: ['root'],
    container: ['container', pickerVariant],
    separator: ['separator'],
    timeContainer: ['timeContainer'],
  };

  return composeClasses(slots, getTimeRangePickerToolbarUtilityClass, classes);
};

export interface TimeRangePickerToolbarProps
  extends Omit<BaseToolbarProps, 'toolbarFormat'>,
    ExportedTimeRangePickerToolbarProps {
  ampm: boolean;
}

export interface ExportedTimeRangePickerToolbarProps
  extends Omit<ExportedBaseToolbarProps, 'toolbarFormat'> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<TimeRangePickerToolbarClasses>;
}

const TimeRangePickerToolbarRoot = styled(PickersToolbar, {
  name: 'MuiTimeRangePickerToolbar',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: PickerToolbarOwnerState }>(({ theme }) => ({
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
  padding: '12px 0px 8px 0px',
  [`& .${pickersToolbarClasses.content} .${pickersToolbarTextClasses.root}[data-selected]`]: {
    color: (theme.vars || theme).palette.primary.main,
    fontWeight: theme.typography.fontWeightBold,
  },
  [`& .${pickersToolbarClasses.title}`]: {
    paddingLeft: 12,
  },
}));

const TimeRangePickerToolbarContainer = styled('div', {
  name: 'MuiTimeRangePickerToolbar',
  slot: 'Container',
  shouldForwardProp: (prop) => prop !== 'pickerVariant',
  overridesResolver: (_, styles) => styles.container,
})<{ pickerVariant: PickerVariant }>({
  display: 'flex',
  flex: 1,
  variants: [
    {
      props: { pickerVariant: 'mobile' },
      style: {
        flexDirection: 'column',
        rowGap: 8,
      },
    },
    {
      props: { pickerVariant: 'desktop' },
      style: {
        flexDirection: 'row',
        gap: 1,
      },
    },
  ],
});

const TimeRangePickerToolbarTimeContainer = styled('div', {
  name: 'MuiTimeRangePickerToolbar',
  slot: 'TimeContainer',
  overridesResolver: (_, styles) => styles.timeContainer,
})({
  display: 'flex',
  justifyContent: 'space-around',
  flex: 1,
});

const TimeRangePickerToolbarSeparator = styled(PickersToolbarText, {
  name: 'MuiTimeRangePickerToolbar',
  slot: 'Separator',
  overridesResolver: (props, styles) => styles.separator,
})({
  cursor: 'default',
});

type TimeRangePickerToolbarTimeElementProps = Pick<
  TimeRangePickerToolbarProps,
  'ampm' | 'toolbarPlaceholder'
> & {
  onViewChange: (view: TimeViewWithMeridiem) => void;
  view?: TimeViewWithMeridiem;
  value: PickerValidDate | null;
  separatorClasses: string;
};

/**
 * @ignore - internal component
 */
function TimeRangePickerToolbarTimeElement(props: TimeRangePickerToolbarTimeElementProps) {
  const { value, ampm, onViewChange, view, separatorClasses, toolbarPlaceholder } = props;
  const utils = useUtils();
  const { variant, views } = usePickerContext();

  const formatHours = (time: PickerValidDate) =>
    ampm ? utils.format(time, 'hours12h') : utils.format(time, 'hours24h');
  const meridiemMode = getMeridiem(value, utils);
  const sectionWidth = variant === 'desktop' ? MULTI_SECTION_CLOCK_SECTION_WIDTH : '100%';

  return (
    <TimeRangePickerToolbarTimeContainer>
      {views.includes('hours') && (
        <React.Fragment>
          <PickersToolbarButton
            variant="h5"
            width={sectionWidth}
            onClick={() => onViewChange('hours')}
            selected={view === 'hours'}
            value={utils.isValid(value) ? formatHours(value) : toolbarPlaceholder}
          />
          <TimeRangePickerToolbarSeparator variant="h5" value=":" className={separatorClasses} />
          <PickersToolbarButton
            variant="h5"
            width={sectionWidth}
            onClick={() => onViewChange('minutes')}
            selected={view === 'minutes' || (!views.includes('minutes') && view === 'hours')}
            value={utils.isValid(value) ? utils.format(value, 'minutes') : toolbarPlaceholder}
            disabled={!views.includes('minutes')}
          />
        </React.Fragment>
      )}

      {views.includes('seconds') && (
        <React.Fragment>
          <TimeRangePickerToolbarSeparator variant="h5" value=":" className={separatorClasses} />
          <PickersToolbarButton
            variant="h5"
            width={sectionWidth}
            onClick={() => onViewChange('seconds')}
            selected={view === 'seconds'}
            value={value ? utils.format(value, 'seconds') : toolbarPlaceholder}
          />
        </React.Fragment>
      )}

      {ampm && (
        <PickersToolbarButton
          variant="h5"
          onClick={() => onViewChange('meridiem')}
          selected={view === 'meridiem'}
          value={value && meridiemMode ? formatMeridiem(utils, meridiemMode) : toolbarPlaceholder}
          width={sectionWidth}
        />
      )}
    </TimeRangePickerToolbarTimeContainer>
  );
}

TimeRangePickerToolbarTimeElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  ampm: PropTypes.bool.isRequired,
  onViewChange: PropTypes.func.isRequired,
  separatorClasses: PropTypes.string.isRequired,
  /**
   * Toolbar value placeholder—it is displayed when the value is empty.
   * @default "––"
   */
  toolbarPlaceholder: PropTypes.node,
  value: PropTypes.object,
  view: PropTypes.oneOf(['hours', 'meridiem', 'minutes', 'seconds']),
} as any;

const TimeRangePickerToolbar = React.forwardRef(function TimeRangePickerToolbar(
  inProps: TimeRangePickerToolbarProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiTimeRangePickerToolbar' });

  const { className, ampm, toolbarPlaceholder = '--', classes: classesProp, ...other } = props;

  const { value, view, setView } = usePickerContext<PickerRangeValue, TimeViewWithMeridiem>();
  const translations = usePickerTranslations();
  const ownerState = useToolbarOwnerState();
  const { rangePosition, setRangePosition } = usePickerRangePositionContext();
  const classes = useUtilityClasses(classesProp, ownerState);

  const handleStartRangeViewChange = React.useCallback(
    (newView: TimeViewWithMeridiem) => {
      if (rangePosition !== 'start') {
        setRangePosition('start');
      }
      setView(newView);
    },
    [setRangePosition, setView, rangePosition],
  );

  const handleEndRangeViewChange = React.useCallback(
    (newView: TimeViewWithMeridiem) => {
      if (rangePosition !== 'end') {
        setRangePosition('end');
      }
      setView(newView);
    },
    [setRangePosition, setView, rangePosition],
  );

  if (!view) {
    return null;
  }

  return (
    <TimeRangePickerToolbarRoot
      {...other}
      toolbarTitle={translations.timeRangePickerToolbarTitle}
      className={clsx(className, classes.root)}
      ownerState={ownerState}
      ref={ref}
    >
      <TimeRangePickerToolbarContainer
        className={classes.container}
        pickerVariant={ownerState.pickerVariant}
      >
        <TimeRangePickerToolbarTimeElement
          view={rangePosition === 'start' ? view : undefined}
          value={value[0]}
          onViewChange={handleStartRangeViewChange}
          ampm={ampm}
          separatorClasses={classes.separator}
          toolbarPlaceholder={toolbarPlaceholder}
        />
        <TimeRangePickerToolbarTimeElement
          view={rangePosition === 'end' ? view : undefined}
          value={value[1]}
          onViewChange={handleEndRangeViewChange}
          ampm={ampm}
          separatorClasses={classes.separator}
          toolbarPlaceholder={toolbarPlaceholder}
        />
      </TimeRangePickerToolbarContainer>
    </TimeRangePickerToolbarRoot>
  );
});

TimeRangePickerToolbar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  ampm: PropTypes.bool.isRequired,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * If `true`, show the toolbar even in desktop mode.
   * @default `true` for Desktop, `false` for Mobile.
   */
  hidden: PropTypes.bool,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  titleId: PropTypes.string,
  /**
   * Toolbar value placeholder—it is displayed when the value is empty.
   * @default "––"
   */
  toolbarPlaceholder: PropTypes.node,
} as any;

export { TimeRangePickerToolbar };
