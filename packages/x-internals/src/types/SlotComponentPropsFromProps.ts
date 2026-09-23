import type { WithDataAttributes } from '@mui/utils/types';

/**
 * Defines the props for a slot component, which can be either partial props
 * with overrides or a function returning such props.
 *
 * Both the object and function forms are widened via `WithDataAttributes`,
 * which keeps the original type as one branch of a union so that user code
 * casting to a custom prop type -- e.g. `{ editable: true } as CustomLabelProps`
 * or `return customProps as CustomLabelProps` from the callback -- stays
 * assignable without the custom type needing to declare a `data-*` index
 * signature.
 *
 * To type `data-*` attributes on slots, augment the shared
 * `DataAttributesOverrides` interface once. See the Material UI TypeScript guide:
 * https://mui.com/material-ui/guides/typescript/#allowing-data-attributes-on-slotprops
 *
 * @example
 * declare module '@mui/material/utils' {
 *   interface DataAttributesOverrides {
 *     [key: `data-${string}`]: string | number | boolean | undefined;
 *   }
 * }
 *
 * @template TProps - The original props type.
 * @template TOverrides - The overrides type.
 * @template TOwnerState - The owner state type.
 */
export type SlotComponentPropsFromProps<
  TProps extends {},
  TOverrides extends {},
  TOwnerState extends {},
> =
  | WithDataAttributes<Partial<TProps> & TOverrides>
  | ((ownerState: TOwnerState) => WithDataAttributes<Partial<TProps> & TOverrides>);
