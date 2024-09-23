import * as React from 'react';
import { useComponentRenderer } from '@base_ui/react/utils/useComponentRenderer';
import type { BaseUIComponentProps } from '@base_ui/react/utils/types';
import { usePickersFieldSectionContent } from './usePickersFieldSectionContent';

const PickersFieldSectionContent = React.forwardRef(function PickersFieldSectionContent(
  props: PickersFieldSectionContent.Props,
  forwardedRef: React.ForwardedRef<HTMLSpanElement>,
) {
  const { render, className, ...otherProps } = props;
  const ownerState: PickersFieldSectionContent.OwnerState = {};

  const { getSectionContentProps } = usePickersFieldSectionContent({});

  const { renderElement } = useComponentRenderer({
    propGetter: getSectionContentProps,
    render: render ?? 'span',
    ref: forwardedRef,
    ownerState,
    className,
    extraProps: otherProps,
  });

  return renderElement();
});

namespace PickersFieldSectionContent {
  export interface OwnerState {}

  export interface Props extends BaseUIComponentProps<'span', OwnerState> {}
}

export { PickersFieldSectionContent };
