'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import {
  PickersToolbar,
  PickersToolbarButton,
  useUtils,
  BaseToolbarProps,
  ExportedBaseToolbarProps,
  PickerRangeValue,
  PickerToolbarOwnerState,
  useToolbarOwnerState,
} from '@mui/x-date-pickers/internals';
import { usePickerTranslations } from '@mui/x-date-pickers/hooks';
import { UseRangePositionResponse } from '../internals/hooks/useRangePosition';
import {
  DateRangePickerToolbarClasses,
  getDateRangePickerToolbarUtilityClass,
} from './dateRangePickerToolbarClasses';

const useUtilityClasses = (classes: Partial<DateRangePickerToolbarClasses> | undefined) => {
  const slots = {
    root: ['root'],
    container: ['container'],
  };

  return composeClasses(slots, getDateRangePickerToolbarUtilityClass, classes);
};

export interface DateRangePickerToolbarProps
  extends ExportedDateRangePickerToolbarProps,
    Omit<BaseToolbarProps<PickerRangeValue, 'day'>, 'onChange' | 'isLandscape'>,
    Pick<UseRangePositionResponse, 'rangePosition' | 'onRangePositionChange'> {}

export interface ExportedDateRangePickerToolbarProps extends ExportedBaseToolbarProps {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DateRangePickerToolbarClasses>;
}

const DateRangePickerToolbarRoot = styled(PickersToolbar, {
  name: 'MuiDateRangePickerToolbar',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{
  ownerState: PickerToolbarOwnerState;
}>({});

const DateRangePickerToolbarContainer = styled('div', {
  name: 'MuiDateRangePickerToolbar',
  slot: 'Container',
  overridesResolver: (_, styles) => styles.container,
})({
  display: 'flex',
});

type DateRangePickerToolbarComponent = ((
  props: DateRangePickerToolbarProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

/**
 * Demos:
 *
 * - [DateRangePicker](https://mui.com/x/react-date-pickers/date-range-picker/)
 * - [Custom components](https://mui.com/x/react-date-pickers/custom-components/)
 *
 * API:
 *
 * - [DateRangePickerToolbar API](https://mui.com/x/api/date-pickers/date-range-picker-toolbar/)
 */
const DateRangePickerToolbar = React.forwardRef(function DateRangePickerToolbar(
  inProps: DateRangePickerToolbarProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const utils = useUtils();
  const props = useThemeProps({ props: inProps, name: 'MuiDateRangePickerToolbar' });

  const {
    value: [start, end],
    rangePosition,
    onRangePositionChange,
    toolbarFormat,
    className,
    classes: classesProp,
    onViewChange,
    view,
    views,
    ...other
  } = props;

  const translations = usePickerTranslations();
  const ownerState = useToolbarOwnerState();
  const classes = useUtilityClasses(classesProp);

  const startDateValue = start
    ? utils.formatByString(start, toolbarFormat || utils.formats.shortDate)
    : translations.start;

  const endDateValue = end
    ? utils.formatByString(end, toolbarFormat || utils.formats.shortDate)
    : translations.end;

  return (
    <DateRangePickerToolbarRoot
      {...other}
      toolbarTitle={translations.dateRangePickerToolbarTitle}
      isLandscape={false}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      ref={ref}
    >
      <DateRangePickerToolbarContainer className={classes.container}>
        <PickersToolbarButton
          variant={start !== null ? 'h5' : 'h6'}
          value={startDateValue}
          selected={rangePosition === 'start'}
          onClick={() => onRangePositionChange('start')}
        />
        <Typography variant="h5">&nbsp;{'–'}&nbsp;</Typography>
        <PickersToolbarButton
          variant={end !== null ? 'h5' : 'h6'}
          value={endDateValue}
          selected={rangePosition === 'end'}
          onClick={() => onRangePositionChange('end')}
        />
      </DateRangePickerToolbarContainer>
    </DateRangePickerToolbarRoot>
  );
}) as DateRangePickerToolbarComponent;

DateRangePickerToolbar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
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
   * Toolbar date format.
   */
  toolbarFormat: PropTypes.string,
  /**
   * Toolbar value placeholder—it is displayed when the value is empty.
   * @default "––"
   */
  toolbarPlaceholder: PropTypes.node,
  value: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * Currently visible picker view.
   */
  view: PropTypes.oneOf(['day']).isRequired,
  /**
   * Available views.
   */
  views: PropTypes.arrayOf(PropTypes.oneOf(['day'])).isRequired,
} as any;

export { DateRangePickerToolbar };
