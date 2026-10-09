// Material UI marks an invalid `Select` on both its combobox and its hidden native input,
// which is `aria-hidden` and must not take the focus.
const INVALID_CONTROL_SELECTOR = '[aria-invalid="true"]:not([aria-hidden="true"]):not(:disabled)';

/**
 * Focuses the first visible invalid control in `container` and selects its text when it
 * is an input. Returns whether a control took the focus. Call it once the errors are
 * rendered.
 */
export function focusFirstInvalid(container: Element): boolean {
  const controls = container.querySelectorAll<HTMLElement>(INVALID_CONTROL_SELECTOR);
  // A control in a hidden tab panel cannot take the focus.
  const control = Array.from(controls).find((element) => element.closest('[hidden]') === null);
  if (control === undefined) {
    return false;
  }
  control.focus();
  if (control instanceof HTMLInputElement) {
    control.select();
  }
  return control.ownerDocument.activeElement === control;
}
