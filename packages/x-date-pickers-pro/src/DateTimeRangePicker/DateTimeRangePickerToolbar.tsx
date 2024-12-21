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
import { UseRangePositionResponse } from '../internals/hooks/useRangePosition';
import {
  DateTimeRangePickerToolbarClasses,
  getDateTimeRangePickerToolbarUtilityClass,
} from './dateTimeRangePickerToolbarClasses';
import { calculateRangeChange } from '../internals/utils/date-range-manager';

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
  extends BaseToolbarProps<PickerRangeValue>,
    Pick<UseRangePositionResponse, 'rangePosition' | 'onRangePositionChange'>,
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
    value: [start, end],
    rangePosition,
    onRangePositionChange,
    className,
    classes: classesProp,
    onChange,
    classes: inClasses,
    isLandscape,
    ampm,
    hidden,
    toolbarFormat,
    toolbarPlaceholder,
    titleId,
    sx,
    ...other
  } = props;

  const { disabled, readOnly, view, onViewChange, views } = usePickerContext<DateTimeRangeViews>();
  const translations = usePickerTranslations();
  const ownerState = useToolbarOwnerState();
  const classes = useUtilityClasses(classesProp);

  const commonToolbarProps = {
    isLandscape,
    views,
    ampm,
    disabled,
    readOnly,
    hidden,
    toolbarFormat,
    toolbarPlaceholder,
  };

  const handleOnChange = React.useCallback(
    (newDate: PickerValidDate | null) => {
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
      forceDesktopVariant: true,
      onViewChange: handleStartRangeViewChange,
      view: rangePosition === 'start' ? view : null,
    };
  }, [rangePosition, view, onRangePositionChange, onViewChange]);

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
      forceDesktopVariant: true,
      onViewChange: handleEndRangeViewChange,
      view: rangePosition === 'end' ? view : null,
    };
  }, [rangePosition, view, onRangePositionChange, onViewChange]);

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
          value={start}
          toolbarTitle={translations.start}
          ownerState={ownerState}
          className={classes.startToolbar}
          onChange={handleOnChange}
          titleId={titleId ? `${titleId}-start-toolbar` : undefined}
          {...commonToolbarProps}
        />
      </DateTimePickerToolbarOverrideContext.Provider>
      <DateTimePickerToolbarOverrideContext.Provider value={endOverrides}>
        <DateTimeRangePickerToolbarEnd
          value={end}
          toolbarTitle={translations.end}
          ownerState={ownerState}
          className={classes.endToolbar}
          onChange={handleOnChange}
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
  isLandscape: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onRangePositionChange: PropTypes.func.isRequired,
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
} as any;

export { DateTimeRangePickerToolbar };
