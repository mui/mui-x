'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import {
  BaseToolbarProps,
  ExportedBaseToolbarProps,
  useUtils,
  DateOrTimeViewWithMeridiem,
  PickerRangeValue,
  useToolbarOwnerState,
  PickerToolbarOwnerState,
  DateTimePickerToolbarOverrideContext,
} from '@mui/x-date-pickers/internals';
import { usePickerContext, usePickerTranslations } from '@mui/x-date-pickers/hooks';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { DateTimePickerToolbar } from '@mui/x-date-pickers/DateTimePicker';
import {
  DateTimeRangePickerToolbarClasses,
  getDateTimeRangePickerToolbarUtilityClass,
} from './dateTimeRangePickerToolbarClasses';
import { calculateRangeChange } from '../internals/utils/date-range-manager';
import { usePickerRangePositionContext } from '../hooks';

const useUtilityClasses = (classes: Partial<DateTimeRangePickerToolbarClasses> | undefined) => {
  const slots = {
    root: ['root'],
    startToolbar: ['startToolbar'],
    endToolbar: ['endToolbar'],
  };

  return composeClasses(slots, getDateTimeRangePickerToolbarUtilityClass, classes);
};

type DateTimeRangeViews = Exclude<DateOrTimeViewWithMeridiem, 'year' | 'month'>;

export interface DateTimeRangePickerToolbarProps
  extends BaseToolbarProps,
    ExportedDateTimeRangePickerToolbarProps {
  ampm?: boolean;
}

export interface ExportedDateTimeRangePickerToolbarProps extends ExportedBaseToolbarProps {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DateTimeRangePickerToolbarClasses>;
}

const DateTimeRangePickerToolbarRoot = styled('div', {
  name: 'MuiDateTimeRangePickerToolbar',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{
  ownerState: PickerToolbarOwnerState;
}>({
  display: 'flex',
  flexDirection: 'column',
});

const DateTimeRangePickerToolbarStart = styled(DateTimePickerToolbar, {
  name: 'MuiDateTimeRangePickerToolbar',
  slot: 'StartToolbar',
  overridesResolver: (_, styles) => styles.startToolbar,
})<{ ownerState?: PickerToolbarOwnerState }>({
  borderBottom: 'none',
  paddingBottom: 0,
});

const DateTimeRangePickerToolbarEnd = styled(DateTimePickerToolbar, {
  name: 'MuiDateTimeRangePickerToolbar',
  slot: 'EndToolbar',
  overridesResolver: (_, styles) => styles.endToolbar,
})<{ ownerState?: PickerToolbarOwnerState }>({});

type DateTimeRangePickerToolbarComponent = ((
  props: DateTimeRangePickerToolbarProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

const DateTimeRangePickerToolbar = React.forwardRef(function DateTimeRangePickerToolbar(
  inProps: DateTimeRangePickerToolbarProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiDateTimeRangePickerToolbar' });
  const utils = useUtils();

  const {
    className,
    classes: classesProp,
    classes: inClasses,
    ampm,
    hidden,
    toolbarFormat,
    toolbarPlaceholder,
    titleId,
    sx,
    ...other
  } = props;

  const { value, setValue, disabled, readOnly, view, onViewChange, views } = usePickerContext<
    PickerRangeValue,
    DateTimeRangeViews
  >();
  const translations = usePickerTranslations();
  const ownerState = useToolbarOwnerState();
  const { rangePosition, onRangePositionChange } = usePickerRangePositionContext();
  const classes = useUtilityClasses(classesProp);

  const commonToolbarProps = {
    views,
    ampm,
    disabled,
    readOnly,
    hidden,
    toolbarFormat,
    toolbarPlaceholder,
  };

  const wrappedSetValue = React.useCallback(
    (newDate: PickerValidDate | null) => {
      const { nextSelection, newRange } = calculateRangeChange({
        newDate,
        utils,
        range: value,
        rangePosition,
        allowRangeFlip: true,
      });
      onRangePositionChange(nextSelection);
      setValue(newRange, { changeImportance: 'set' });
    },
    [setValue, onRangePositionChange, value, rangePosition, utils],
  );

  const startOverrides = React.useMemo(() => {
    const handleStartRangeViewChange = (newView: DateOrTimeViewWithMeridiem) => {
      if (newView === 'year' || newView === 'month') {
        return;
      }
      if (rangePosition !== 'start') {
        onRangePositionChange('start');
      }
      onViewChange(newView);
    };

    return {
      value: value[0],
      setValue: wrappedSetValue,
      forceDesktopVariant: true,
      onViewChange: handleStartRangeViewChange,
      view: rangePosition === 'start' ? view : null,
    };
  }, [value, wrappedSetValue, rangePosition, view, onRangePositionChange, onViewChange]);

  const endOverrides = React.useMemo(() => {
    const handleEndRangeViewChange = (newView: DateOrTimeViewWithMeridiem) => {
      if (newView === 'year' || newView === 'month') {
        return;
      }
      if (rangePosition !== 'end') {
        onRangePositionChange('end');
      }
      onViewChange(newView);
    };

    return {
      value: value[1],
      setValue: wrappedSetValue,
      forceDesktopVariant: true,
      onViewChange: handleEndRangeViewChange,
      view: rangePosition === 'end' ? view : null,
    };
  }, [value, wrappedSetValue, rangePosition, view, onRangePositionChange, onViewChange]);

  if (hidden) {
    return null;
  }

  return (
    <DateTimeRangePickerToolbarRoot
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      ref={ref}
      sx={sx}
      {...other}
    >
      <DateTimePickerToolbarOverrideContext.Provider value={startOverrides}>
        <DateTimeRangePickerToolbarStart
          toolbarTitle={translations.start}
          ownerState={ownerState}
          className={classes.startToolbar}
          titleId={titleId ? `${titleId}-start-toolbar` : undefined}
          {...commonToolbarProps}
        />
      </DateTimePickerToolbarOverrideContext.Provider>
      <DateTimePickerToolbarOverrideContext.Provider value={endOverrides}>
        <DateTimeRangePickerToolbarEnd
          toolbarTitle={translations.end}
          ownerState={ownerState}
          className={classes.endToolbar}
          titleId={titleId ? `${titleId}-end-toolbar` : undefined}
          {...commonToolbarProps}
        />
      </DateTimePickerToolbarOverrideContext.Provider>
    </DateTimeRangePickerToolbarRoot>
  );
}) as DateTimeRangePickerToolbarComponent;

DateTimeRangePickerToolbar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  ampm: PropTypes.bool,
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

export { DateTimeRangePickerToolbar };
