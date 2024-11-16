export const CLOCK_WIDTH = 220;
export const CLOCK_HOUR_WIDTH = 36;

export const HOURS_STEPS = 24;
export const MINUTES_STEPS = 60;

const clockCenter = {
  x: CLOCK_WIDTH / 2,
  y: CLOCK_WIDTH / 2,
};

const baseClockPoint = {
  x: clockCenter.x,
  y: 0,
};

const cx = baseClockPoint.x - clockCenter.x;
const cy = baseClockPoint.y - clockCenter.y;

const rad2deg = (rad: number) => rad * (180 / Math.PI);

const getAngleValue = (step: number, offsetX: number, offsetY: number) => {
  const x = offsetX - clockCenter.x;
  const y = offsetY - clockCenter.y;

  const atan = Math.atan2(cx, cy) - Math.atan2(x, y);

  let deg = rad2deg(atan);
  deg = Math.round(deg / step) * step;
  deg %= 360;

  const value = Math.floor(deg / step) || 0;

  return { value };
};

export const getDialValue = (offsetX: number, offsetY: number, steps: number) => {
  // 6 degrees for 60 minutes, 15 degrees for 24 hour dials, 30 degrees for 12 h dials
  const degreesPerStep = 360 / steps;
  let { value } = getAngleValue(degreesPerStep, offsetX, offsetY);
  return value % steps;
};
