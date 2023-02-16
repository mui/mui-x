import { uncapitalizeObjectKeys, UncapitalizeObjectKeys } from './slotsMigration';

// TODO v7: Remove `components`, rename defaultComponents to `defaultSlots`
// and update slots to be `slots?: <Partial<SlotComponents>` after converting
// keys in Grid(Pro|Premium)SlotsComponent to camelCase.
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

  return { ...defaultSlots, ...overrides };
}
