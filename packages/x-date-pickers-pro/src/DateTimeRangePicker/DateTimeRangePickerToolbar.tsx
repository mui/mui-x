import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import {
  BaseToolbarProps,
  useLocaleText,
  ExportedBaseToolbarProps,
  useUtils,
  pickersToolbarTextClasses,
} from '@mui/x-date-pickers/internals';
import {
  DateTimePickerToolbarProps,
  DateTimePickerToolbar,
  dateTimePickerToolbarClasses,
} from '@mui/x-date-pickers/DateTimePicker';
import { DateOrTimeViewWithMeridiem, WrapperVariant } from '@mui/x-date-pickers/internals/models';
import { DateRange } from '../internals/models';
import { UseRangePositionResponse } from '../internals/hooks/useRangePosition';
import {
  DateTimeRangePickerToolbarClasses,
  getDateTimeRangePickerToolbarUtilityClass,
} from './dateTimeRangePickerToolbarClasses';
import { calculateRangeChange } from '../internals/utils/date-range-manager';

const useUtilityClasses = (ownerState: DateTimeRangePickerToolbarProps<any>) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    startToolbar: ['startToolbar'],
    endToolbar: ['endToolbar'],
  };

  return composeClasses(slots, getDateTimeRangePickerToolbarUtilityClass, classes);
};

type DateTimeRangeViews = Exclude<DateOrTimeViewWithMeridiem, 'year' | 'month'>;

export interface DateTimeRangePickerToolbarProps<TDate>
  extends BaseToolbarProps<DateRange<TDate>, DateTimeRangeViews>,
    Pick<UseRangePositionResponse, 'rangePosition' | 'onRangePositionChange'> {
  classes?: Partial<DateTimeRangePickerToolbarClasses>;
  ampm?: boolean;
  toolbarVariant?: WrapperVariant;
}

export interface ExportedDateTimeRangePickerToolbarProps extends ExportedBaseToolbarProps {}

const DateTimeRangePickerToolbarRoot = styled('div', {
  name: 'MuiDateTimeRangePickerToolbar',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{
  ownerState: DateTimeRangePickerToolbarProps<any>;
}>({
  display: 'flex',
  flexDirection: 'column',
});

type DateTimeRangePickerStartOrEndToolbarProps<TDate> = DateTimePickerToolbarProps<TDate> & {
  ownerState?: DateTimeRangePickerToolbarProps<TDate>;
};

type DateTimeRangePickerStartOrEndToolbarComponent = <TDate>(
  props: DateTimeRangePickerStartOrEndToolbarProps<TDate>,
) => React.JSX.Element;

const DateTimeRangePickerToolbarStart = styled(DateTimePickerToolbar, {
  name: 'MuiDateTimeRangePickerToolbar',
  slot: 'StartToolbar',
  overridesResolver: (_, styles) => styles.startToolbar,
})<DateTimeRangePickerStartOrEndToolbarProps<any>>(({ theme, ownerState }) => ({
  borderBottom: 'none',
  ...(ownerState?.toolbarVariant !== 'desktop'
    ? {
        padding: '12px 8px 0 12px',
      }
    : {
        paddingBottom: 0,
      }),
  [`&.${dateTimePickerToolbarClasses.root} .${pickersToolbarTextClasses.selected}`]: {
    color: (theme.vars || theme).palette.primary.main,
    fontWeight: theme.typography.fontWeightBold,
  },
})) as DateTimeRangePickerStartOrEndToolbarComponent;

const DateTimeRangePickerToolbarEnd = styled(DateTimePickerToolbar, {
  name: 'MuiDateTimeRangePickerToolbar',
  slot: 'EndToolbar',
  overridesResolver: (_, styles) => styles.endToolbar,
})<DateTimeRangePickerStartOrEndToolbarProps<any>>(({ theme, ownerState }) => ({
  padding: ownerState?.toolbarVariant !== 'desktop' ? '12px 8px 12px 12px' : undefined,
  [`&.${dateTimePickerToolbarClasses.root} .${pickersToolbarTextClasses.selected}`]: {
    color: (theme.vars || theme).palette.primary.main,
    fontWeight: theme.typography.fontWeightBold,
  },
})) as DateTimeRangePickerStartOrEndToolbarComponent;

const DateTimeRangePickerToolbar = React.forwardRef(function DateTimeRangePickerToolbar<
  TDate extends unknown,
>(inProps: DateTimeRangePickerToolbarProps<TDate>, ref: React.Ref<HTMLDivElement>) {
  const props = useThemeProps({ props: inProps, name: 'MuiDateTimeRangePickerToolbar' });
  const utils = useUtils<TDate>();

  const {
    value: [start, end],
    rangePosition,
    onRangePositionChange,
    className,
    onViewChange,
    toolbarVariant,
    onChange,
    classes: inClasses,
    ...other
  } = props;

  const localeText = useLocaleText<TDate>();

  const ownerState = props;
  const classes = useUtilityClasses(ownerState);

  const handleStartRangeViewChange = React.useCallback(
    (newView: DateOrTimeViewWithMeridiem) => {
      if (newView === 'year' || newView === 'month') {
        return;
      }
      if (rangePosition !== 'start') {
        onRangePositionChange('start');
      }
      onViewChange(newView);
    },
    [onRangePositionChange, onViewChange, rangePosition],
  );

  const handleEndRangeViewChange = React.useCallback(
    (newView: DateOrTimeViewWithMeridiem) => {
      if (newView === 'year' || newView === 'month') {
        return;
      }
      if (rangePosition !== 'end') {
        onRangePositionChange('end');
      }
      onViewChange(newView);
    },
    [onRangePositionChange, onViewChange, rangePosition],
  );

  const handleOnChange = React.useCallback(
    (newDate: TDate | null) => {
      const { nextSelection, newRange } = calculateRangeChange({
        newDate,
        utils,
        range: props.value,
        rangePosition,
        allowRangeFlip: true,
      });
      onRangePositionChange(nextSelection);
      onChange(newRange);
    },
    [onChange, onRangePositionChange, props.value, rangePosition, utils],
  );

  return (
    <DateTimeRangePickerToolbarRoot
      className={clsx(className, classes.root)}
      ownerState={ownerState}
      ref={ref}
    >
      <DateTimeRangePickerToolbarStart<TDate>
        {...other}
        value={start}
        onViewChange={handleStartRangeViewChange}
        toolbarTitle={localeText.start}
        ownerState={ownerState}
        toolbarVariant="desktop"
        markSelected={rangePosition === 'start'}
        className={classes.startToolbar}
        onChange={handleOnChange}
      />
      <DateTimeRangePickerToolbarEnd<TDate>
        {...other}
        value={end}
        onViewChange={handleEndRangeViewChange}
        toolbarTitle={localeText.end}
        ownerState={ownerState}
        toolbarVariant="desktop"
        markSelected={rangePosition === 'end'}
        className={classes.endToolbar}
        onChange={handleOnChange}
      />
    </DateTimeRangePickerToolbarRoot>
  );
});

DateTimeRangePickerToolbar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  ampm: PropTypes.bool,
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
  onRangePositionChange: PropTypes.func.isRequired,
  /**
   * Callback called when a toolbar is clicked
   * @template TView
   * @param {TView} view The view to open
   */
  onViewChange: PropTypes.func.isRequired,
  rangePosition: PropTypes.oneOf(['end', 'start']).isRequired,
  readOnly: PropTypes.bool,
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
  toolbarVariant: PropTypes.oneOf(['desktop', 'mobile']),
  value: PropTypes.arrayOf(PropTypes.any).isRequired,
  /**
   * Currently visible picker view.
   */
  view: PropTypes.oneOf(['day', 'hours', 'meridiem', 'minutes', 'seconds']).isRequired,
  views: PropTypes.arrayOf(
    PropTypes.oneOf(['day', 'hours', 'meridiem', 'minutes', 'seconds']).isRequired,
  ).isRequired,
} as any;

export { DateTimeRangePickerToolbar };
