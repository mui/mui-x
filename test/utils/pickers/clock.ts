import { CLOCK_WIDTH } from '@mui/x-date-pickers/TimeClock/shared';
import { clockPointerClasses } from '@mui/x-date-pickers/TimeClock';
import { screen } from '@mui/internal-test-utils';

export const getClockTouchEvent = (
  value: number | string,
  view: 'minutes' | '12hours' | '24hours',
) => {
  // TODO: Handle 24 hours clock
  if (view === '24hours') {
    throw new Error('Do not support 24 hours clock yet');
  }

  let itemCount: number;
  if (view === 'minutes') {
    itemCount = 60;
  } else {
    itemCount = 12;
  }

  const angle = Math.PI / 2 - (Math.PI * 2 * Number(value)) / itemCount;
  const clientX = Math.round(((1 + Math.cos(angle)) * CLOCK_WIDTH) / 2);
  const clientY = Math.round(((1 - Math.sin(angle)) * CLOCK_WIDTH) / 2);

  return {
    changedTouches: [
      {
        clientX,
        clientY,
      },
    ],
  };
};

export const getTimeClockValue = () => {
  const clockPointer = document.querySelector<HTMLDivElement>(`.${clockPointerClasses.root}`);
  const transform = clockPointer?.style?.transform ?? '';
  const isMinutesView = screen.getByRole('listbox').getAttribute('aria-label')?.includes('minutes');

  const rotation = Number(/rotateZ\(([0-9]+)deg\)/.exec(transform)?.[1] ?? '0');

  if (isMinutesView) {
    return rotation / 6;
  }

  return rotation / 30;
};
