import { warnOnce } from './warning';

export function checkSlot(slotName: string, slot: Function) {
  if (process.env.NODE_ENV !== 'production') {
    if (slot.name !== undefined && slot.name === slotName) {
      // This is a render function, not a component.
      warnOnce(
        `MUI X: Slots only accept React components, but \`${String(slotName)}\` slot received a render function.
See https://mui.com/x/common-concepts/custom-components/#correct-usage for more details.`,
        'warning',
      );
    }
  }
}
