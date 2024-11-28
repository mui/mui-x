export const attachPinnedStyle = (
  style: React.CSSProperties,
  position: 'left' | 'right' | undefined,
  pinnedOffset?: number,
) => {
  if (!position || pinnedOffset === undefined) {
    return style;
  }
  style[position] = pinnedOffset;
  return style;
};
