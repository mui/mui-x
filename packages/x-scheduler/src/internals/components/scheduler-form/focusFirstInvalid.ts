// Material UI marks an invalid `Select` on both its combobox and its hidden native input,
// which is `aria-hidden` and must not take the focus.
const INVALID_CONTROL_SELECTOR = '[aria-invalid="true"]:not([aria-hidden="true"])';

/**
 * Focuses the first control in `container`, in document order, marked as invalid, and
 * selects its text when it is an input. Returns whether a control was focused.
 * Call it once the errors are rendered.
 */
export function focusFirstInvalid(container: Element): boolean {
  const control = container.querySelector<HTMLElement>(INVALID_CONTROL_SELECTOR);
  if (control === null) {
    return false;
  }
  control.focus();
  if (control instanceof HTMLInputElement) {
    control.select();
  }
  return true;
}
