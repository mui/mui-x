import * as React from 'react';
import { useComponentRenderer } from '@base_ui/react/utils/useComponentRenderer';
import type { BaseUIComponentProps } from '@base_ui/react/utils/types';
import { usePickersFieldContent } from './usePickersFieldContent';

const PickersFieldContent = React.forwardRef(function PickersFieldContent(
  props: PickersFieldContent.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { render, className, ...otherProps } = props;
  const { getContentProps } = usePickersFieldContent({});
  const ownerState: PickersFieldContent.OwnerState = {};

  const { renderElement } = useComponentRenderer({
    propGetter: getContentProps,
    render: render ?? 'div',
    ref: forwardedRef,
    ownerState,
    className,
    extraProps: otherProps,
  });

  return renderElement();
});

namespace PickersFieldContent {
  export interface Props extends BaseUIComponentProps<'div', OwnerState> {}

  export interface OwnerState {}
}

export { PickersFieldContent };
