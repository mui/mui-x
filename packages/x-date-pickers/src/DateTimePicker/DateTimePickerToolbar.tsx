'use client';
import * as React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { shouldForwardProp } from '@mui/system/createStyled';
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
import { DateOrTimeViewWithMeridiem, PickerValue, PickerVariant } from '../internals/models';
import { useMeridiemMode } from '../internals/hooks/date-helpers-hooks';
import { MULTI_SECTION_CLOCK_SECTION_WIDTH } from '../internals/constants/dimensions';
import { formatMeridiem } from '../internals/utils/date-utils';
import { pickersToolbarTextClasses } from '../internals/components/pickersToolbarTextClasses';
import { pickersToolbarClasses } from '../internals/components/pickersToolbarClasses';
import { PickerValidDate } from '../models';
import { usePickerContext } from '../hooks/usePickerContext';
import {
  PickerToolbarOwnerState,
  useToolbarOwnerState,
} from '../internals/hooks/useToolbarOwnerState';

export interface ExportedDateTimePickerToolbarProps extends ExportedBaseToolbarProps {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DateTimePickerToolbarClasses>;
}

export interface DateTimePickerToolbarProps
  extends ExportedDateTimePickerToolbarProps,
    BaseToolbarProps<PickerValue> {
  /**
   * If provided, it will be used instead of `dateTimePickerToolbarTitle` from localization.
   */
  toolbarTitle?: React.ReactNode;
  ampm?: boolean;
  ampmInClock?: boolean;
}

const useUtilityClasses = (
  classes: Partial<DateTimePickerToolbarClasses> | undefined,
  ownerState: PickerToolbarOwnerState,
) => {
  const { pickerOrientation, toolbarDirection } = ownerState;

  const slots = {
    root: ['root'],
    dateContainer: ['dateContainer'],
    timeContainer: ['timeContainer', toolbarDirection === 'rtl' && 'timeLabelReverse'],
    timeDigitsContainer: ['timeDigitsContainer', toolbarDirection === 'rtl' && 'timeLabelReverse'],
    separator: ['separator'],
    ampmSelection: ['ampmSelection', pickerOrientation === 'landscape' && 'ampmLandscape'],
    ampmLabel: ['ampmLabel'],
  };

  return composeClasses(slots, getDateTimePickerToolbarUtilityClass, classes);
};

const DateTimePickerToolbarRoot = styled(PickersToolbar, {
  name: 'MuiDateTimePickerToolbar',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'toolbarVariant',
})<{ ownerState: PickerToolbarOwnerState; toolbarVariant: PickerVariant }>(({ theme }) => ({
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
      props: { toolbarVariant: 'desktop', pickerOrientation: 'landscape' },
      style: {
        borderRight: `1px solid ${(theme.vars || theme).palette.divider}`,
      },
    },
    {
      props: { toolbarVariant: 'desktop', pickerOrientation: 'portrait' },
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
})<{ ownerState: PickerToolbarOwnerState }>({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
});

const DateTimePickerToolbarTimeContainer = styled('div', {
  name: 'MuiDateTimePickerToolbar',
  slot: 'TimeContainer',
  overridesResolver: (props, styles) => styles.timeContainer,
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'toolbarVariant',
})<{ ownerState: PickerToolbarOwnerState; toolbarVariant: PickerVariant }>({
  display: 'flex',
  flexDirection: 'row',
  variants: [
    {
      props: { toolbarDirection: 'rtl' },
      style: {
        flexDirection: 'row-reverse',
      },
    },
    {
      props: { toolbarVariant: 'desktop', pickerOrientation: 'portrait' },
      style: {
        gap: 9,
        marginRight: 4,
        alignSelf: 'flex-end',
      },
    },
    {
      props: ({
        pickerOrientation,
        toolbarVariant,
      }: PickerToolbarOwnerState & { toolbarVariant: PickerVariant }) =>
        pickerOrientation === 'landscape' && toolbarVariant !== 'desktop',
      style: {
        flexDirection: 'column',
      },
    },
    {
      props: ({
        pickerOrientation,
        toolbarVariant,
        toolbarDirection,
      }: PickerToolbarOwnerState & { toolbarVariant: PickerVariant }) =>
        pickerOrientation === 'landscape' &&
        toolbarVariant !== 'desktop' &&
        toolbarDirection === 'rtl',
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
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'toolbarVariant',
})<{ ownerState: PickerToolbarOwnerState; toolbarVariant: PickerVariant }>({
  display: 'flex',
  variants: [
    {
      props: { toolbarDirection: 'rtl' },
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
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'toolbarVariant',
})<{ ownerState: PickerToolbarOwnerState; toolbarVariant: PickerVariant }>({
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
  ownerState: PickerToolbarOwnerState;
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
      props: { pickerOrientation: 'landscape' },
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
 * If `forceDesktopVariant` is set to `true`, the toolbar will always be rendered in the desktop mode.
 * If `onViewChange` is defined, the toolbar will call it instead of calling the default handler from `usePickerContext`.
 * This is used by the Date Time Range Picker Toolbar.
 */
export const DateTimePickerToolbarOverrideContext = React.createContext<{
  forceDesktopVariant: boolean;
  onViewChange: (view: DateOrTimeViewWithMeridiem) => void;
  view: DateOrTimeViewWithMeridiem | null;
} | null>(null);

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
    isLandscape,
    toolbarFormat,
    toolbarPlaceholder = '––',
    toolbarTitle: inToolbarTitle,
    className,
    classes: classesProp,
    ...other
  } = props;

  const {
    disabled,
    readOnly,
    variant,
    view: viewCtx,
    onViewChange: onViewChangeCtx,
    views,
  } = usePickerContext();
  const ownerState = useToolbarOwnerState();
  const classes = useUtilityClasses(classesProp, ownerState);
  const utils = useUtils();
  const { meridiemMode, handleMeridiemChange } = useMeridiemMode(value, ampm, onChange);
  const translations = usePickerTranslations();
  const overrides = React.useContext(DateTimePickerToolbarOverrideContext);

  const toolbarVariant = overrides?.forceDesktopVariant ? 'desktop' : variant;
  const isDesktop = toolbarVariant === 'desktop';
  const showAmPmControl = Boolean(ampm && !ampmInClock);
  const toolbarTitle = inToolbarTitle ?? translations.dateTimePickerToolbarTitle;

  const view = overrides ? overrides.view : viewCtx;
  const onViewChange = overrides ? overrides.onViewChange : onViewChangeCtx;

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
      toolbarVariant={toolbarVariant}
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
      <DateTimePickerToolbarTimeContainer
        className={classes.timeContainer}
        ownerState={ownerState}
        toolbarVariant={toolbarVariant}
      >
        <DateTimePickerToolbarTimeDigitsContainer
          className={classes.timeDigitsContainer}
          ownerState={ownerState}
          toolbarVariant={toolbarVariant}
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
                toolbarVariant={toolbarVariant}
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
                toolbarVariant={toolbarVariant}
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
   * If `true`, show the toolbar even in desktop mode.
   * @default `true` for Desktop, `false` for Mobile.
   */
  hidden: PropTypes.bool,
  isLandscape: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
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
  value: PropTypes.object,
} as any;

export { DateTimePickerToolbar };
