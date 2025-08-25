"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testCalculations = void 0;
var pickers_1 = require("test/utils/pickers");
var describeGregorianAdapter_utils_1 = require("./describeGregorianAdapter.utils");
/**
 * To check if the date has the right offset even after changing its date parts,
 * we convert it to a different timezone that always has the same offset,
 * then we check that both dates have the same hour value.
 */
// We change to
var expectSameTimeInMonacoTZ = function (adapter, value) {
    var valueInMonacoTz = adapter.setTimezone(value, 'Europe/Monaco');
    expect(adapter.getHours(value)).to.equal(adapter.getHours(valueInMonacoTz));
};
var testCalculations = function (_a) {
    var adapter = _a.adapter, adapterTZ = _a.adapterTZ, adapterFr = _a.adapterFr, setDefaultTimezone = _a.setDefaultTimezone, getLocaleFromDate = _a.getLocaleFromDate;
    var testDateIso = adapter.date(describeGregorianAdapter_utils_1.TEST_DATE_ISO_STRING);
    var testDateLastNonDSTDay = adapterTZ.isTimezoneCompatible
        ? adapterTZ.date('2022-03-27', 'Europe/Paris')
        : adapterTZ.date('2022-03-27');
    var testDateLocale = adapter.date(describeGregorianAdapter_utils_1.TEST_DATE_LOCALE_STRING);
    describe('Method: date', function () {
        it('should parse ISO strings', function () {
            if (adapter.isTimezoneCompatible) {
                var test = function (timezone, expectedTimezones) {
                    if (expectedTimezones === void 0) { expectedTimezones = timezone; }
                    [adapterTZ, adapterFr].forEach(function (instance) {
                        var dateWithZone = instance.date(describeGregorianAdapter_utils_1.TEST_DATE_ISO_STRING, timezone);
                        expect(instance.getTimezone(dateWithZone)).to.equal(expectedTimezones);
                        // Should keep the time of the value in the UTC timezone
                        expect(dateWithZone).toEqualDateTime(describeGregorianAdapter_utils_1.TEST_DATE_ISO_STRING);
                    });
                };
                test('UTC');
                test('system');
                test('America/New_York');
                test('Europe/Paris');
                setDefaultTimezone('America/New_York');
                test('default', 'America/New_York');
                setDefaultTimezone('Europe/Paris');
                test('default', 'Europe/Paris');
                // Reset to the default timezone
                setDefaultTimezone(undefined);
            }
            else {
                expect(adapter.date(describeGregorianAdapter_utils_1.TEST_DATE_ISO_STRING, 'system')).toEqualDateTime(describeGregorianAdapter_utils_1.TEST_DATE_ISO_STRING);
                expect(adapter.date(describeGregorianAdapter_utils_1.TEST_DATE_ISO_STRING, 'default')).toEqualDateTime(describeGregorianAdapter_utils_1.TEST_DATE_ISO_STRING);
            }
        });
        it('should parse locale strings', function () {
            if (adapter.isTimezoneCompatible) {
                var test = function (timezone) {
                    [adapterTZ, adapterFr].forEach(function (instance) {
                        var dateWithZone = instance.date(describeGregorianAdapter_utils_1.TEST_DATE_LOCALE_STRING, timezone);
                        expect(instance.getTimezone(dateWithZone)).to.equal(timezone);
                        // Should keep the time of the date in the target timezone
                        expect(instance.format(dateWithZone, 'fullTime24h')).to.equal('00:00');
                    });
                };
                test('UTC');
                test('system');
                test('America/New_York');
                test('Europe/Paris');
            }
            else {
                expect(adapter.date(describeGregorianAdapter_utils_1.TEST_DATE_LOCALE_STRING, 'system')).toEqualDateTime(describeGregorianAdapter_utils_1.TEST_DATE_LOCALE_STRING);
            }
        });
        it('should parse null', function () {
            expect(adapter.date(null, 'system')).to.equal(null);
            if (adapter.isTimezoneCompatible) {
                expect(adapter.date(null, 'UTC')).to.equal(null);
                expect(adapter.date(null, 'America/New_York')).to.equal(null);
            }
        });
        it.skipIf(adapterTZ.lib !== 'dayjs')('should parse undefined', function () {
            if (adapter.isTimezoneCompatible) {
                var testTodayZone = function (timezone) {
                    var dateWithZone = adapterTZ.date(undefined, timezone);
                    expect(adapterTZ.getTimezone(dateWithZone)).to.equal(timezone);
                    expect(Math.abs(adapterTZ.toJsDate(dateWithZone).getTime() - Date.now())).to.be.lessThan(5);
                };
                testTodayZone('system');
                testTodayZone('UTC');
                testTodayZone('America/New_York');
            }
            else {
                expect(Math.abs(adapterTZ.toJsDate(adapter.date(undefined, 'system')).getTime() - Date.now())).to.be.lessThan(5);
            }
        });
        it('should work without args', function () {
            var date = adapter.date().valueOf();
            expect(Math.abs(date - Date.now())).to.be.lessThan(5);
        });
    });
    it.skipIf(!adapter.isTimezoneCompatible)('Method: getTimezone', function () {
        var testTimezone = function (timezone, expectedTimezone) {
            if (expectedTimezone === void 0) { expectedTimezone = timezone; }
            expect(adapter.getTimezone(adapter.date(undefined, timezone))).to.equal(expectedTimezone);
        };
        testTimezone('system');
        testTimezone('Europe/Paris');
        testTimezone('America/New_York');
        testTimezone('UTC');
        setDefaultTimezone('America/Chicago');
        testTimezone('default', 'America/Chicago');
        setDefaultTimezone(undefined);
    });
    it.skipIf(!adapter.isTimezoneCompatible)('should not mix Europe/London and UTC in winter', function () {
        var dateWithZone = adapter.date('2023-10-30T11:44:00.000Z', 'Europe/London');
        expect(adapter.getTimezone(dateWithZone)).to.equal('Europe/London');
    });
    it('Method: setTimezone', function () {
        if (adapter.isTimezoneCompatible) {
            var test = function (timezone) {
                setDefaultTimezone(timezone);
                var dateWithLocaleTimezone = adapter.date(describeGregorianAdapter_utils_1.TEST_DATE_ISO_STRING, 'system');
                var dateWithDefaultTimezone = adapter.setTimezone(dateWithLocaleTimezone, 'default');
                expect(adapter.getTimezone(dateWithDefaultTimezone)).to.equal(timezone);
            };
            test('America/New_York');
            test('Europe/Paris');
            // Reset to the default timezone
            setDefaultTimezone(undefined);
        }
        else {
            var systemDate = adapter.date(describeGregorianAdapter_utils_1.TEST_DATE_ISO_STRING, 'system');
            expect(adapter.setTimezone(systemDate, 'default')).toEqualDateTime(systemDate);
            expect(adapter.setTimezone(systemDate, 'system')).toEqualDateTime(systemDate);
            var defaultDate = adapter.date(describeGregorianAdapter_utils_1.TEST_DATE_ISO_STRING, 'default');
            expect(adapter.setTimezone(systemDate, 'default')).toEqualDateTime(defaultDate);
            expect(adapter.setTimezone(systemDate, 'system')).toEqualDateTime(defaultDate);
        }
    });
    it('Method: toJsDate', function () {
        expect(adapter.toJsDate(testDateIso)).to.be.instanceOf(Date);
        expect(adapter.toJsDate(testDateLocale)).to.be.instanceOf(Date);
    });
    it('Method: parse', function () {
        // Date time
        expect(adapter.parse('10/30/2018 11:44', adapter.formats.keyboardDateTime24h)).toEqualDateTime('2018-10-30T11:44:00.000Z');
        // Date
        expect(adapter.parse('10/30/2018', adapter.formats.keyboardDate)).toEqualDateTime('2018-10-30T00:00:00.000Z');
        // Empty string
        expect(adapter.parse('', adapter.formats.keyboardDate)).to.equal(null);
        // Invalid input
        expect(adapter.isValid(adapter.parse('99/99/9999', adapter.formats.keyboardDate))).to.equal(false);
    });
    it('Method: isValid', function () {
        var invalidDate = adapter.date('2018-42-30T11:60:00.000Z');
        expect(adapter.isValid(testDateIso)).to.equal(true);
        expect(adapter.isValid(testDateLocale)).to.equal(true);
        expect(adapter.isValid(invalidDate)).to.equal(false);
        expect(adapter.isValid(null)).to.equal(false);
    });
    describe('Method: isEqual', function () {
        it('should work in the same timezone', function () {
            expect(adapter.isEqual(adapter.date(null), null)).to.equal(true);
            expect(adapter.isEqual(testDateIso, adapter.date(describeGregorianAdapter_utils_1.TEST_DATE_ISO_STRING))).to.equal(true);
            expect(adapter.isEqual(null, testDateIso)).to.equal(false);
            expect(adapter.isEqual(testDateLocale, adapter.date(describeGregorianAdapter_utils_1.TEST_DATE_LOCALE_STRING))).to.equal(true);
            expect(adapter.isEqual(null, testDateLocale)).to.equal(false);
        });
        it.skipIf(!adapter.isTimezoneCompatible)('should work with different timezones', function () {
            var dateInLondonTZ = adapterTZ.setTimezone(testDateIso, 'Europe/London');
            var dateInParisTZ = adapterTZ.setTimezone(testDateIso, 'Europe/Paris');
            expect(adapterTZ.isEqual(dateInLondonTZ, dateInParisTZ)).to.equal(true);
        });
    });
    describe('Method: isSameYear', function () {
        it('should work in the same timezone', function () {
            expect(adapter.isSameYear(testDateIso, adapter.date('2018-10-01T00:00:00.000Z'))).to.equal(true);
            expect(adapter.isSameYear(testDateIso, adapter.date('2019-10-01T00:00:00.000Z'))).to.equal(false);
            expect(adapter.isSameYear(testDateLocale, adapter.date('2018-10-01T00:00:00.000Z'))).to.equal(true);
            expect(adapter.isSameYear(testDateLocale, adapter.date('2019-10-01T00:00:00.000Z'))).to.equal(false);
        });
        it.skipIf(!adapter.isTimezoneCompatible)('should work with different timezones', function () {
            // Both dates below have the same timestamp, but they are not in the same year when represented in their respective timezone.
            // The adapter should still consider that they are in the same year.
            var dateInLondonTZ = adapterTZ.endOfYear(adapterTZ.setTimezone(testDateIso, 'Europe/London'));
            var dateInParisTZ = adapterTZ.setTimezone(dateInLondonTZ, 'Europe/Paris');
            expect(adapterTZ.isSameYear(dateInLondonTZ, dateInParisTZ)).to.equal(true);
            expect(adapterTZ.isSameYear(dateInParisTZ, dateInLondonTZ)).to.equal(true);
        });
    });
    describe('Method: isSameMonth', function () {
        it('should work in the same timezone', function () {
            expect(adapter.isSameMonth(testDateIso, adapter.date('2018-10-01T00:00:00.000Z'))).to.equal(true);
            expect(adapter.isSameMonth(testDateIso, adapter.date('2019-10-01T00:00:00.000Z'))).to.equal(false);
            expect(adapter.isSameMonth(testDateLocale, adapter.date('2018-10-01T00:00:00.000Z'))).to.equal(true);
            expect(adapter.isSameMonth(testDateLocale, adapter.date('2019-10-01T00:00:00.000Z'))).to.equal(false);
        });
        it.skipIf(!adapter.isTimezoneCompatible)('should work with different timezones', function () {
            // Both dates below have the same timestamp, but they are not in the same month when represented in their respective timezone.
            // The adapter should still consider that they are in the same month.
            var dateInLondonTZ = adapterTZ.endOfMonth(adapterTZ.setTimezone(testDateIso, 'Europe/London'));
            var dateInParisTZ = adapterTZ.setTimezone(dateInLondonTZ, 'Europe/Paris');
            expect(adapterTZ.isSameMonth(dateInLondonTZ, dateInParisTZ)).to.equal(true);
            expect(adapterTZ.isSameMonth(dateInParisTZ, dateInLondonTZ)).to.equal(true);
        });
    });
    describe('Method: isSameDay', function () {
        it('should work in the same timezone', function () {
            expect(adapter.isSameDay(testDateIso, adapter.date('2018-10-30T00:00:00.000Z'))).to.equal(true);
            expect(adapter.isSameDay(testDateIso, adapter.date('2019-10-30T00:00:00.000Z'))).to.equal(false);
            expect(adapter.isSameDay(testDateLocale, adapter.date('2018-10-30T00:00:00.000Z'))).to.equal(true);
            expect(adapter.isSameDay(testDateLocale, adapter.date('2019-10-30T00:00:00.000Z'))).to.equal(false);
        });
        it.skipIf(!adapter.isTimezoneCompatible)('should work with different timezones', function () {
            // Both dates below have the same timestamp, but they are not in the same day when represented in their respective timezone.
            // The adapter should still consider that they are in the same day.
            var dateInLondonTZ = adapterTZ.endOfDay(adapterTZ.setTimezone(testDateIso, 'Europe/London'));
            var dateInParisTZ = adapterTZ.setTimezone(dateInLondonTZ, 'Europe/Paris');
            expect(adapterTZ.isSameDay(dateInLondonTZ, dateInParisTZ)).to.equal(true);
            expect(adapterTZ.isSameDay(dateInParisTZ, dateInLondonTZ)).to.equal(true);
        });
    });
    describe('Method: isSameHour', function () {
        it('should work in the same timezone', function () {
            expect(adapter.isSameHour(testDateIso, adapter.date('2018-10-30T11:00:00.000Z'))).to.equal(true);
            expect(adapter.isSameHour(testDateIso, adapter.date('2018-10-30T12:00:00.000Z'))).to.equal(false);
        });
        it.skipIf(!adapter.isTimezoneCompatible)('should work with different timezones', function () {
            // Both dates below have the same timestamp, but they are not in the same day when represented in their respective timezone.
            // The adapter should still consider that they are in the same day.
            var dateInLondonTZ = adapterTZ.setTimezone(testDateIso, 'Europe/London');
            var dateInParisTZ = adapterTZ.setTimezone(dateInLondonTZ, 'Europe/Paris');
            expect(adapterTZ.isSameHour(dateInLondonTZ, dateInParisTZ)).to.equal(true);
            expect(adapterTZ.isSameHour(dateInParisTZ, dateInLondonTZ)).to.equal(true);
        });
    });
    describe('Method: isAfter', function () {
        it('should work with the same timezone', function () {
            expect(adapter.isAfter(adapter.date(), testDateIso)).to.equal(true);
            expect(adapter.isAfter(testDateIso, adapter.date())).to.equal(false);
            expect(adapter.isAfter(adapter.date(), testDateLocale)).to.equal(true);
            expect(adapter.isAfter(testDateLocale, adapter.date())).to.equal(false);
        });
        it.skipIf(!adapter.isTimezoneCompatible)('should work with different timezones', function () {
            var dateInLondonTZ = adapterTZ.endOfDay(adapterTZ.setTimezone(testDateIso, 'Europe/London'));
            var dateInParisTZ = adapterTZ.addMinutes(adapterTZ.endOfDay(adapterTZ.setTimezone(testDateIso, 'Europe/Paris')), 30);
            expect(adapter.isAfter(dateInLondonTZ, dateInParisTZ)).to.equal(true);
            expect(adapter.isAfter(dateInParisTZ, dateInLondonTZ)).to.equal(false);
        });
    });
    describe('Method: isAfterYear', function () {
        it('should work in the same timezone', function () {
            var nextYearIso = adapter.addYears(testDateIso, 1);
            expect(adapter.isAfterYear(nextYearIso, testDateIso)).to.equal(true);
            expect(adapter.isAfterYear(testDateIso, nextYearIso)).to.equal(false);
            var nextYearLocale = adapter.addYears(testDateLocale, 1);
            expect(adapter.isAfterYear(nextYearLocale, testDateLocale)).to.equal(true);
            expect(adapter.isAfterYear(testDateLocale, nextYearLocale)).to.equal(false);
        });
        it.skipIf(!adapter.isTimezoneCompatible)('should work with different timezones', function () {
            // Both dates below have the same timestamp, but they are not in the same year when represented in their respective timezone.
            // The adapter should still consider that they are in the same year.
            var dateInLondonTZ = adapterTZ.endOfYear(adapterTZ.setTimezone(testDateIso, 'Europe/London'));
            var dateInParisTZ = adapterTZ.setTimezone(dateInLondonTZ, 'Europe/Paris');
            expect(adapterTZ.isAfterYear(dateInLondonTZ, dateInParisTZ)).to.equal(false);
            expect(adapterTZ.isAfterYear(dateInParisTZ, dateInLondonTZ)).to.equal(false);
        });
    });
    describe('Method: isAfterDay', function () {
        it('should work with the same timezone', function () {
            var nextDayIso = adapter.addDays(testDateIso, 1);
            expect(adapter.isAfterDay(nextDayIso, testDateIso)).to.equal(true);
            expect(adapter.isAfterDay(testDateIso, nextDayIso)).to.equal(false);
            var nextDayLocale = adapter.addDays(testDateLocale, 1);
            expect(adapter.isAfterDay(nextDayLocale, testDateLocale)).to.equal(true);
            expect(adapter.isAfterDay(testDateLocale, nextDayLocale)).to.equal(false);
        });
        it.skipIf(!adapter.isTimezoneCompatible)('should work with different timezones', function () {
            // Both dates below have the same timestamp, but they are not in the same day when represented in their respective timezone.
            // The adapter should still consider that they are in the same day.
            var dateInLondonTZ = adapterTZ.endOfDay(adapterTZ.setTimezone(testDateIso, 'Europe/London'));
            var dateInParisTZ = adapterTZ.setTimezone(dateInLondonTZ, 'Europe/Paris');
            expect(adapterTZ.isAfterDay(dateInLondonTZ, dateInParisTZ)).to.equal(false);
            expect(adapterTZ.isAfterDay(dateInParisTZ, dateInLondonTZ)).to.equal(false);
            // Both dates below have the same day when represented in their respective timezone,
            // But not when represented in the same timezone
            // The adapter should consider that they are not in the same day
            var dateInLondonTZ2 = adapterTZ.startOfDay(adapterTZ.setTimezone(testDateIso, 'Europe/London'));
            var dateInParisTZ2 = adapterTZ.addHours(adapterTZ.setTimezone(dateInLondonTZ2, 'Europe/Paris'), -1);
            expect(adapterTZ.isAfterDay(dateInLondonTZ2, dateInParisTZ2)).to.equal(true);
            expect(adapterTZ.isAfterDay(dateInParisTZ2, dateInLondonTZ2)).to.equal(false);
        });
    });
    describe('Method: isBefore', function () {
        it('should work with the same timezone', function () {
            expect(adapter.isBefore(testDateIso, adapter.date())).to.equal(true);
            expect(adapter.isBefore(adapter.date(), testDateIso)).to.equal(false);
            expect(adapter.isBefore(testDateLocale, adapter.date())).to.equal(true);
            expect(adapter.isBefore(adapter.date(), testDateLocale)).to.equal(false);
        });
        it.skipIf(!adapter.isTimezoneCompatible)('should work with different timezones', function () {
            var dateInLondonTZ = adapterTZ.endOfDay(adapterTZ.setTimezone(testDateIso, 'Europe/London'));
            var dateInParisTZ = adapterTZ.addMinutes(adapterTZ.endOfDay(adapterTZ.setTimezone(testDateIso, 'Europe/Paris')), 30);
            expect(adapter.isBefore(dateInLondonTZ, dateInParisTZ)).to.equal(false);
            expect(adapter.isBefore(dateInParisTZ, dateInLondonTZ)).to.equal(true);
        });
    });
    describe('Method: isBeforeYear', function () {
        it('should work in the same timezone', function () {
            var nextYearIso = adapter.addYears(testDateIso, -1);
            expect(adapter.isBeforeYear(nextYearIso, testDateIso)).to.equal(true);
            expect(adapter.isBeforeYear(testDateIso, nextYearIso)).to.equal(false);
            var nextYearLocale = adapter.addYears(testDateLocale, -1);
            expect(adapter.isBeforeYear(nextYearLocale, testDateLocale)).to.equal(true);
            expect(adapter.isBeforeYear(testDateLocale, nextYearLocale)).to.equal(false);
        });
        it.skipIf(!adapter.isTimezoneCompatible)('should work with different timezones', function () {
            // Both dates below have the same timestamp, but they are not in the same year when represented in their respective timezone.
            // The adapter should still consider that they are in the same year.
            var dateInLondonTZ = adapterTZ.endOfYear(adapterTZ.setTimezone(testDateIso, 'Europe/London'));
            var dateInParisTZ = adapterTZ.setTimezone(dateInLondonTZ, 'Europe/Paris');
            expect(adapterTZ.isBeforeYear(dateInLondonTZ, dateInParisTZ)).to.equal(false);
            expect(adapterTZ.isBeforeYear(dateInParisTZ, dateInLondonTZ)).to.equal(false);
        });
    });
    describe('Method: isBeforeDay', function () {
        it('should work with the same timezone', function () {
            var previousDayIso = adapter.addDays(testDateIso, -1);
            expect(adapter.isBeforeDay(previousDayIso, testDateIso)).to.equal(true);
            expect(adapter.isBeforeDay(testDateIso, previousDayIso)).to.equal(false);
            var previousDayLocale = adapter.addDays(testDateLocale, -1);
            expect(adapter.isBeforeDay(previousDayLocale, testDateLocale)).to.equal(true);
            expect(adapter.isBeforeDay(testDateLocale, previousDayLocale)).to.equal(false);
        });
        it.skipIf(!adapter.isTimezoneCompatible)('should work with different timezones', function () {
            // Both dates below have the same timestamp, but they are not in the same day when represented in their respective timezone.
            // The adapter should still consider that they are in the same day.
            var dateInLondonTZ = adapterTZ.endOfDay(adapterTZ.setTimezone(testDateIso, 'Europe/London'));
            var dateInParisTZ = adapterTZ.setTimezone(dateInLondonTZ, 'Europe/Paris');
            expect(adapterTZ.isBeforeDay(dateInLondonTZ, dateInParisTZ)).to.equal(false);
            expect(adapterTZ.isBeforeDay(dateInParisTZ, dateInLondonTZ)).to.equal(false);
            // Both dates below have the same day when represented in their respective timezone,
            // But not when represented in the same timezone
            // The adapter should consider that they are not in the same day
            var dateInLondonTZ2 = adapterTZ.endOfDay(adapterTZ.setTimezone(testDateIso, 'Europe/London'));
            var dateInParisTZ2 = adapterTZ.addHours(adapterTZ.setTimezone(dateInLondonTZ2, 'Europe/Paris'), -1);
            expect(adapterTZ.isBeforeDay(dateInLondonTZ2, dateInParisTZ2)).to.equal(false);
            expect(adapterTZ.isBeforeDay(dateInParisTZ2, dateInLondonTZ2)).to.equal(true);
        });
    });
    describe('Method: isWithinRange', function () {
        it('should work on simple examples', function () {
            expect(adapter.isWithinRange(adapter.date('2019-10-01T00:00:00.000Z'), [
                adapter.date('2019-09-01T00:00:00.000Z'),
                adapter.date('2019-11-01T00:00:00.000Z'),
            ])).to.equal(true);
            expect(adapter.isWithinRange(adapter.date('2019-12-01T00:00:00.000Z'), [
                adapter.date('2019-09-01T00:00:00.000Z'),
                adapter.date('2019-11-01T00:00:00.000Z'),
            ])).to.equal(false);
            expect(adapter.isWithinRange(adapter.date('2019-10-01'), [
                adapter.date('2019-09-01'),
                adapter.date('2019-11-01'),
            ])).to.equal(true);
            expect(adapter.isWithinRange(adapter.date('2019-12-01'), [
                adapter.date('2019-09-01'),
                adapter.date('2019-11-01'),
            ])).to.equal(false);
        });
        it('should use inclusiveness of range', function () {
            expect(adapter.isWithinRange(adapter.date('2019-09-01T00:00:00.000Z'), [
                adapter.date('2019-09-01T00:00:00.000Z'),
                adapter.date('2019-12-01T00:00:00.000Z'),
            ])).to.equal(true);
            expect(adapter.isWithinRange(adapter.date('2019-12-01T00:00:00.000Z'), [
                adapter.date('2019-09-01T00:00:00.000Z'),
                adapter.date('2019-12-01T00:00:00.000Z'),
            ])).to.equal(true);
            expect(adapter.isWithinRange(adapter.date('2019-09-01'), [
                adapter.date('2019-09-01'),
                adapter.date('2019-12-01'),
            ])).to.equal(true);
            expect(adapter.isWithinRange(adapter.date('2019-12-01'), [
                adapter.date('2019-09-01'),
                adapter.date('2019-12-01'),
            ])).to.equal(true);
        });
        it('should be equal with values in different locales', function () {
            expect(adapter.isWithinRange(adapter.date('2022-04-17'), [
                adapterFr.date('2022-04-17'),
                adapterFr.date('2022-04-19'),
            ])).to.equal(true);
        });
    });
    it('Method: startOfYear', function () {
        var expected = '2018-01-01T00:00:00.000Z';
        expect(adapter.startOfYear(testDateIso)).toEqualDateTime(expected);
        expect(adapter.startOfYear(testDateLocale)).toEqualDateTime(expected);
    });
    it('Method: startOfMonth', function () {
        var expected = '2018-10-01T00:00:00.000Z';
        expect(adapter.startOfMonth(testDateIso)).toEqualDateTime(expected);
        expect(adapter.startOfMonth(testDateLocale)).toEqualDateTime(expected);
    });
    it('Method: startOfWeek', function () {
        expect(adapter.startOfWeek(testDateIso)).toEqualDateTime('2018-10-28T00:00:00.000Z');
        expect(adapter.startOfWeek(testDateLocale)).toEqualDateTime('2018-10-28T00:00:00.000Z');
    });
    it('Method: startOfDay', function () {
        var expected = '2018-10-30T00:00:00.000Z';
        expect(adapter.startOfDay(testDateIso)).toEqualDateTime(expected);
        expect(adapter.startOfDay(testDateLocale)).toEqualDateTime(expected);
    });
    it('Method: endOfYear', function () {
        var expected = '2018-12-31T23:59:59.999Z';
        expect(adapter.endOfYear(testDateIso)).toEqualDateTime(expected);
        expect(adapter.endOfYear(testDateLocale)).toEqualDateTime(expected);
    });
    describe('Method: endOfMonth', function () {
        it('should handle basic usecases', function () {
            var expected = '2018-10-31T23:59:59.999Z';
            expect(adapter.endOfMonth(testDateIso)).toEqualDateTime(expected);
            expect(adapter.endOfMonth(testDateLocale)).toEqualDateTime(expected);
        });
        it.skipIf(!adapter.isTimezoneCompatible)('should update the offset when entering DST', function () {
            expectSameTimeInMonacoTZ(adapterTZ, testDateLastNonDSTDay);
            expectSameTimeInMonacoTZ(adapterTZ, adapterTZ.endOfMonth(testDateLastNonDSTDay));
        });
    });
    it('Method: endOfWeek', function () {
        expect(adapter.endOfWeek(testDateIso)).toEqualDateTime('2018-11-03T23:59:59.999Z');
        expect(adapter.endOfWeek(testDateLocale)).toEqualDateTime('2018-11-03T23:59:59.999Z');
    });
    it('Method: endOfDay', function () {
        var expected = '2018-10-30T23:59:59.999Z';
        expect(adapter.endOfDay(testDateIso)).toEqualDateTime(expected);
        expect(adapter.endOfDay(testDateLocale)).toEqualDateTime(expected);
    });
    it('Method: addYears', function () {
        expect(adapter.addYears(testDateIso, 2)).toEqualDateTime('2020-10-30T11:44:00.000Z');
        expect(adapter.addYears(testDateIso, -2)).toEqualDateTime('2016-10-30T11:44:00.000Z');
    });
    describe('Method: addMonths', function () {
        it('should handle basic usecases', function () {
            expect(adapter.addMonths(testDateIso, 2)).toEqualDateTime('2018-12-30T11:44:00.000Z');
            expect(adapter.addMonths(testDateIso, -2)).toEqualDateTime('2018-08-30T11:44:00.000Z');
            expect(adapter.addMonths(testDateIso, 3)).toEqualDateTime('2019-01-30T11:44:00.000Z');
        });
        it.skipIf(!adapter.isTimezoneCompatible)('should update the offset when entering DST', function () {
            expectSameTimeInMonacoTZ(adapterTZ, testDateLastNonDSTDay);
            expectSameTimeInMonacoTZ(adapterTZ, adapterTZ.addMonths(testDateLastNonDSTDay, 1));
        });
    });
    describe('Method: addWeeks', function () {
        it('should handle basic usecases', function () {
            expect(adapter.addWeeks(testDateIso, 2)).toEqualDateTime('2018-11-13T11:44:00.000Z');
            expect(adapter.addWeeks(testDateIso, -2)).toEqualDateTime('2018-10-16T11:44:00.000Z');
        });
        it.skipIf(!adapter.isTimezoneCompatible)('should update the offset when entering DST', function () {
            expectSameTimeInMonacoTZ(adapterTZ, testDateLastNonDSTDay);
            expectSameTimeInMonacoTZ(adapterTZ, adapterTZ.addWeeks(testDateLastNonDSTDay, 1));
        });
    });
    describe('Method: addDays', function () {
        it('should handle basic usecases', function () {
            expect(adapter.addDays(testDateIso, 2)).toEqualDateTime('2018-11-01T11:44:00.000Z');
            expect(adapter.addDays(testDateIso, -2)).toEqualDateTime('2018-10-28T11:44:00.000Z');
        });
        it.skipIf(!adapter.isTimezoneCompatible)('should update the offset when entering DST', function () {
            expectSameTimeInMonacoTZ(adapterTZ, testDateLastNonDSTDay);
            expectSameTimeInMonacoTZ(adapterTZ, adapterTZ.addDays(testDateLastNonDSTDay, 1));
        });
    });
    it('Method: addHours', function () {
        expect(adapter.addHours(testDateIso, 2)).toEqualDateTime('2018-10-30T13:44:00.000Z');
        expect(adapter.addHours(testDateIso, -2)).toEqualDateTime('2018-10-30T09:44:00.000Z');
        expect(adapter.addHours(testDateIso, 15)).toEqualDateTime('2018-10-31T02:44:00.000Z');
    });
    it('Method: addMinutes', function () {
        expect(adapter.addMinutes(testDateIso, 2)).toEqualDateTime('2018-10-30T11:46:00.000Z');
        expect(adapter.addMinutes(testDateIso, -2)).toEqualDateTime('2018-10-30T11:42:00.000Z');
        expect(adapter.addMinutes(testDateIso, 20)).toEqualDateTime('2018-10-30T12:04:00.000Z');
    });
    it('Method: addSeconds', function () {
        expect(adapter.addSeconds(testDateIso, 2)).toEqualDateTime('2018-10-30T11:44:02.000Z');
        expect(adapter.addSeconds(testDateIso, -2)).toEqualDateTime('2018-10-30T11:43:58.000Z');
        expect(adapter.addSeconds(testDateIso, 70)).toEqualDateTime('2018-10-30T11:45:10.000Z');
    });
    it('Method: getYear', function () {
        expect(adapter.getYear(testDateIso)).to.equal(2018);
    });
    it('Method: getMonth', function () {
        expect(adapter.getMonth(testDateIso)).to.equal(9);
    });
    it('Method: getDate', function () {
        expect(adapter.getDate(testDateIso)).to.equal(30);
    });
    it('Method: getHours', function () {
        expect(adapter.getHours(testDateIso)).to.equal(11);
    });
    it('Method: getMinutes', function () {
        expect(adapter.getMinutes(testDateIso)).to.equal(44);
    });
    it('Method: getSeconds', function () {
        expect(adapter.getSeconds(testDateIso)).to.equal(0);
    });
    it('Method: getMilliseconds', function () {
        expect(adapter.getMilliseconds(testDateIso)).to.equal(0);
    });
    it('Method: setYear', function () {
        expect(adapter.setYear(testDateIso, 2011)).toEqualDateTime('2011-10-30T11:44:00.000Z');
    });
    it('Method: setMonth', function () {
        expect(adapter.setMonth(testDateIso, 4)).toEqualDateTime('2018-05-30T11:44:00.000Z');
    });
    it('Method: setDate', function () {
        expect(adapter.setDate(testDateIso, 15)).toEqualDateTime('2018-10-15T11:44:00.000Z');
    });
    it('Method: setHours', function () {
        expect(adapter.setHours(testDateIso, 0)).toEqualDateTime('2018-10-30T00:44:00.000Z');
    });
    it('Method: setMinutes', function () {
        expect(adapter.setMinutes(testDateIso, 12)).toEqualDateTime('2018-10-30T11:12:00.000Z');
    });
    it('Method: setSeconds', function () {
        expect(adapter.setSeconds(testDateIso, 11)).toEqualDateTime('2018-10-30T11:44:11.000Z');
    });
    it('Method: setMilliseconds', function () {
        expect(adapter.setMilliseconds(testDateIso, 11)).toEqualDateTime('2018-10-30T11:44:00.011Z');
    });
    it('Method: getDaysInMonth', function () {
        expect(adapter.getDaysInMonth(testDateIso)).to.equal(31);
        expect(adapter.getDaysInMonth(testDateLocale)).to.equal(31);
        expect(adapter.getDaysInMonth(adapter.addMonths(testDateIso, 1))).to.equal(30);
    });
    it('Method: getDayOfWeek', function () {
        expect(adapter.getDayOfWeek(testDateIso)).to.equal(3);
    });
    describe('Method: getWeekArray', function () {
        it('should work without timezones', function () {
            var weekArray = adapter.getWeekArray(testDateIso);
            var expectedDate = adapter.startOfWeek(adapter.startOfMonth(testDateIso));
            expect(weekArray).to.have.length(5);
            weekArray.forEach(function (week) {
                expect(week).to.have.length(7);
                week.forEach(function (day) {
                    expect(day).toEqualDateTime(expectedDate);
                    expectedDate = adapter.addDays(expectedDate, 1);
                });
            });
        });
        it.skipIf(!adapter.isTimezoneCompatible)('should respect the DST', function () {
            var referenceDate = adapterTZ.date('2022-03-17', 'Europe/Paris');
            var weekArray = adapterTZ.getWeekArray(referenceDate);
            var expectedDate = adapter.startOfWeek(adapter.startOfMonth(referenceDate));
            expect(weekArray).to.have.length(5);
            weekArray.forEach(function (week) {
                expect(week).to.have.length(7);
                week.forEach(function (day) {
                    expect(adapterTZ.startOfDay(day)).toEqualDateTime(adapterTZ.startOfDay(expectedDate));
                    expectedDate = adapterTZ.addDays(expectedDate, 1);
                    expect((0, pickers_1.getDateOffset)(adapterTZ, day)).to.equal(adapterTZ.isAfter(day, testDateLastNonDSTDay) ? 120 : 60);
                });
            });
        });
        it('should respect the locale of the adapter, not the locale of the date', function () {
            var dateFr = adapterFr.date('2022-03-17', 'default');
            var weekArray = adapter.getWeekArray(dateFr);
            if (getLocaleFromDate) {
                expect(getLocaleFromDate(weekArray[0][0])).to.match(/en/);
            }
            // Week should start on Monday (28th of March).
            expect(adapter.getDate(weekArray[0][0])).to.equal(27);
        });
    });
    it('Method: getWeekNumber', function () {
        expect(adapter.getWeekNumber(testDateIso)).to.equal(44);
    });
    it('Method: getYearRange', function () {
        var yearRange = adapter.getYearRange([testDateIso, adapter.setYear(testDateIso, 2124)]);
        expect(yearRange).to.have.length(107);
        expect(adapter.getYear(yearRange[yearRange.length - 1])).to.equal(2124);
        var emptyYearRange = adapter.getYearRange([
            testDateIso,
            adapter.setYear(testDateIso, adapter.getYear(testDateIso) - 1),
        ]);
        expect(emptyYearRange).to.have.length(0);
    });
};
exports.testCalculations = testCalculations;
