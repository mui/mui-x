import * as React from 'react';
import { useComponentRenderer } from '@base_ui/react/utils/useComponentRenderer';
import type { BaseUIComponentProps } from '@base_ui/react/utils/types';
import { usePickersFieldSection } from './usePickersFieldSection';
import { PickersFieldSectionProvider } from './PickersFieldSectionProvider';

const PickersFieldSection = React.forwardRef(function PickersFieldSection(
  props: PickersFieldSection.Props,
  forwardedRef: React.ForwardedRef<HTMLSpanElement>,
) {
  const { render, className, index, ...otherProps } = props;
  const ownerState: PickersFieldSection.OwnerState = {};

  const { getSectionProps, contextValue } = usePickersFieldSection({ index });

  const { renderElement } = useComponentRenderer({
    propGetter: getSectionProps,
    render: render ?? 'span',
    ref: forwardedRef,
    ownerState,
    className,
    extraProps: otherProps,
  });

  return (
    <PickersFieldSectionProvider value={contextValue}>
      {renderElement()}
    </PickersFieldSectionProvider>
  );
});

namespace PickersFieldSection {
  export interface OwnerState {}

  export interface Props extends BaseUIComponentProps<'span', OwnerState> {
    index: number;
  }
}

export { PickersFieldSection };
