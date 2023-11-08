export function computeSlots<SlotComponents extends object>({
  defaultSlots,
  slots,
}: {
  defaultSlots: SlotComponents;
  slots?: Partial<SlotComponents>;
}): SlotComponents {
  const overrides = slots;

  if (!overrides || Object.keys(overrides).length === 0) {
    return defaultSlots;
  }

  return { ...defaultSlots, ...overrides };
}
