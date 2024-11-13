import { warnOnce } from './warning';

export function checkSlot(slotName: string, slot: Function) {
  // If the render function is passed as anonymous arrow function, its name will be the same as the slot name:
  //   slots={{ toolbar: () => <div /> }} // slots.toolbar.name === 'toolbar'
  // If a React component is passed, it's usually capitalized:
  //   slots={{ toolbar: Toolbar }} // slots.toolbar.name === 'Toolbar'
  // The rare edge cases are:
  //   slots={{ toolbar: toolbar }} // slots.toolbar.name === 'toolbar' - false positive. It's a component, not a render function
  //   slots={{ toolbar: function Toolbar() {} }} // slots.toolbar.name === 'Toolbar' - false negative. It's a render function, not a component
  if (slot.name !== undefined && slot.name === slotName) {
    // This is a render function, not a component.
    warnOnce(
      `MUI X: Slots only accept React components, but \`${String(slotName)}\` slot received a render function.
See https://mui.com/x/common-concepts/custom-components/#correct-usage for more details.`,
      'warning',
    );
  }
}
