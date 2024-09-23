import * as React from 'react';
import { useComponentRenderer } from '@base_ui/react/utils/useComponentRenderer';
import type { BaseUIComponentProps } from '@base_ui/react/utils/types';
import { UsePickersFieldContent, usePickersFieldContent } from './usePickersFieldContent';
import { PickersSectionElement } from '../../PickersSectionList';

const PickersFieldContent = React.forwardRef(function PickersFieldContent(
  props: PickersFieldContent.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { render, className, children, ...otherProps } = props;
  const { getContentProps } = usePickersFieldContent({ renderSection: children });
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
  export interface Props extends Omit<BaseUIComponentProps<'div', OwnerState>, 'children'> {
    children: UsePickersFieldContent.Parameters['renderSection'];
  }

  export interface OwnerState {}
}

export { PickersFieldContent };
