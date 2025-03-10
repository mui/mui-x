import { useTheme, useThemeProps } from '@mui/material/styles';
import resolveProps from '@mui/utils/resolveProps';
import useSlotProps from '@mui/utils/useSlotProps';
import * as React from 'react';

/**
 * A higher order component that consumes a slot from the props and renders the component provided in the slot.
 *
 * This HOC will wrap a single component, and will render the component provided in the slot, if it exists.
 *
 * If you need to render multiple components, you can manually consume the slots from the props and render them in your component instead of using this HOC.
 *
 * In the example below, `MyComponent` will render the component provided in `mySlot` slot, if it exists. Otherwise, it will render the `DefaultComponent`.
 *
 * @example
 *
 * ```tsx
 * type MyComponentProps = {
 *   direction: 'row' | 'column';
 *   slots?: {
 *     mySlot?: React.JSXElementConstructor<{ direction: 'row' | 'column' }>;
 *   }
 * };
 *
 * const MyComponent = consumeSlots(
 *   'MuiMyComponent',
 *   'mySlot',
 *   function DefaultComponent(props: MyComponentProps) {
 *     return (
 *       <div className={props.classes.root}>
 *         {props.direction}
 *       </div>
 *     );
 *   }
 * );
 * ```
 *
 * @param {string} name The mui component name.
 * @param {string} slotPropName The name of the prop to retrieve the slot from.
 * @param {object} options Options for the HOC.
 * @param {boolean} options.propagateSlots Whether to propagate the slots to the component, this is always false if the slot is provided.
 * @param {Record<string, any>} options.defaultProps A set of defaults for the component, will be deep merged with the props.
 * @param {Array<keyof Props>} options.omitProps An array of props to omit from the component.
 * @param {Function} options.classesResolver A function that returns the classes for the component. It receives the props, after theme props and defaults have been applied. And the theme object as the second argument.
 * @param InComponent The component to render if the slot is not provided.
 */
export const consumeSlots = <
  Props extends {},
  Ref extends {},
  RenderFunction = (props: Props, ref: React.Ref<Ref>) => React.ElementType,
>(
  name: string,
  slotPropName: string,
  options: {
    propagateSlots?: boolean;
    defaultProps?:
      | Omit<Partial<Props>, 'slots' | 'slotProps'>
      | ((props: Props) => Omit<Partial<Props>, 'slots' | 'slotProps'>);
    omitProps?: Array<keyof Props>;
    classesResolver?: (props: Props, theme: any) => Record<string, string>;
  },
  InComponent: RenderFunction,
) => {
  function ConsumeSlotsInternal(props: React.PropsWithoutRef<Props>, ref: React.ForwardedRef<Ref>) {
    const themedProps = useThemeProps({
      props,
      // eslint-disable-next-line material-ui/mui-name-matches-component-name
      name,
    });

    const defaultProps =
      typeof options.defaultProps === 'function'
        ? options.defaultProps(themedProps as Props)
        : (options.defaultProps ?? {});

    const defaultizedProps = resolveProps(defaultProps, themedProps) as Props;
    const { slots, slotProps, ...other } = defaultizedProps as {
      slots?: Record<string, any>;
      slotProps?: Record<string, any>;
    };

    const theme = useTheme();
    const classes = options.classesResolver?.(defaultizedProps, theme);

    // Can be a function component or a forward ref component.
    const Component = slots?.[slotPropName] ?? InComponent;

    const propagateSlots = options.propagateSlots && !slots?.[slotPropName];

    const { ownerState, ...originalOutProps } = useSlotProps({
      elementType: Component,
      externalSlotProps: slotProps?.[slotPropName],
      additionalProps: {
        ...other,
        classes,
        ...(propagateSlots && { slots, slotProps }),
      },
      ownerState: {},
    });

    const outProps = { ...originalOutProps } as unknown as Props;

    for (const prop of options.omitProps ?? []) {
      delete (outProps as unknown as Props)[prop];
    }

    // Component can be wrapped in React.forwardRef or just a function that accepts (props, ref).
    // If it is a plain function which accepts two arguments, we need to wrap it in React.forwardRef.
    const OutComponent = (
      Component.length >= 2 ? React.forwardRef(Component) : Component
    ) as React.FunctionComponent<Props>;

    if (process.env.NODE_ENV !== 'production') {
      OutComponent.displayName = `${name}.slots.${slotPropName}`;
    }

    return <OutComponent {...outProps} ref={ref} />;
  }

  return React.forwardRef<Ref, Props>(ConsumeSlotsInternal);
};
