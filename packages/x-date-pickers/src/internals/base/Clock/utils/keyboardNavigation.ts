const LIST_NAVIGATION_SUPPORTED_KEYS = ['ArrowDown', 'ArrowUp', 'Home', 'End'];

// TODO: Add PageUp / PageDown support (same for (Range)Calendar)
export function navigateInList({
  options,
  event,
  loop,
}: {
  options: (HTMLElement | null)[];
  event: React.KeyboardEvent;
  loop: boolean;
}) {
  if (!LIST_NAVIGATION_SUPPORTED_KEYS.includes(event.key)) {
    return;
  }

  event.preventDefault();

  const navigableOptions: HTMLElement[] = [];
  for (let i = 0; i < options.length; i += 1) {
    const option = options[i];
    if (isNavigable(option)) {
      navigableOptions.push(option);
    }
  }

  const lastIndex = navigableOptions.length - 1;
  const currentIndex = navigableOptions.indexOf(event.target as HTMLElement);
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
    case 'Home':
      nextIndex = 0;
      break;
    case 'End':
      nextIndex = lastIndex;
      break;
    default:
      break;
  }

  if (nextIndex > -1 && nextIndex < navigableOptions.length) {
    navigableOptions[nextIndex].focus();
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
