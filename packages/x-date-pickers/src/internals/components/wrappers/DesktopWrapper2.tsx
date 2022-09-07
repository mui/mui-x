import * as React from 'react';
import { useSlotProps } from '@mui/base/utils';
import { PickersPopper } from '@mui/x-date-pickers/internals/components/PickersPopper';

export interface DesktopWrapper2SlotsComponent {
  Field: React.ElementType;
}

export interface DesktopWrapper2SlotsComponentsProps {
  // TODO: Type props of field
  field: Record<string, any>;
}

interface DesktopWrapperProps {
  /**
   * Overrideable components.
   * @default {}
   */
  components: DesktopWrapper2SlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: Partial<DesktopWrapper2SlotsComponentsProps>;
}

export function DesktopWrapper2(props: DesktopWrapperProps) {
  const { components, componentsProps = {} } = props;

  const Field = components.Field;
  const fieldProps = useSlotProps({
    elementType: Field,
    externalSlotProps: componentsProps.field,
    // TODO: Pass owner state
    ownerState: {},
  });

  return (
    <React.Fragment>
      <Field {...fieldProps} />
    </React.Fragment>
  );
}
