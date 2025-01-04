const LIST_NAVIGATION_SUPPORTED_KEYS = [
  'ArrowDown',
  'ArrowUp',
  'ArrowRight',
  'ArrowLeft',
  'Home',
  'End',
];

export function navigateInList({
  cells,
  target,
  key,
  loop,
}: {
  cells: (HTMLElement | null)[];
  target: HTMLElement;
  key: string;
  loop: boolean;
}) {
  if (!LIST_NAVIGATION_SUPPORTED_KEYS.includes(key)) {
    return;
  }

  const navigableCells: HTMLElement[] = [];

  for (let i = 0; i < cells.length; i += 1) {
    const cell = cells[i];
    if (isNavigable(cell)) {
      navigableCells.push(cell);
    }
  }

  const lastIndex = navigableCells.length - 1;

  let nextIndex = -1;

  const currentIndex = navigableCells.indexOf(target);

  switch (key) {
    case 'ArrowDown':
      if (loop) {
        nextIndex = currentIndex + 1 > lastIndex ? 0 : currentIndex + 1;
      } else {
        nextIndex = Math.min(currentIndex + 1, lastIndex);
      }
      break;
    case 'ArrowUp':
      if (loop) {
        nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
      } else {
        nextIndex = currentIndex - 1;
      }
      break;
    case 'Home':
      nextIndex = 0;
      break;
    case 'End':
      nextIndex = lastIndex;
      break;
    default:
      break;
  }

  if (nextIndex > -1) {
    navigableCells[nextIndex].focus();
  }
}

function isNavigable(element: HTMLElement | null): element is HTMLElement {
  return (
    element !== null &&
    !element.hasAttribute('disabled') &&
    element.getAttribute('data-disabled') !== 'true'
  );
}
