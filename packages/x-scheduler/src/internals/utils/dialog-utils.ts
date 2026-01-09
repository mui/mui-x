export type Position = 'left' | 'right' | 'top' | 'bottom';

export function calculatePosition(
  anchorElement: HTMLElement | null,
  element: HTMLElement | null,
  defaultPosition: Position = 'right',
) {
  console.log(anchorElement, element, defaultPosition);
  if (!element || !anchorElement) {
    return undefined;
  }

  const anchorRect = anchorElement.getBoundingClientRect();
  const elemRect = element.getBoundingClientRect();
  const margin = 16;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // Helper to clamp values to viewport
  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

  const checkFit = (pos: Position) => {
    switch (pos) {
      case 'right':
        return windowWidth - anchorRect.right >= elemRect.width + margin;
      case 'left':
        return anchorRect.left >= elemRect.width + margin;
      case 'bottom':
        return windowHeight - anchorRect.bottom >= elemRect.height + margin;
      case 'top':
        return anchorRect.top >= elemRect.height + margin;
      default:
        return false;
    }
  };

  const getCoords = (pos: Position) => {
    let top = 0;
    let left = 0;

    switch (pos) {
      case 'right':
        left = anchorRect.right + margin;
        top = anchorRect.top;
        top = clamp(top, margin, windowHeight - elemRect.height - margin);
        break;
      case 'left':
        left = anchorRect.left - elemRect.width - margin;
        top = anchorRect.top;
        top = clamp(top, margin, windowHeight - elemRect.height - margin);
        break;
      case 'bottom':
        top = anchorRect.bottom + margin;
        left = anchorRect.left;
        left = clamp(left, margin, windowWidth - elemRect.width - margin);
        break;
      case 'top':
        top = anchorRect.top - elemRect.height - margin;
        left = anchorRect.left;
        left = clamp(left, margin, windowWidth - elemRect.width - margin);
        break;
      default:
        break;
    }
    return { top, left };
  };

  const positions: Position[] = ['right', 'left', 'bottom', 'top'];
  const preferredPositions = [
    defaultPosition,
    ...positions.filter((position) => position !== defaultPosition),
  ];
  console.log('Preferred Positions:', preferredPositions);
  const validPosition = preferredPositions.find(checkFit);

  if (validPosition) {
    return getCoords(validPosition);
  }

  // Fallback: Center on screen
  return {
    left: (windowWidth - elemRect.width) / 2,
    top: (windowHeight - elemRect.height) / 2,
  };
}
