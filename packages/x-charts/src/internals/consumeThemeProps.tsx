import { useTheme, useThemeProps } from '@mui/material/styles';
import resolveProps from '@mui/utils/resolveProps';
import * as React from 'react';

/**
 * A higher order component that consumes and merges the theme `defaultProps` and handles the `classes` and renders the component.
 *
 * This HOC will wrap a single component.
 * If you need to render multiple components, you can manually consume the theme and render them in your component instead of using this HOC.
 *
 * In the example below, `MyComponent` will render the `DefaultComponent` with the `direction` prop set to `'row'` and the className set to `'my-custom-root'`.
 *
 * @example
 * ```tsx
 * createTheme({
 *   components: {
 *     MuiMyComponent: {
 *       defaultProps: {
 *         direction: 'row',
 *       },
 *     },
 *   },
 * })
 *
 * type MyComponentProps = {
 *   direction: 'row' | 'column';
 *   classes?: Record<'root', string>;
 * };
 *
 * const MyComponent = consumeThemeProps(
 *   'MuiMyComponent',
 *   function DefaultComponent(props: MyComponentProps) {
 *     return (
 *       <div className={props.classes.root}>
 *         {props.direction}
 *       </div>
 *     );
 *   }
 * );
 *
 * render(<MyComponent classes={{ root: 'my-custom-root' }} />);
 * ```
 *
 * @param {string} name The mui component name.
 * @param {object} options Options for the HOC.
 * @param {Record<string, any>} options.defaultProps A set of defaults for the component, will be deep merged with the props.
 * @param {Function} options.classesResolver A function that returns the classes for the component. It receives the props, after theme props and defaults have been applied. And the theme object as the second argument.
 * @param InComponent The component to render if the slot is not provided.
 */
export const consumeThemeProps = <
  Props extends {},
  Ref extends {},
  RenderFunction = (props: Props, ref: React.Ref<Ref>) => React.ElementType,
>(
  name: string,
  options: {
    defaultProps?:
      | Omit<Partial<Props>, 'slots' | 'slotProps'>
      | (<T extends Props>(props: T) => Omit<Partial<T>, 'slots' | 'slotProps'>);
    classesResolver?: (props: Props, theme: any) => Record<string, string>;
  },
  InComponent: RenderFunction,
) =>
  React.forwardRef<Ref, Props>(function ConsumeThemeInternal(
    props: React.PropsWithoutRef<Props>,
    ref: React.ForwardedRef<Ref>,
  ) {
    const themedProps = useThemeProps({
      props,
      // eslint-disable-next-line material-ui/mui-name-matches-component-name
      name,
    });

    const defaultProps =
      typeof options.defaultProps === 'function'
        ? options.defaultProps(themedProps as Props)
        : (options.defaultProps ?? {});

    const outProps = resolveProps(defaultProps, themedProps) as React.PropsWithoutRef<Props>;

    const theme = useTheme();
    const classes = options.classesResolver?.(outProps as Props, theme);

    const OutComponent = React.forwardRef<Ref, Props>(
      InComponent as React.ForwardRefRenderFunction<Ref, React.PropsWithoutRef<Props>>,
    );

    if (process.env.NODE_ENV !== 'production') {
      OutComponent.displayName = `consumeThemeProps(${name})`;
    }

    return <OutComponent {...outProps} classes={classes} ref={ref} />;
  });
