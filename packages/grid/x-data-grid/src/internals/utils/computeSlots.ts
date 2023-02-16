import { uncapitalizeObjectKeys, UncapitalizeObjectKeys } from './slotsMigration';

// TODO v7: Remove `components`, rename defaultComponents to `defaultSlots`
// and update slots to be `slots?: <Partial<SlotComponents>` after converting
// keys in Grid(Pro|Premium)SlotsComponent to camelCase.
// https://github.com/mui/mui-x/issues/7940
export function computeSlots<SlotComponents extends object>({
  defaultComponents,
  slots,
  components,
}: {
  defaultComponents: SlotComponents;
  slots?: UncapitalizeObjectKeys<Partial<SlotComponents>>;
  components?: Partial<SlotComponents>;
}): UncapitalizeObjectKeys<SlotComponents> {
  const uncapitalizedDefaultSlots = uncapitalizeObjectKeys(defaultComponents)!;
  const overrides = slots ?? (components ? uncapitalizeObjectKeys(components) : null);

  if (!overrides) {
    return { ...uncapitalizedDefaultSlots };
  }

  type OverrideKeys = keyof UncapitalizeObjectKeys<Partial<SlotComponents>>;
  return Object.entries(uncapitalizedDefaultSlots).reduce((acc, [key, defaultComponent]) => {
    const override = overrides[key as OverrideKeys];
    const component = override !== undefined ? override : defaultComponent;
    return { ...acc, [key]: component };
  }, {} as UncapitalizeObjectKeys<SlotComponents>);
}
