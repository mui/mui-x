import { PlainDate as PlainDateValue } from './PlainDate';
import type { BaseTemporal as PlainDateTypes } from './PlainDate';
import { PlainTime as PlainTimeValue } from './PlainTime';
import type { BaseTemporal as PlainTimeTypes } from './PlainTime';
import { PlainDateTime as PlainDateTimeValue } from './PlainDateTime';
import type { BaseTemporal as PlainDateTimeTypes } from './PlainDateTime';
import { ZonedDateTime as ZonedDateTimeValue } from './ZonedDateTime';
import type { BaseTemporal as ZonedDateTimeTypes } from './ZonedDateTime';

// Each value comes before its type: the API generator documents the first declaration of a name,
// and only the value carries the constructor and the static methods.
/**
 * A date without a time or timezone, in the ISO calendar or another calendar system.
 */
export const PlainDate: typeof PlainDateTypes.PlainDate = PlainDateValue;
export type PlainDate = PlainDateTypes.PlainDate;
/**
 * A time without a date or timezone.
 */
export const PlainTime: typeof PlainTimeTypes.PlainTime = PlainTimeValue;
export type PlainTime = PlainTimeTypes.PlainTime;
/**
 * A date and time without a timezone, in the ISO calendar or another calendar system.
 */
export const PlainDateTime: typeof PlainDateTimeTypes.PlainDateTime = PlainDateTimeValue;
export type PlainDateTime = PlainDateTimeTypes.PlainDateTime;
/**
 * A date and time in a specific timezone, in the ISO calendar or another calendar system.
 */
export const ZonedDateTime: typeof ZonedDateTimeTypes.ZonedDateTime = ZonedDateTimeValue;
export type ZonedDateTime = ZonedDateTimeTypes.ZonedDateTime;
