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
import { usePickerContext, usePickerTranslations } from '@mui/x-date-pickers/hooks';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import {
  DateRangePickerToolbarClasses,
  getDateRangePickerToolbarUtilityClass,
} from './dateRangePickerToolbarClasses';
import { usePickerRangePositionContext } from '../hooks';

const useUtilityClasses = (classes: Partial<DateRangePickerToolbarClasses> | undefined) => {
  const slots = {
    root: ['root'],
    container: ['container'],
  };

  return composeClasses(slots, getDateRangePickerToolbarUtilityClass, classes);
};

export interface DateRangePickerToolbarProps
  extends ExportedDateRangePickerToolbarProps,
    Omit<BaseToolbarProps, 'onChange' | 'isLandscape'> {}

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

  const { toolbarFormat: toolbarFormatProp, className, classes: classesProp, ...other } = props;

  const { value } = usePickerContext<PickerRangeValue>();
  const translations = usePickerTranslations();
  const ownerState = useToolbarOwnerState();
  const { rangePosition, onRangePositionChange } = usePickerRangePositionContext();
  const classes = useUtilityClasses(classesProp);

  // This can't be a default value when spreading because it breaks the API generation.
  const toolbarFormat = toolbarFormatProp ?? utils.formats.shortDate;

  const formatDate = (date: PickerValidDate | null, fallback: string) => {
    if (!utils.isValid(date)) {
      return fallback;
    }

    return utils.formatByString(date, toolbarFormat);
  };

  return (
    <DateRangePickerToolbarRoot
      {...other}
      toolbarTitle={translations.dateRangePickerToolbarTitle}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      ref={ref}
    >
      <DateRangePickerToolbarContainer className={classes.container}>
        <PickersToolbarButton
          variant={value[0] == null ? 'h6' : 'h5'}
          value={formatDate(value[0], translations.start)}
          selected={rangePosition === 'start'}
          onClick={() => onRangePositionChange('start')}
        />
        <Typography variant="h5">&nbsp;{'–'}&nbsp;</Typography>
        <PickersToolbarButton
          variant={value[1] == null ? 'h6' : 'h5'}
          value={formatDate(value[1], translations.end)}
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
} as any;

export { DateRangePickerToolbar };
