import { warnOnce } from '@mui/x-internals/warning';

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
      if (process.env.NODE_ENV !== 'production') {
        const slot = overrides[k] as Function;
        if (slot.name !== undefined && slot.name === key) {
          // This is a render function, not a component.
          warnOnce(
            `MUI X: Slots only accept React components, but \`${String(k)}\` slot received a render function.
See https://mui.com/x/common-concepts/custom-components/#correct-usage for more details.`,
            'warning',
          );
        }
      }

      result[k] = overrides[k] as any;
    }
  });

  return result;
}
