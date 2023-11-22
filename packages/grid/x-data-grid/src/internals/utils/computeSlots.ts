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

  const result = { ...defaultSlots };
  Object.keys(overrides).forEach((key) => {
    const k = key as keyof typeof overrides;

    if (overrides[k] !== undefined) {
      result[k] = overrides[k] as any;
    }
  });

  return result;
}
