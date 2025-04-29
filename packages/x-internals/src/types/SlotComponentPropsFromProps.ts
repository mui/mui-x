/**
 * Defines the props for a slot component, which can be either partial props with overrides or a function returning such props.
 *
 * @template TProps - The original props type.
 * @template TOverrides - The overrides type.
 * @template TOwnerState - The owner state type.
 */

export type SlotComponentPropsFromProps<
  TProps extends {},
  TOverrides extends {},
  TOwnerState extends {},
> = (Partial<TProps> & TOverrides) | ((ownerState: TOwnerState) => Partial<TProps> & TOverrides);
