'use client';
import * as React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { PickersToolbar } from '../internals/components/PickersToolbar';
import { usePickerTranslations } from '../hooks/usePickerTranslations';
import { useUtils } from '../internals/hooks/useUtils';
import { BaseToolbarProps, ExportedBaseToolbarProps } from '../internals/models/props/toolbar';
import { DateView } from '../models';
import {
  DatePickerToolbarClasses,
  getDatePickerToolbarUtilityClass,
} from './datePickerToolbarClasses';
import { resolveDateFormat } from '../internals/utils/date-utils';
import { PickerValue } from '../internals/models';
import {
  PickerToolbarOwnerState,
  useToolbarOwnerState,
} from '../internals/hooks/useToolbarOwnerState';

export interface DatePickerToolbarProps
  extends BaseToolbarProps<PickerValue, DateView>,
    ExportedDatePickerToolbarProps {}

export interface ExportedDatePickerToolbarProps extends ExportedBaseToolbarProps {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DatePickerToolbarClasses>;
}

const useUtilityClasses = (classes: Partial<DatePickerToolbarClasses> | undefined) => {
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
})<{ ownerState: PickerToolbarOwnerState }>({
  variants: [
    {
      props: { pickerOrientation: 'landscape' },
      style: {
        margin: 'auto 16px auto auto',
      },
    },
  ],
});

type DatePickerToolbarComponent = ((
  props: DatePickerToolbarProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

/**
 * Demos:
 *
 * - [DatePicker](https://mui.com/x/react-date-pickers/date-picker/)
 * - [Custom components](https://mui.com/x/react-date-pickers/custom-components/)
 *
 * API:
 *
 * - [DatePickerToolbar API](https://mui.com/x/api/date-pickers/date-picker-toolbar/)
 */
export const DatePickerToolbar = React.forwardRef(function DatePickerToolbar(
  inProps: DatePickerToolbarProps,
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
    className,
    classes: classesProp,
    onViewChange,
    view,
    ...other
  } = props;
  const utils = useUtils();
  const translations = usePickerTranslations();
  const ownerState = useToolbarOwnerState();
  const classes = useUtilityClasses(classesProp);

  const dateText = React.useMemo(() => {
    if (!value) {
      return toolbarPlaceholder;
    }

    const formatFromViews = resolveDateFormat(utils, { format: toolbarFormat, views }, true);

    return utils.formatByString(value, formatFromViews);
  }, [value, toolbarFormat, toolbarPlaceholder, utils, views]);

  return (
    <DatePickerToolbarRoot
      ref={ref}
      toolbarTitle={translations.datePickerToolbarTitle}
      isLandscape={isLandscape}
      className={clsx(classes.root, className)}
      {...other}
    >
      <DatePickerToolbarTitle
        variant="h4"
        data-testid="datepicker-toolbar-date"
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
  isLandscape: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  /**
   * Callback called when a toolbar is clicked
   * @template TView
   * @param {TView} view The view to open
   */
  onViewChange: PropTypes.func.isRequired,
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
  value: PropTypes.object,
  /**
   * Currently visible picker view.
   */
  view: PropTypes.oneOf(['day', 'month', 'year']).isRequired,
  /**
   * Available views.
   */
  views: PropTypes.arrayOf(PropTypes.oneOf(['day', 'month', 'year']).isRequired).isRequired,
} as any;
