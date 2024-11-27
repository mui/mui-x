'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { MakeOptional } from '@mui/x-internals/types';
import { MuiPickersAdapter, PickerValidDate } from '@mui/x-date-pickers/models';
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
} from '@mui/x-date-pickers/internals';
import { usePickerTranslations } from '@mui/x-date-pickers/hooks';
import { UseRangePositionResponse } from '../internals/hooks/useRangePosition';
import {
  TimeRangePickerToolbarClasses,
  getTimeRangePickerToolbarUtilityClass,
} from './timeRangePickerToolbarClasses';

const useUtilityClasses = (ownerState: TimeRangePickerToolbarProps) => {
  const { classes, toolbarVariant } = ownerState;
  const slots = {
    root: ['root'],
    container: ['container', toolbarVariant],
    separator: ['separator'],
    timeContainer: ['timeContainer'],
  };

  return composeClasses(slots, getTimeRangePickerToolbarUtilityClass, classes);
};

export interface TimeRangePickerToolbarProps
  extends Omit<BaseToolbarProps<PickerRangeValue, TimeViewWithMeridiem>, 'toolbarFormat'>,
    Pick<UseRangePositionResponse, 'rangePosition' | 'onRangePositionChange'>,
    ExportedTimeRangePickerToolbarProps {
  ampm: boolean;
  toolbarVariant?: PickerVariant;
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
})<{ ownerState: TimeRangePickerToolbarProps }>(({ theme }) => ({
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
  padding: '12px 0px 8px 0px',
  [`& .${pickersToolbarClasses.content} .${pickersToolbarTextClasses.selected}`]: {
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
  shouldForwardProp: (prop) => prop !== 'toolbarVariant',
  overridesResolver: (_, styles) => styles.container,
})<{ toolbarVariant: PickerVariant }>({
  display: 'flex',
  flex: 1,
  variants: [
    {
      props: { toolbarVariant: 'mobile' },
      style: {
        flexDirection: 'column',
        rowGap: 8,
      },
    },
    {
      props: { toolbarVariant: 'desktop' },
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

type TimeRangePickerToolbarTimeElementProps = MakeOptional<
  Pick<
    TimeRangePickerToolbarProps,
    'ampm' | 'views' | 'onViewChange' | 'view' | 'toolbarPlaceholder' | 'toolbarVariant'
  >,
  'view'
> & {
  value: PickerValidDate | null;
  utils: MuiPickersAdapter<any>;
  separatorClasses: string;
};

function TimeRangePickerToolbarTimeElement(props: TimeRangePickerToolbarTimeElementProps) {
  const {
    value,
    ampm,
    views,
    onViewChange,
    view,
    utils,
    separatorClasses,
    toolbarPlaceholder,
    toolbarVariant,
  } = props;

  const formatHours = (time: PickerValidDate) =>
    ampm ? utils.format(time, 'hours12h') : utils.format(time, 'hours24h');
  const meridiemMode = getMeridiem(value, utils);
  const sectionWidth = toolbarVariant === 'desktop' ? MULTI_SECTION_CLOCK_SECTION_WIDTH : '100%';

  return (
    <TimeRangePickerToolbarTimeContainer>
      {views.includes('hours') && (
        <React.Fragment>
          <PickersToolbarButton
            variant="h5"
            width={sectionWidth}
            onClick={() => onViewChange('hours')}
            selected={view === 'hours'}
            value={value ? formatHours(value) : toolbarPlaceholder}
          />
          <TimeRangePickerToolbarSeparator variant="h5" value=":" className={separatorClasses} />
          <PickersToolbarButton
            variant="h5"
            width={sectionWidth}
            onClick={() => onViewChange('minutes')}
            selected={view === 'minutes' || (!views.includes('minutes') && view === 'hours')}
            value={value ? utils.format(value, 'minutes') : toolbarPlaceholder}
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
  /**
   * Callback called when a toolbar is clicked
   * @template TView
   * @param {TView} view The view to open
   */
  onViewChange: PropTypes.func.isRequired,
  separatorClasses: PropTypes.string.isRequired,
  /**
   * Toolbar value placeholder—it is displayed when the value is empty.
   * @default "––"
   */
  toolbarPlaceholder: PropTypes.node,
  toolbarVariant: PropTypes.oneOf(['desktop', 'mobile']),
  utils: PropTypes.object.isRequired,
  value: PropTypes.object,
  /**
   * Currently visible picker view.
   */
  view: PropTypes.oneOf(['hours', 'meridiem', 'minutes', 'seconds']),
  /**
   * Available views.
   */
  views: PropTypes.arrayOf(PropTypes.oneOf(['hours', 'meridiem', 'minutes', 'seconds']).isRequired)
    .isRequired,
} as any;

const TimeRangePickerToolbar = React.forwardRef(function TimeRangePickerToolbar(
  inProps: TimeRangePickerToolbarProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const utils = useUtils();
  const props = useThemeProps({ props: inProps, name: 'MuiTimeRangePickerToolbar' });

  const {
    value: [start, end],
    rangePosition,
    onRangePositionChange,
    className,
    ampm,
    views,
    toolbarVariant = 'mobile',
    toolbarPlaceholder = '--',
    onViewChange,
    view,
    ...other
  } = props;

  const translations = usePickerTranslations();

  const ownerState = props;
  const classes = useUtilityClasses(ownerState);

  const handleStartRangeViewChange = React.useCallback(
    (newView: TimeViewWithMeridiem) => {
      if (rangePosition !== 'start') {
        onRangePositionChange('start');
      }
      onViewChange(newView);
    },
    [onRangePositionChange, onViewChange, rangePosition],
  );

  const handleEndRangeViewChange = React.useCallback(
    (newView: TimeViewWithMeridiem) => {
      if (rangePosition !== 'end') {
        onRangePositionChange('end');
      }
      onViewChange(newView);
    },
    [onRangePositionChange, onViewChange, rangePosition],
  );

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
        toolbarVariant={toolbarVariant}
      >
        <TimeRangePickerToolbarTimeElement
          view={rangePosition === 'start' ? view : undefined}
          views={views}
          value={start}
          onViewChange={handleStartRangeViewChange}
          ampm={ampm}
          utils={utils}
          separatorClasses={classes.separator}
          toolbarPlaceholder={toolbarPlaceholder}
          toolbarVariant={toolbarVariant}
        />
        <TimeRangePickerToolbarTimeElement
          view={rangePosition === 'end' ? view : undefined}
          views={views}
          value={end}
          onViewChange={handleEndRangeViewChange}
          ampm={ampm}
          utils={utils}
          separatorClasses={classes.separator}
          toolbarPlaceholder={toolbarPlaceholder}
          toolbarVariant={toolbarVariant}
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
  isLandscape: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onRangePositionChange: PropTypes.func.isRequired,
  /**
   * Callback called when a toolbar is clicked
   * @template TView
   * @param {TView} view The view to open
   */
  onViewChange: PropTypes.func.isRequired,
  rangePosition: PropTypes.oneOf(['end', 'start']).isRequired,
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
  toolbarVariant: PropTypes.oneOf(['desktop', 'mobile']),
  value: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * Currently visible picker view.
   */
  view: PropTypes.oneOf(['hours', 'meridiem', 'minutes', 'seconds']).isRequired,
  /**
   * Available views.
   */
  views: PropTypes.arrayOf(PropTypes.oneOf(['hours', 'meridiem', 'minutes', 'seconds']).isRequired)
    .isRequired,
} as any;

export { TimeRangePickerToolbar };
