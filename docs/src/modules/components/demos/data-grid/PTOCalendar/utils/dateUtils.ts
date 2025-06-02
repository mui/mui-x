import { format } from 'date-fns';

export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const isCurrentDay = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isDemoMonth = (date: Date): boolean => {
  return date.getMonth() === 0; // January
};

export const isWithinDemoYear = (date: Date): boolean => {
  return date.getFullYear() === 2025;
};

export const findContinuousPeriods = (dates: string[]): string[][] => {
  if (dates.length === 0) return [];

  const sortedDates = [...dates].sort();
  const periods: string[][] = [];
  let currentPeriod: string[] = [sortedDates[0]];

  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i]);
    const prevDate = new Date(sortedDates[i - 1]);
    const diffTime = currentDate.getTime() - prevDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      currentPeriod.push(sortedDates[i]);
    } else {
      periods.push([...currentPeriod]);
      currentPeriod = [sortedDates[i]];
    }
  }

  if (currentPeriod.length > 0) {
    periods.push(currentPeriod);
  }

  return periods;
};
