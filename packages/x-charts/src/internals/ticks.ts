import type { TickParams } from '../hooks/useTicks';

export function getTickNumber(
  params: TickParams & {
    domain: any[];
    defaultTickNumber: number;
  },
) {
  const { tickMaxStep, tickMinStep, tickNumber, domain, defaultTickNumber } = params;

  const maxTicks =
    tickMinStep === undefined ? 999 : Math.floor(Math.abs(domain[1] - domain[0]) / tickMinStep);
  const minTicks =
    tickMaxStep === undefined ? 2 : Math.ceil(Math.abs(domain[1] - domain[0]) / tickMaxStep);

  const defaultizedTickNumber = tickNumber ?? defaultTickNumber;

  return Math.min(maxTicks, Math.max(minTicks, defaultizedTickNumber));
}

export function scaleTickNumberByRange(tickNumber: number, range: number[]) {
  const rangeGap = range[1] - range[0];

  /* If the range start and end are the same, `tickNumber` will become infinity, so we default to 1. */
  if (rangeGap === 0) {
    return 1;
  }

  return tickNumber / ((range[1] - range[0]) / 100);
}

export function calculateDefaultTickNumber(range: number[]): number {
  return Math.floor(Math.abs(range[1] - range[0]) / 50);
}
