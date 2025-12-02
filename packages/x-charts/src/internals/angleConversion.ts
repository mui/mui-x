export const deg2rad = (value?: number, defaultRad?: number) => {
  if (value === undefined) {
    return defaultRad!;
  }
  return (Math.PI * value) / 180;
};

export const rad2deg = (value?: number, defaultDeg?: number) => {
  if (value === undefined) {
    return defaultDeg!;
  }
  return (180 * value) / Math.PI;
};
