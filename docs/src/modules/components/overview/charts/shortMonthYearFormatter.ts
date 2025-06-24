// Inspired from https://d3js.org/d3-time-format
export const shortMonthYearFormatter = (date: Date) => {
  if (date.getDate() !== 1) {
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric' });
  }
  if (date.getMonth() !== 0) {
    return date.toLocaleString('en-US', { month: 'short' });
  }
  return date.toLocaleString('en-US', {
    year: 'numeric',
  });
};
