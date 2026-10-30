/**
 * The number of milliseconds of a day without a DST transition.
 */
export const MS_PER_DAY = 86_400_000;

/**
 * The day number of an ISO date: the number of days since January 1st, 1970.
 * The `days_from_civil` algorithm of https://howardhinnant.github.io/date_algorithms.html.
 */
export function isoDateToDayNumber(year: number, month: number, day: number): number {
  // The years start on March 1st, so the leap day is the last day of its year.
  const marchYear = month <= 2 ? year - 1 : year;
  const era = Math.floor(marchYear / 400);
  const yearOfEra = marchYear - era * 400;
  const dayOfYear = Math.floor((153 * (month > 2 ? month - 3 : month + 9) + 2) / 5) + day - 1;
  const dayOfEra =
    yearOfEra * 365 + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100) + dayOfYear;
  // 719468 is the number of days from March 1st, 0000 to January 1st, 1970.
  return era * 146_097 + dayOfEra - 719_468;
}

/**
 * The ISO date of a day number.
 * The `civil_from_days` algorithm of https://howardhinnant.github.io/date_algorithms.html.
 */
export function dayNumberToIsoDate(dayNumber: number): {
  year: number;
  month: number;
  day: number;
} {
  const daysFromMarchYear0 = dayNumber + 719_468;
  const era = Math.floor(daysFromMarchYear0 / 146_097);
  const dayOfEra = daysFromMarchYear0 - era * 146_097;
  const yearOfEra = Math.floor(
    (dayOfEra -
      Math.floor(dayOfEra / 1460) +
      Math.floor(dayOfEra / 36_524) -
      Math.floor(dayOfEra / 146_096)) /
      365,
  );
  const dayOfYear =
    dayOfEra - (365 * yearOfEra + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100));
  const marchMonth = Math.floor((5 * dayOfYear + 2) / 153);
  const month = marchMonth < 10 ? marchMonth + 3 : marchMonth - 9;
  return {
    year: yearOfEra + era * 400 + (month <= 2 ? 1 : 0),
    month,
    day: dayOfYear - Math.floor((153 * marchMonth + 2) / 5) + 1,
  };
}

/**
 * The day number of the last day `BaseTemporal.PlainDate` supports, September 13th, 275760, the
 * last day of `Date`.
 */
export const LAST_SUPPORTED_DAY = 100_000_000;

function getDaysInIsoMonth(year: number, month: number): number {
  if (month === 2) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
  }
  return month === 4 || month === 6 || month === 9 || month === 11 ? 30 : 31;
}

/**
 * The first day of the week of `dayNumber`, with weeks starting on the ISO weekday
 * `firstDayOfWeek`, from 1 (Monday) to 7 (Sunday).
 */
export function getStartOfWeekDayNumber(dayNumber: number, firstDayOfWeek: number): number {
  // January 1st, 1970 was a Thursday, the ISO weekday 4.
  const isoDayOfWeek = ((((dayNumber + 3) % 7) + 7) % 7) + 1;
  return dayNumber - ((isoDayOfWeek - firstDayOfWeek + 7) % 7);
}

/**
 * The first day of the month of `dayNumber`.
 */
export function getStartOfMonthDayNumber(dayNumber: number): number {
  return dayNumber - dayNumberToIsoDate(dayNumber).day + 1;
}

/**
 * Adds `months` to `dayNumber`, keeping its day of the month, or the last day of the month when
 * the month is shorter.
 */
export function addMonthsToDayNumber(dayNumber: number, months: number): number {
  const isoDate = dayNumberToIsoDate(dayNumber);
  const monthIndex = isoDate.year * 12 + isoDate.month - 1 + months;
  const year = Math.floor(monthIndex / 12);
  const month = monthIndex - year * 12 + 1;
  return isoDateToDayNumber(year, month, Math.min(isoDate.day, getDaysInIsoMonth(year, month)));
}
