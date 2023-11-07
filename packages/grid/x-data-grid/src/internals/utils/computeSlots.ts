import { uncapitalizeObjectKeys, UncapitalizeObjectKeys } from './slotsMigration';

// TODO v7: Remove `components` and usages of `UncapitalizeObjectKeys` type
// after converting keys in Grid(Pro|Premium)SlotsComponent to camelCase.
// https://github.com/mui/mui-x/issues/7940
export function computeSlots<SlotComponents extends object>({
  defaultSlots,
  slots,
  components,
}: {
  defaultSlots: UncapitalizeObjectKeys<SlotComponents>;
  slots?: UncapitalizeObjectKeys<Partial<SlotComponents>>;
  components?: Partial<SlotComponents>;
}): UncapitalizeObjectKeys<SlotComponents> {
  const overrides = slots ?? (components ? uncapitalizeObjectKeys(components) : null);

  if (!overrides || Object.keys(overrides).length === 0) {
    return defaultSlots;
  }

  const result = { ...defaultSlots };
  for (let key in overrides) {
    if (Object.prototype.hasOwnProperty.call(overrides, key) && overrides[key] !== undefined) {
      result[key] = overrides[key] as any;
    }
  }

  return result;
}
