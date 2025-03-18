const LIST_NAVIGATION_SUPPORTED_KEYS = [
  'ArrowDown',
  'ArrowUp',
  'Home',
  'End',
  'PageUp',
  'PageDown',
];

const PAGE_SIZE = 5;

export function navigateInList({
  cells,
  event,
  loop,
}: {
  cells: (HTMLElement | null)[];
  event: React.KeyboardEvent;
  loop: boolean;
}) {
  if (!LIST_NAVIGATION_SUPPORTED_KEYS.includes(event.key)) {
    return;
  }

  event.preventDefault();

  const navigableCells: HTMLElement[] = [];
  for (let i = 0; i < cells.length; i += 1) {
    const cell = cells[i];
    if (isNavigable(cell)) {
      navigableCells.push(cell);
    }
  }

  const lastIndex = navigableCells.length - 1;
  const currentIndex = navigableCells.indexOf(event.target as HTMLElement);
  let nextIndex = -1;

  switch (event.key) {
    case 'ArrowDown':
      if (currentIndex === lastIndex) {
        nextIndex = loop ? 0 : -1;
      } else {
        nextIndex = currentIndex + 1;
      }
      break;
    case 'ArrowUp':
      if (currentIndex === 0) {
        nextIndex = loop ? lastIndex : -1;
      } else {
        nextIndex = currentIndex - 1;
      }
      break;
    case 'PageDown': {
      nextIndex = Math.min(currentIndex + PAGE_SIZE, lastIndex);
      break;
    }
    case 'PageUp': {
      nextIndex = Math.max(currentIndex - PAGE_SIZE, 0);
      break;
    }
    case 'Home':
      nextIndex = 0;
      break;
    case 'End':
      nextIndex = lastIndex;
      break;
    default:
      break;
  }

  if (nextIndex > -1 && nextIndex < navigableCells.length) {
    navigableCells[nextIndex].focus();
  }
}

function isNavigable(element: HTMLElement | null): element is HTMLElement {
  if (element === null) {
    return false;
  }

  if (element.hasAttribute('disabled') || element.getAttribute('data-disabled') === 'true') {
    return false;
  }

  return true;
}
