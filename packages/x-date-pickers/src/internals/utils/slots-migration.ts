// TODO v7: This file exist only to simplify typing between 
// components/componentsProps and slots/slotsProps 
// Should be deleted when components/componentsProps are removed

type UncapitalizeKeys<T extends object> = Uncapitalize<keyof T & string>;

export type UncapitalizeObjectKeys<T extends object> = {
  [key in UncapitalizeKeys<T>]: Capitalize<key> extends keyof T ? T[Capitalize<key>] : never;
}

export interface SlotsAndSlotsProps<TSlots extends object, TSlotsProps> {
    /**
     * Overrideable components.
     * @default {}
     * @deprecated
     */
    components?: TSlots;
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
    slots?: UncapitalizeObjectKeys<UncapitalizeObjectKeys<TSlots>>;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotsProps?: TSlotsProps;
  }
  