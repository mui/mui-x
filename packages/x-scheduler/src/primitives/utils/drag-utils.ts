export function getCursorPositionRelativeToElement({
  ref,
  input,
}: {
  input: { clientY: number };
  ref: React.RefObject<HTMLElement | null>;
}) {
  if (!ref.current) {
    return { y: 0 };
  }

  const clientY = input.clientY;
  const pos = ref.current.getBoundingClientRect();
  const y = clientY - pos.y;

  return { y };
}
