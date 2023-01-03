import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { styled, SxProps, Theme, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { PickersToolbar } from '../internals/components/PickersToolbar';
import { useLocaleText, useUtils } from '../internals/hooks/useUtils';
import { BaseToolbarProps, ExportedBaseToolbarProps } from '../internals/models/props/toolbar';
import { isYearOnlyView, isYearAndMonthViews } from '../internals/utils/views';
import { DateView } from '../internals/models';
import {
  DatePickerToolbarClasses,
  getDatePickerToolbarUtilityClass,
} from './datePickerToolbarClasses';

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

const DatePickerToolbarTitle = styled(Typography, {
  name: 'MuiDatePickerToolbar',
  slot: 'Title',
  overridesResolver: (_, styles) => styles.title,
})<{ ownerState: DatePickerToolbarProps<any> }>(({ ownerState }) => ({
  ...(ownerState.isLandscape && {
    margin: 'auto 16px auto auto',
  }),
}));

DatePickerToolbarTitle.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Set the text-align on the component.
   * @default 'inherit'
   */
  align: PropTypes.oneOf(['center', 'inherit', 'justify', 'left', 'right']),
  as: PropTypes.elementType,
  className: PropTypes.string,
  /**
   * If `true`, the text will have a bottom margin.
   * @default false
   */
  gutterBottom: PropTypes.bool,
  /**
   * If `true`, the text will not wrap, but instead will truncate with a text overflow ellipsis.
   *
   * Note that text overflow can only happen with block or inline-block level elements
   * (the element needs to have a width in order to overflow).
   * @default false
   */
  noWrap: PropTypes.bool,
  ownerState: PropTypes.shape({
    classes: PropTypes.object,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    isLandscape: PropTypes.bool.isRequired,
    isMobileKeyboardViewOpen: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onViewChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    sx: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
      PropTypes.func,
      PropTypes.object,
    ]),
    toggleMobileKeyboardView: PropTypes.func,
    toolbarFormat: PropTypes.string,
    toolbarPlaceholder: PropTypes.node,
    value: PropTypes.any.isRequired,
    view: PropTypes.oneOf(['day', 'month', 'year']).isRequired,
    views: PropTypes.arrayOf(
      PropTypes.oneOf(['day', 'hours', 'minutes', 'month', 'seconds', 'year']).isRequired,
    ).isRequired,
  }).isRequired,
  /**
   * If `true`, the element will be a paragraph element.
   * @default false
   */
  paragraph: PropTypes.bool,
  style: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * Applies the theme typography styles.
   * @default 'body1'
   */
  variant: PropTypes.oneOf([
    'body1',
    'body2',
    'button',
    'caption',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'inherit',
    'overline',
    'subtitle1',
    'subtitle2',
  ]),
  /**
   * The component maps the variant prop to a range of different HTML element types.
   * For instance, subtitle1 to `<h6>`.
   * If you wish to change that mapping, you can provide your own.
   * Alternatively, you can use the `component` prop.
   * @default {
   *   h1: 'h1',
   *   h2: 'h2',
   *   h3: 'h3',
   *   h4: 'h4',
   *   h5: 'h5',
   *   h6: 'h6',
   *   subtitle1: 'h6',
   *   subtitle2: 'h6',
   *   body1: 'p',
   *   body2: 'p',
   *   inherit: 'p',
   * }
   */
  variantMapping: PropTypes.shape({
    body1: PropTypes.string,
    body2: PropTypes.string,
    button: PropTypes.string,
    caption: PropTypes.string,
    h1: PropTypes.string,
    h2: PropTypes.string,
    h3: PropTypes.string,
    h4: PropTypes.string,
    h5: PropTypes.string,
    h6: PropTypes.string,
    inherit: PropTypes.string,
    overline: PropTypes.string,
    subtitle1: PropTypes.string,
    subtitle2: PropTypes.string,
  }),
} as any;

type DatePickerToolbarComponent = (<TDate>(
  props: DatePickerToolbarProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

/**
 * @ignore - internal component.
 */
const DatePickerToolbar = React.forwardRef(function DatePickerToolbar<TDate>(
  inProps: DatePickerToolbarProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiDatePickerToolbar' });
  const {
    value,
    isLandscape,
    isMobileKeyboardViewOpen,
    onChange,
    toggleMobileKeyboardView,
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

    if (toolbarFormat) {
      return utils.formatByString(value, toolbarFormat);
    }

    if (isYearOnlyView(views as DateView[])) {
      return utils.format(value, 'year');
    }

    if (isYearAndMonthViews(views as DateView[])) {
      return utils.format(value, 'month');
    }

    // Little localization hack (Google is doing the same for android native pickers):
    // For english localization it is convenient to include weekday into the date "Mon, Jun 1".
    // For other locales using strings like "June 1", without weekday.
    return /en/.test(utils.getCurrentLocaleCode())
      ? utils.format(value, 'normalDateWithWeekday')
      : utils.format(value, 'normalDate');
  }, [value, toolbarFormat, toolbarPlaceholder, utils, views]);

  const ownerState = props;

  return (
    <DatePickerToolbarRoot
      ref={ref}
      toolbarTitle={localeText.datePickerToolbarTitle}
      isMobileKeyboardViewOpen={isMobileKeyboardViewOpen}
      toggleMobileKeyboardView={toggleMobileKeyboardView}
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
  isLandscape: PropTypes.bool.isRequired,
  isMobileKeyboardViewOpen: PropTypes.bool,
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
  toggleMobileKeyboardView: PropTypes.func,
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
  views: PropTypes.arrayOf(
    PropTypes.oneOf(['day', 'hours', 'minutes', 'month', 'seconds', 'year']).isRequired,
  ).isRequired,
} as any;

export { DatePickerToolbar };
