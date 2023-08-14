import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, useThemeProps, useTheme, Theme } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { PickersToolbarText } from '../internals/components/PickersToolbarText';
import { PickersToolbar } from '../internals/components/PickersToolbar';
import { PickersToolbarButton } from '../internals/components/PickersToolbarButton';
import { useLocaleText, useUtils } from '../internals/hooks/useUtils';
import { BaseToolbarProps, ExportedBaseToolbarProps } from '../internals/models/props/toolbar';
import {
  dateTimePickerToolbarClasses,
  DateTimePickerToolbarClasses,
  getDateTimePickerToolbarUtilityClass,
} from './dateTimePickerToolbarClasses';
import { DateOrTimeViewWithMeridiem, WrapperVariant } from '../internals/models';
import { useMeridiemMode } from '../internals/hooks/date-helpers-hooks';
import { MULTI_SECTION_CLOCK_SECTION_WIDTH } from '../internals/constants/dimensions';
import { formatMeridiem } from '../internals/utils/date-utils';

export interface ExportedDateTimePickerToolbarProps extends ExportedBaseToolbarProps {
  ampm?: boolean;
  ampmInClock?: boolean;
}

export interface DateTimePickerToolbarProps<TDate>
  extends ExportedDateTimePickerToolbarProps,
    BaseToolbarProps<TDate | null, DateOrTimeViewWithMeridiem> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DateTimePickerToolbarClasses>;
  toolbarVariant?: WrapperVariant;
}

const useUtilityClasses = (ownerState: DateTimePickerToolbarProps<any> & { theme: Theme }) => {
  const { classes, theme, isLandscape } = ownerState;
  const slots = {
    root: ['root'],
    dateContainer: ['dateContainer'],
    timeContainer: ['timeContainer', theme.direction === 'rtl' && 'timeLabelReverse'],
    timeDigitsContainer: ['timeDigitsContainer', theme.direction === 'rtl' && 'timeLabelReverse'],
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
})<{ ownerState: DateTimePickerToolbarProps<any> }>(({ theme, ownerState }) => ({
  paddingLeft: ownerState.toolbarVariant === 'desktop' && !ownerState.isLandscape ? 24 : 16,
  paddingRight: ownerState.toolbarVariant === 'desktop' && !ownerState.isLandscape ? 0 : 16,
  borderBottom:
    ownerState.toolbarVariant === 'desktop'
      ? `1px solid ${(theme.vars || theme).palette.divider}`
      : undefined,
  borderRight:
    ownerState.toolbarVariant === 'desktop' && ownerState.isLandscape
      ? `1px solid ${(theme.vars || theme).palette.divider}`
      : undefined,
  justifyContent: 'space-around',
  position: 'relative',
}));

DateTimePickerToolbarRoot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  as: PropTypes.elementType,
  classes: PropTypes.object,
  className: PropTypes.string,
  isLandscape: PropTypes.bool.isRequired,
  isMobileKeyboardViewOpen: PropTypes.bool,
  landscapeDirection: PropTypes.oneOf(['column', 'row']),
  ownerState: PropTypes.object.isRequired,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  toggleMobileKeyboardView: PropTypes.func,
  toolbarTitle: PropTypes.node,
  viewType: PropTypes.oneOf(['date', 'time']),
} as any;

const DateTimePickerToolbarDateContainer = styled('div', {
  name: 'MuiDateTimePickerToolbar',
  slot: 'DateContainer',
  overridesResolver: (props, styles) => styles.dateContainer,
})<{ ownerState: DateTimePickerToolbarProps<any> }>({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
});

const DateTimePickerToolbarTimeContainer = styled('div', {
  name: 'MuiDateTimePickerToolbar',
  slot: 'TimeContainer',
  overridesResolver: (props, styles) => styles.timeContainer,
})<{ ownerState: DateTimePickerToolbarProps<any> }>(({ theme, ownerState }) => {
  const direction =
    ownerState.isLandscape && ownerState.toolbarVariant !== 'desktop' ? 'column' : 'row';
  return {
    display: 'flex',
    flexDirection: direction,
    ...(ownerState.toolbarVariant === 'desktop' && {
      ...(!ownerState.isLandscape && {
        gap: 9,
        marginRight: 4,
        alignSelf: 'flex-end',
      }),
    }),
    ...(theme.direction === 'rtl' && {
      flexDirection: `${direction}-reverse`,
    }),
  };
});

const DateTimePickerToolbarTimeDigitsContainer = styled('div', {
  name: 'MuiDateTimePickerToolbar',
  slot: 'TimeDigitsContainer',
  overridesResolver: (props, styles) => styles.timeDigitsContainer,
})<{ ownerState: DateTimePickerToolbarProps<any> }>(({ theme, ownerState }) => ({
  display: 'flex',
  ...(ownerState.toolbarVariant === 'desktop' && { gap: 1.5 }),
  ...(theme.direction === 'rtl' && {
    flexDirection: 'row-reverse',
  }),
}));

DateTimePickerToolbarTimeContainer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  as: PropTypes.elementType,
  ownerState: PropTypes.object.isRequired,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

const DateTimePickerToolbarSeparator = styled(PickersToolbarText, {
  name: 'MuiDateTimePickerToolbar',
  slot: 'Separator',
  overridesResolver: (props, styles) => styles.separator,
})<{
  ownerState: DateTimePickerToolbarProps<any>;
}>(({ ownerState }) => ({
  margin: ownerState.toolbarVariant === 'desktop' ? 0 : '0 4px 0 2px',
  cursor: 'default',
}));

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
  ownerState: BaseToolbarProps<any, any>;
}>(({ ownerState }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginRight: 'auto',
  marginLeft: 12,
  ...(ownerState.isLandscape && {
    margin: '4px 0 auto',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  }),
  [`& .${dateTimePickerToolbarClasses.ampmLabel}`]: {
    fontSize: 17,
  },
}));

function DateTimePickerToolbar<TDate extends unknown>(inProps: DateTimePickerToolbarProps<TDate>) {
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
    ...other
  } = props;
  const ownerState = props;
  const utils = useUtils<TDate>();
  const { meridiemMode, handleMeridiemChange } = useMeridiemMode(value, ampm, onChange);

  const showAmPmControl = Boolean(ampm && !ampmInClock);
  const isDesktop = toolbarVariant === 'desktop';

  const localeText = useLocaleText<TDate>();
  const theme = useTheme();
  const classes = useUtilityClasses({ ...ownerState, theme });

  const formatHours = (time: TDate) =>
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
      toolbarTitle={localeText.dateTimePickerToolbarTitle}
      isLandscape={isLandscape}
      className={classes.root}
      {...other}
      ownerState={ownerState}
    >
      <DateTimePickerToolbarDateContainer className={classes.dateContainer} ownerState={ownerState}>
        {views.includes('year') && (
          <PickersToolbarButton
            tabIndex={-1}
            variant="subtitle1"
            data-mui-test="datetimepicker-toolbar-year"
            onClick={() => onViewChange('year')}
            selected={view === 'year'}
            value={value ? utils.format(value, 'year') : '–'}
          />
        )}

        {views.includes('day') && (
          <PickersToolbarButton
            tabIndex={-1}
            variant={isDesktop ? 'h5' : 'h4'}
            data-mui-test="datetimepicker-toolbar-day"
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
            <PickersToolbarButton
              variant={isDesktop ? 'h5' : 'h3'}
              width={isDesktop && !isLandscape ? MULTI_SECTION_CLOCK_SECTION_WIDTH : undefined}
              data-mui-test="hours"
              onClick={() => onViewChange('hours')}
              selected={view === 'hours'}
              value={value ? formatHours(value) : '--'}
            />
          )}

          {views.includes('minutes') && (
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
                data-mui-test="minutes"
                onClick={() => onViewChange('minutes')}
                selected={view === 'minutes'}
                value={value ? utils.format(value, 'minutes') : '--'}
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
                data-mui-test="seconds"
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
            data-mui-test="am-pm-view-button"
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
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  ampm: PropTypes.bool,
  ampmInClock: PropTypes.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * className applied to the root component.
   */
  className: PropTypes.string,
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
  readOnly: PropTypes.bool,
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
  toolbarVariant: PropTypes.oneOf(['desktop', 'mobile']),
  value: PropTypes.any,
  /**
   * Currently visible picker view.
   */
  view: PropTypes.oneOf(['day', 'hours', 'meridiem', 'minutes', 'month', 'seconds', 'year'])
    .isRequired,
  views: PropTypes.arrayOf(
    PropTypes.oneOf(['day', 'hours', 'meridiem', 'minutes', 'month', 'seconds', 'year']).isRequired,
  ).isRequired,
} as any;

export { DateTimePickerToolbar };
