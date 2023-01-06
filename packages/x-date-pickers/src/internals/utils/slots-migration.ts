// TODO v7: This file exist only to simplify typing between
// components/componentsProps and slots/slotsProps
// Should be deleted when components/componentsProps are removed

type UncapitalizeKeys<T extends object> = Uncapitalize<keyof T & string>;

export type UncapitalizeObjectKeys<T extends object> = {
  [key in UncapitalizeKeys<T>]: Capitalize<key> extends keyof T ? T[Capitalize<key>] : never;
};

// export type UncapitalizeObjectKeys<T = object> = {
//   [key in keyof T as Uncapitalize<key & string>]: T[key];
// };

export interface SlotsAndSlotsProps<TSlotsLegacy, TSlots, TSlotsProps> {
  /**
   * Overrideable components.
   * @default {}
   * @deprecated
   */
  components?: Partial<TSlotsLegacy>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated
   */
  componentsProps?: TSlotsProps;
  /**
   * Overrideable components.
   * @default {}
   */
  slots?: TSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotsProps?: TSlotsProps;
}

type RetrunedType<TInputType> = TInputType extends object
  ? UncapitalizeObjectKeys<TInputType>
  : undefined;

export const uncapitalizeObjectKeys = <TInputType extends object>(
  capitalizedObject: TInputType | undefined,
): RetrunedType<typeof capitalizedObject> => {
  if (capitalizedObject === undefined) {
    return undefined as RetrunedType<undefined>;
  }
  return Object.keys(capitalizedObject).reduce(
    (acc, key) => ({
      ...acc,
      [`${key.slice(0, 1).toLowerCase()}${key.slice(1)}`]: capitalizedObject[key],
    }),
    {} as RetrunedType<TInputType>,
  );
};
