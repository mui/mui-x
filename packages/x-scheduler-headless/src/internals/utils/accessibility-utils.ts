export function getCalendarGridHeaderCellId(rootId: string | undefined, columnIndex: number) {
  if (rootId === undefined) {
    return undefined;
  }

  return `${rootId}-header-cell-${columnIndex}`;
}
