import {
  PlainDate as PlainDateValue,
  type BaseTemporal as PlainDateTypes,
  type PlainDateConstructor,
} from './PlainDate';
import {
  PlainTime as PlainTimeValue,
  type BaseTemporal as PlainTimeTypes,
  type PlainTimeConstructor,
} from './PlainTime';
import {
  PlainDateTime as PlainDateTimeValue,
  type BaseTemporal as PlainDateTimeTypes,
  type PlainDateTimeConstructor,
} from './PlainDateTime';
import {
  ZonedDateTime as ZonedDateTimeValue,
  type BaseTemporal as ZonedDateTimeTypes,
  type ZonedDateTimeConstructor,
} from './ZonedDateTime';

/**
 * A date without a time or timezone, in the ISO calendar or another calendar system.
 */
export type PlainDate = PlainDateTypes.PlainDate;
export const PlainDate: PlainDateConstructor = PlainDateValue;
/**
 * A time without a date or timezone.
 */
export type PlainTime = PlainTimeTypes.PlainTime;
export const PlainTime: PlainTimeConstructor = PlainTimeValue;
/**
 * A date and time without a timezone, in the ISO calendar or another calendar system.
 */
export type PlainDateTime = PlainDateTimeTypes.PlainDateTime;
export const PlainDateTime: PlainDateTimeConstructor = PlainDateTimeValue;
/**
 * A date and time in a specific timezone, in the ISO calendar or another calendar system.
 */
export type ZonedDateTime = ZonedDateTimeTypes.ZonedDateTime;
export const ZonedDateTime: ZonedDateTimeConstructor = ZonedDateTimeValue;
