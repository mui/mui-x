import * as React from 'react';
import { useComponentRenderer } from '@base_ui/react/utils/useComponentRenderer';
import type { BaseUIComponentProps } from '@base_ui/react/utils/types';
import {
  usePickersFieldSectionSeparator,
  UsePickersFieldSectionSeparator,
} from './usePickersFieldSectionSeparator';

const PickersFieldSectionSeparator = React.forwardRef(function PickersFieldSectionSeparator(
  props: PickersFieldSectionSeparator.Props,
  forwardedRef: React.ForwardedRef<HTMLSpanElement>,
) {
  const { render, className, position, ...otherProps } = props;
  const ownerState: PickersFieldSectionSeparator.OwnerState = {};

  const { getSectionSeparatorProps } = usePickersFieldSectionSeparator({ position });

  const { renderElement } = useComponentRenderer({
    propGetter: getSectionSeparatorProps,
    render: render ?? 'span',
    ref: forwardedRef,
    ownerState,
    className,
    extraProps: otherProps,
  });

  return renderElement();
});

namespace PickersFieldSectionSeparator {
  export interface OwnerState {}

  export interface Props extends BaseUIComponentProps<'span', OwnerState> {
    position: UsePickersFieldSectionSeparator.Parameters['position'];
  }
}

export { PickersFieldSectionSeparator };
