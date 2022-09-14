import * as React from 'react';
import PropTypes from 'prop-types';
import { DesktopPicker } from '../internals/components/DesktopPicker';
import { datePickerValueManager } from '../DatePicker/shared';
import { Unstable_DateField as DateField } from '../DateField';
import { DesktopDatePicker2Props } from './DesktopDatePicker2.types';
import { useDatePicker2DefaultizedProps, renderDateViews } from './shared';
import { useLocaleText } from '../internals';
import { Calendar } from '../internals/components/icons';

type DesktopDatePickerComponent = (<TDate>(
  props: DesktopDatePicker2Props<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

const DesktopDatePicker2 = React.forwardRef(function DesktopDatePicker<TDate>(
  inProps: DesktopDatePicker2Props<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const localeText = useLocaleText();
  const props = useDatePicker2DefaultizedProps<TDate, DesktopDatePicker2Props<TDate>>(
    inProps,
    'MuiDesktopDatePicker2',
  );

  const { components: inComponents, componentsProps: inComponentsProps, label, ...other } = props;

  const components = React.useMemo(
    () => ({
      Field: DateField,
      OpenPickerIcon: Calendar,
      ...inComponents,
    }),
    [inComponents],
  );

  const componentsProps = React.useMemo(
    () => ({
      ...inComponentsProps,
      field: {
        ref,
        label,
      },
    }),
    [inComponentsProps],
  );

  return (
    <DesktopPicker
      {...other}
      components={components}
      componentsProps={componentsProps}
      valueManager={datePickerValueManager}
      renderViews={renderDateViews}
      getOpenDialogAriaText={localeText.openDatePickerDialogue}
    />
  );
}) as DesktopDatePickerComponent;

DesktopDatePicker2.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Overrideable components.
   * @default {}
   */
  components: PropTypes.object,
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps: PropTypes.object,
  /**
   * Format of the date when rendered in the input(s).
   */
  inputFormat: PropTypes.string,
  /**
   * The label content.
   */
  label: PropTypes.node,
  /**
   * First view to show.
   */
  openTo: PropTypes.oneOf(['day', 'hours', 'minutes', 'month', 'seconds', 'year']).isRequired,
  /**
   * Array of views to show.
   */
  views: PropTypes.arrayOf(PropTypes.oneOf(['day', 'month', 'year']).isRequired),
} as any;

export { DesktopDatePicker2 };
