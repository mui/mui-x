'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useRtl } from '@mui/system/RtlProvider';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import clsx from 'clsx';
import { MakeOptional } from '@mui/x-internals/types';
import { PickersToolbarText } from '../internals/components/PickersToolbarText';
import { PickersToolbar } from '../internals/components/PickersToolbar';
import { PickersToolbarButton } from '../internals/components/PickersToolbarButton';
import { usePickerTranslations } from '../hooks/usePickerTranslations';
import { useUtils } from '../internals/hooks/useUtils';
import { BaseToolbarProps, ExportedBaseToolbarProps } from '../internals/models/props/toolbar';
import {
  dateTimePickerToolbarClasses,
  DateTimePickerToolbarClasses,
  getDateTimePickerToolbarUtilityClass,
} from './dateTimePickerToolbarClasses';
import { DateOrTimeViewWithMeridiem, PickerVariant } from '../internals/models';
import { useMeridiemMode } from '../internals/hooks/date-helpers-hooks';
import { MULTI_SECTION_CLOCK_SECTION_WIDTH } from '../internals/constants/dimensions';
import { formatMeridiem } from '../internals/utils/date-utils';
import { pickersToolbarTextClasses } from '../internals/components/pickersToolbarTextClasses';
import { pickersToolbarClasses } from '../internals/components/pickersToolbarClasses';
import { PickerValidDate } from '../models';

export interface ExportedDateTimePickerToolbarProps extends ExportedBaseToolbarProps {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DateTimePickerToolbarClasses>;
}

export interface DateTimePickerToolbarProps
  extends ExportedDateTimePickerToolbarProps,
    MakeOptional<BaseToolbarProps<PickerValidDate | null, DateOrTimeViewWithMeridiem>, 'view'> {
  toolbarVariant?: PickerVariant;
  /**
   * If provided, it will be used instead of `dateTimePickerToolbarTitle` from localization.
   */
  toolbarTitle?: React.ReactNode;
  ampm?: boolean;
  ampmInClock?: boolean;
}

interface DateTimePickerToolbarOwnerState extends DateTimePickerToolbarProps {
  isRtl: boolean;
}

const useUtilityClasses = (ownerState: DateTimePickerToolbarOwnerState) => {
  const { classes, isLandscape, isRtl } = ownerState;

  const slots = {
    root: ['root'],
    dateContainer: ['dateContainer'],
    timeContainer: ['timeContainer', isRtl && 'timeLabelReverse'],
    timeDigitsContainer: ['timeDigitsContainer', isRtl && 'timeLabelReverse'],
    separator: ['separator'],
    ampmSelection: ['ampmSelection', isLandscape && 'ampmLandscape'],
    ampmLabel: ['ampmLabel'],
  };

  return composeClasses(slots, getDateTimePickerToolbarUtilityClass, classes);
};

const DateTimePickerToolbarRoot = styled(PickersToolbar, {
  name: 'MuiDateTimePickerToolbar',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: DateTimePickerToolbarOwnerState }>(({ theme }) => ({
  paddingLeft: 16,
  paddingRight: 16,
  justifyContent: 'space-around',
  position: 'relative',
  variants: [
    {
      props: { toolbarVariant: 'desktop' },
      style: {
        borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
        [`& .${pickersToolbarClasses.content} .${pickersToolbarTextClasses.selected}`]: {
          color: (theme.vars || theme).palette.primary.main,
          fontWeight: theme.typography.fontWeightBold,
        },
      },
    },
    {
      props: { toolbarVariant: 'desktop', isLandscape: true },
      style: {
        borderRight: `1px solid ${(theme.vars || theme).palette.divider}`,
      },
    },
    {
      props: { toolbarVariant: 'desktop', isLandscape: false },
      style: {
        paddingLeft: 24,
        paddingRight: 0,
      },
    },
  ],
}));

const DateTimePickerToolbarDateContainer = styled('div', {
  name: 'MuiDateTimePickerToolbar',
  slot: 'DateContainer',
  overridesResolver: (props, styles) => styles.dateContainer,
})<{ ownerState: DateTimePickerToolbarOwnerState }>({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
});

const DateTimePickerToolbarTimeContainer = styled('div', {
  name: 'MuiDateTimePickerToolbar',
  slot: 'TimeContainer',
  overridesResolver: (props, styles) => styles.timeContainer,
})<{ ownerState: DateTimePickerToolbarOwnerState }>({
  display: 'flex',
  flexDirection: 'row',
  variants: [
    {
      props: { isRtl: true },
      style: {
        flexDirection: 'row-reverse',
      },
    },
    {
      props: { toolbarVariant: 'desktop', isLandscape: false },
      style: {
        gap: 9,
        marginRight: 4,
        alignSelf: 'flex-end',
      },
    },
    {
      props: ({ isLandscape, toolbarVariant }: DateTimePickerToolbarOwnerState) =>
        isLandscape && toolbarVariant !== 'desktop',
      style: {
        flexDirection: 'column',
      },
    },
    {
      props: ({ isLandscape, toolbarVariant, isRtl }: DateTimePickerToolbarOwnerState) =>
        isLandscape && toolbarVariant !== 'desktop' && isRtl,
      style: {
        flexDirection: 'column-reverse',
      },
    },
  ],
});

const DateTimePickerToolbarTimeDigitsContainer = styled('div', {
  name: 'MuiDateTimePickerToolbar',
  slot: 'TimeDigitsContainer',
  overridesResolver: (props, styles) => styles.timeDigitsContainer,
})<{ ownerState: DateTimePickerToolbarOwnerState }>({
  display: 'flex',
  variants: [
    {
      props: { isRtl: true },
      style: {
        flexDirection: 'row-reverse',
      },
    },
    {
      props: { toolbarVariant: 'desktop' },
      style: { gap: 1.5 },
    },
  ],
});

const DateTimePickerToolbarSeparator = styled(PickersToolbarText, {
  name: 'MuiDateTimePickerToolbar',
  slot: 'Separator',
  overridesResolver: (props, styles) => styles.separator,
})<{
  ownerState: DateTimePickerToolbarOwnerState;
}>({
  margin: '0 4px 0 2px',
  cursor: 'default',
  variants: [
    {
      props: { toolbarVariant: 'desktop' },
      style: {
        margin: 0,
      },
    },
  ],
});

// Taken from TimePickerToolbar
const DateTimePickerToolbarAmPmSelection = styled('div', {
  name: 'MuiDateTimePickerToolbar',
  slot: 'AmPmSelection',
  overridesResolver: (props, styles) => [
    { [`.${dateTimePickerToolbarClasses.ampmLabel}`]: styles.ampmLabel },
    { [`&.${dateTimePickerToolbarClasses.ampmLandscape}`]: styles.ampmLandscape },
    styles.ampmSelection,
  ],
})<{
  ownerState: DateTimePickerToolbarProps;
}>({
  display: 'flex',
  flexDirection: 'column',
  marginRight: 'auto',
  marginLeft: 12,
  [`& .${dateTimePickerToolbarClasses.ampmLabel}`]: {
    fontSize: 17,
  },
  variants: [
    {
      props: { isLandscape: true },
      style: {
        margin: '4px 0 auto',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
      },
    },
  ],
});

/**
 * Demos:
 *
 * - [DateTimePicker](https://mui.com/x/react-date-pickers/date-time-picker/)
 * - [Custom components](https://mui.com/x/react-date-pickers/custom-components/)
 *
 * API:
 *
 * - [DateTimePickerToolbar API](https://mui.com/x/api/date-pickers/date-time-picker-toolbar/)
 */
function DateTimePickerToolbar(inProps: DateTimePickerToolbarProps) {
  const props = useThemeProps({ props: inProps, name: 'MuiDateTimePickerToolbar' });
  const {
    ampm,
    ampmInClock,
    value,
    onChange,
    view,
    isLandscape,
    onViewChange,
    toolbarFormat,
    toolbarPlaceholder = '––',
    views,
    disabled,
    readOnly,
    toolbarVariant = 'mobile',
    toolbarTitle: inToolbarTitle,
    className,
    ...other
  } = props;

  const isRtl = useRtl();
  const ownerState: DateTimePickerToolbarOwnerState = { ...props, isRtl };
  const utils = useUtils();
  const { meridiemMode, handleMeridiemChange } = useMeridiemMode(value, ampm, onChange);

  const showAmPmControl = Boolean(ampm && !ampmInClock);
  const isDesktop = toolbarVariant === 'desktop';

  const translations = usePickerTranslations();
  const classes = useUtilityClasses(ownerState);
  const toolbarTitle = inToolbarTitle ?? translations.dateTimePickerToolbarTitle;

  const formatHours = (time: PickerValidDate) =>
    ampm ? utils.format(time, 'hours12h') : utils.format(time, 'hours24h');

  const dateText = React.useMemo(() => {
    if (!value) {
      return toolbarPlaceholder;
    }

    if (toolbarFormat) {
      return utils.formatByString(value, toolbarFormat);
    }

    return utils.format(value, 'shortDate');
  }, [value, toolbarFormat, toolbarPlaceholder, utils]);

  return (
    <DateTimePickerToolbarRoot
      isLandscape={isLandscape}
      className={clsx(classes.root, className)}
      toolbarTitle={toolbarTitle}
      {...other}
      ownerState={ownerState}
    >
      <DateTimePickerToolbarDateContainer className={classes.dateContainer} ownerState={ownerState}>
        {views.includes('year') && (
          <PickersToolbarButton
            tabIndex={-1}
            variant="subtitle1"
            data-testid="datetimepicker-toolbar-year"
            onClick={() => onViewChange('year')}
            selected={view === 'year'}
            value={value ? utils.format(value, 'year') : '–'}
          />
        )}

        {views.includes('day') && (
          <PickersToolbarButton
            tabIndex={-1}
            variant={isDesktop ? 'h5' : 'h4'}
            data-testid="datetimepicker-toolbar-day"
            onClick={() => onViewChange('day')}
            selected={view === 'day'}
            value={dateText}
          />
        )}
      </DateTimePickerToolbarDateContainer>
      <DateTimePickerToolbarTimeContainer className={classes.timeContainer} ownerState={ownerState}>
        <DateTimePickerToolbarTimeDigitsContainer
          className={classes.timeDigitsContainer}
          ownerState={ownerState}
        >
          {views.includes('hours') && (
            <React.Fragment>
              <PickersToolbarButton
                variant={isDesktop ? 'h5' : 'h3'}
                width={isDesktop && !isLandscape ? MULTI_SECTION_CLOCK_SECTION_WIDTH : undefined}
                data-testid="hours"
                onClick={() => onViewChange('hours')}
                selected={view === 'hours'}
                value={value ? formatHours(value) : '--'}
              />
              <DateTimePickerToolbarSeparator
                variant={isDesktop ? 'h5' : 'h3'}
                value=":"
                className={classes.separator}
                ownerState={ownerState}
              />
              <PickersToolbarButton
                variant={isDesktop ? 'h5' : 'h3'}
                width={isDesktop && !isLandscape ? MULTI_SECTION_CLOCK_SECTION_WIDTH : undefined}
                data-testid="minutes"
                onClick={() => onViewChange('minutes')}
                selected={view === 'minutes' || (!views.includes('minutes') && view === 'hours')}
                value={value ? utils.format(value, 'minutes') : '--'}
                disabled={!views.includes('minutes')}
              />
            </React.Fragment>
          )}

          {views.includes('seconds') && (
            <React.Fragment>
              <DateTimePickerToolbarSeparator
                variant={isDesktop ? 'h5' : 'h3'}
                value=":"
                className={classes.separator}
                ownerState={ownerState}
              />
              <PickersToolbarButton
                variant={isDesktop ? 'h5' : 'h3'}
                width={isDesktop && !isLandscape ? MULTI_SECTION_CLOCK_SECTION_WIDTH : undefined}
                data-testid="seconds"
                onClick={() => onViewChange('seconds')}
                selected={view === 'seconds'}
                value={value ? utils.format(value, 'seconds') : '--'}
              />
            </React.Fragment>
          )}
        </DateTimePickerToolbarTimeDigitsContainer>
        {showAmPmControl && !isDesktop && (
          <DateTimePickerToolbarAmPmSelection
            className={classes.ampmSelection}
            ownerState={ownerState}
          >
            <PickersToolbarButton
              variant="subtitle2"
              selected={meridiemMode === 'am'}
              typographyClassName={classes.ampmLabel}
              value={formatMeridiem(utils, 'am')}
              onClick={readOnly ? undefined : () => handleMeridiemChange('am')}
              disabled={disabled}
            />
            <PickersToolbarButton
              variant="subtitle2"
              selected={meridiemMode === 'pm'}
              typographyClassName={classes.ampmLabel}
              value={formatMeridiem(utils, 'pm')}
              onClick={readOnly ? undefined : () => handleMeridiemChange('pm')}
              disabled={disabled}
            />
          </DateTimePickerToolbarAmPmSelection>
        )}

        {ampm && isDesktop && (
          <PickersToolbarButton
            variant="h5"
            data-testid="am-pm-view-button"
            onClick={() => onViewChange('meridiem')}
            selected={view === 'meridiem'}
            value={value && meridiemMode ? formatMeridiem(utils, meridiemMode) : '--'}
            width={MULTI_SECTION_CLOCK_SECTION_WIDTH}
          />
        )}
      </DateTimePickerToolbarTimeContainer>
    </DateTimePickerToolbarRoot>
  );
}

DateTimePickerToolbar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  ampm: PropTypes.bool,
  ampmInClock: PropTypes.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * If `true`, the component is disabled.
   * When disabled, the value cannot be changed and no interaction is possible.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, show the toolbar even in desktop mode.
   * @default `true` for Desktop, `false` for Mobile.
   */
  hidden: PropTypes.bool,
  isLandscape: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  /**
   * Callback called when a toolbar is clicked
   * @template TView
   * @param {TView} view The view to open
   */
  onViewChange: PropTypes.func.isRequired,
  /**
   * If `true`, the component is read-only.
   * When read-only, the value cannot be changed but the user can interact with the interface.
   * @default false
   */
  readOnly: PropTypes.bool,
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
   * Toolbar date format.
   */
  toolbarFormat: PropTypes.string,
  /**
   * Toolbar value placeholder—it is displayed when the value is empty.
   * @default "––"
   */
  toolbarPlaceholder: PropTypes.node,
  /**
   * If provided, it will be used instead of `dateTimePickerToolbarTitle` from localization.
   */
  toolbarTitle: PropTypes.node,
  toolbarVariant: PropTypes.oneOf(['desktop', 'mobile']),
  value: PropTypes.object,
  /**
   * Currently visible picker view.
   */
  view: PropTypes.oneOf(['day', 'hours', 'meridiem', 'minutes', 'month', 'seconds', 'year']),
  /**
   * Available views.
   */
  views: PropTypes.arrayOf(
    PropTypes.oneOf(['day', 'hours', 'meridiem', 'minutes', 'month', 'seconds', 'year']).isRequired,
  ).isRequired,
} as any;

export { DateTimePickerToolbar };
