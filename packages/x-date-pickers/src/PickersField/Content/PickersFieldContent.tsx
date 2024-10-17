import * as React from 'react';
import { useComponentRenderer } from '@base_ui/react/utils/useComponentRenderer';
import type { BaseUIComponentProps } from '@base_ui/react/utils/types';
import { UsePickersFieldContent, usePickersFieldContent } from './usePickersFieldContent';

const PickersFieldContent = React.forwardRef(function PickersFieldContent(
  props: PickersFieldContent.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { render, className, children, ...otherProps } = props;
  const { getContentProps, getInputProps } = usePickersFieldContent({ renderSection: children });
  const ownerState: PickersFieldContent.OwnerState = {};

  const { renderElement } = useComponentRenderer({
    propGetter: getContentProps,
    render: render ?? 'div',
    ref: forwardedRef,
    ownerState,
    className,
    extraProps: otherProps,
  });

  return (
    <React.Fragment>
      {renderElement()}
      <input {...getInputProps()} />
    </React.Fragment>
  );
});

namespace PickersFieldContent {
  export interface Props extends Omit<BaseUIComponentProps<'div', OwnerState>, 'children'> {
    children: UsePickersFieldContent.Parameters['renderSection'];
  }

  export interface OwnerState {}
}

export { PickersFieldContent };
