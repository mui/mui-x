/**
 * Combines a type with required and additional properties.
 *
 * @template P - The original type.
 * @template RequiredProps - The keys to make required.
 * @template AdditionalProps - Additional properties to include.
 */

export type DefaultizedProps<
  P extends {},
  RequiredProps extends keyof P,
  AdditionalProps extends {} = {},
> = Omit<P, RequiredProps | keyof AdditionalProps> &
  Required<Pick<P, RequiredProps>> &
  AdditionalProps;
