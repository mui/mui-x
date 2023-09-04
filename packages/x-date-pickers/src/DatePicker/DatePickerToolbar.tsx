import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { styled, SxProps, Theme, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { PickersToolbar } from '../internals/components/PickersToolbar';
import { useLocaleText, useUtils } from '../internals/hooks/useUtils';
import { BaseToolbarProps, ExportedBaseToolbarProps } from '../internals/models/props/toolbar';
import { DateView } from '../models';
import {
  DatePickerToolbarClasses,
  getDatePickerToolbarUtilityClass,
} from './datePickerToolbarClasses';
import { resolveDateFormat } from '../internals/utils/date-utils';

export interface DatePickerToolbarProps<TDate> extends BaseToolbarProps<TDate | null, DateView> {
  classes?: Partial<DatePickerToolbarClasses>;
  sx?: SxProps<Theme>;
}

export interface ExportedDatePickerToolbarProps extends ExportedBaseToolbarProps {}

const useUtilityClasses = (ownerState: DatePickerToolbarProps<any>) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    title: ['title'],
  };

  return composeClasses(slots, getDatePickerToolbarUtilityClass, classes);
};

const DatePickerToolbarRoot = styled(PickersToolbar, {
  name: 'MuiDatePickerToolbar',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})({});

/**
 * @ignore - do not document.
 */
const DatePickerToolbarTitle = styled(Typography, {
  name: 'MuiDatePickerToolbar',
  slot: 'Title',
  overridesResolver: (_, styles) => styles.title,
})<{ ownerState: DatePickerToolbarProps<any> }>(({ ownerState }) => ({
  ...(ownerState.isLandscape && {
    margin: 'auto 16px auto auto',
  }),
}));

type DatePickerToolbarComponent = (<TDate>(
  props: DatePickerToolbarProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

const DatePickerToolbar = React.forwardRef(function DatePickerToolbar<TDate>(
  inProps: DatePickerToolbarProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiDatePickerToolbar' });
  const {
    value,
    isLandscape,
    onChange,
    toolbarFormat,
    toolbarPlaceholder = '––',
    views,
    ...other
  } = props;
  const utils = useUtils<TDate>();
  const localeText = useLocaleText<TDate>();
  const classes = useUtilityClasses(props);

  const dateText = React.useMemo(() => {
    if (!value) {
      return toolbarPlaceholder;
    }

    const formatFromViews = resolveDateFormat(utils, { format: toolbarFormat, views }, true);

    return utils.formatByString(value, formatFromViews);
  }, [value, toolbarFormat, toolbarPlaceholder, utils, views]);

  const ownerState = props;

  return (
    <DatePickerToolbarRoot
      ref={ref}
      toolbarTitle={localeText.datePickerToolbarTitle}
      isLandscape={isLandscape}
      className={classes.root}
      {...other}
    >
      <DatePickerToolbarTitle
        variant="h4"
        data-mui-test="datepicker-toolbar-date"
        align={isLandscape ? 'left' : 'center'}
        ownerState={ownerState}
        className={classes.title}
      >
        {dateText}
      </DatePickerToolbarTitle>
    </DatePickerToolbarRoot>
  );
}) as DatePickerToolbarComponent;

DatePickerToolbar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
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
  value: PropTypes.any,
  /**
   * Currently visible picker view.
   */
  view: PropTypes.oneOf(['day', 'month', 'year']).isRequired,
  views: PropTypes.arrayOf(PropTypes.oneOf(['day', 'month', 'year']).isRequired).isRequired,
} as any;

export { DatePickerToolbar };
