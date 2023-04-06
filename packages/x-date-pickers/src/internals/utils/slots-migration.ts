// TODO v7: This file exist only to simplify typing between
// components/componentsProps and slots/slotProps
// Should be deleted when components/componentsProps are removed

type OptionalKeys<T extends object> = Exclude<
  { [K in keyof T]: {} extends Pick<T, K> ? K : never }[keyof T],
  undefined
>;

type UncapitalizeKeys<T extends object> = Uncapitalize<keyof T & string>;

export type UncapitalizeObjectKeys<T extends object> = {
  [key in UncapitalizeKeys<Pick<T, OptionalKeys<T>>>]?: Capitalize<key> extends keyof T
    ? T[Capitalize<key>]
    : never;
} & {
  [key in UncapitalizeKeys<Omit<T, OptionalKeys<T>>>]: Capitalize<key> extends keyof T
    ? T[Capitalize<key>]
    : never;
};

export interface SlotsAndSlotProps<TSlots extends object, TSlotProps> {
  /**
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: TSlots;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: TSlotProps;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<TSlots>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TSlotProps;
}

type ObjectWithUnCapitalizedKeys<TInputType> = TInputType extends object
  ? UncapitalizeObjectKeys<TInputType>
  : undefined;

export const uncapitalizeObjectKeys = <TInputType extends object>(
  capitalizedObject: TInputType | undefined,
): ObjectWithUnCapitalizedKeys<typeof capitalizedObject> => {
  if (capitalizedObject === undefined) {
    return undefined as ObjectWithUnCapitalizedKeys<undefined>;
  }
  return Object.keys(capitalizedObject).reduce(
    (acc, key) => ({
      ...acc,
      [`${key.slice(0, 1).toLowerCase()}${key.slice(1)}`]:
        capitalizedObject[key as keyof TInputType],
    }),
    {} as ObjectWithUnCapitalizedKeys<TInputType>,
  );
};
