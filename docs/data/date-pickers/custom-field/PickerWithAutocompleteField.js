import * as React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function AutocompleteField(props) {
  const {
    label,
    disabled,
    readOnly,
    id,
    value,
    onChange,
    InputProps: { ref, startAdornment, endAdornment } = {},
    inputProps,
    options = [],
  } = props;

  const mergeAdornments = (...adornments) => {
    const nonNullAdornments = adornments.filter((el) => el != null);
    if (nonNullAdornments.length === 0) {
      return null;
    }

    if (nonNullAdornments.length === 1) {
      return nonNullAdornments[0];
    }

    return <Stack direction="row">{nonNullAdornments}</Stack>;
  };

  return (
    <Autocomplete
      id={id}
      options={options}
      disabled={disabled}
      readOnly={readOnly}
      ref={ref}
      sx={{ minWidth: 250 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          inputProps={{ ...params.inputProps, ...inputProps }}
          InputProps={{
            ...params.InputProps,
            startAdornment: mergeAdornments(
              startAdornment,
              params.InputProps.startAdornment,
            ),
            endAdornment: mergeAdornments(
              endAdornment,
              params.InputProps.endAdornment,
            ),
          }}
        />
      )}
      getOptionLabel={(option) => {
        if (!dayjs.isDayjs(option)) {
          return '';
        }

        return option.format('MM / DD / YYYY');
      }}
      value={value}
      onChange={(_, newValue) => {
        onChange?.(newValue, { validationError: null });
      }}
      isOptionEqualToValue={(option, valueToCheck) =>
        option.toISOString() === valueToCheck.toISOString()
      }
    />
  );
}

AutocompleteField.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string,
  inputProps: PropTypes.shape({
    'aria-label': PropTypes.string,
  }),
  InputProps: PropTypes.shape({
    endAdornment: PropTypes.node,
    startAdornment: PropTypes.node,
  }),
  label: PropTypes.node,
  /**
   * Callback fired when the value changes.
   * @template TValue The value type. Will be either the same type as `value` or `null`. Can be in `[start, end]` format in case of range value.
   * @template TError The validation error type. Will be either `string` or a `null`. Can be in `[start, end]` format in case of range value.
   * @param {TValue} value The new value.
   * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
   */
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * Returns a cloned Day.js object with a specified amount of time added.
       * ```
       * dayjs().add(7, 'day')// => Dayjs
       * ```
       * Units are case insensitive, and support plural and short forms.
       *
       * Docs: https://day.js.org/docs/en/manipulate/add
       */
      add: PropTypes.func.isRequired,
      /**
       * All Day.js objects are immutable. Still, `dayjs#clone` can create a clone of the current object if you need one.
       * ```
       * dayjs().clone()// => Dayjs
       * dayjs(dayjs('2019-01-25')) // passing a Dayjs object to a constructor will also clone it
       * ```
       * Docs: https://day.js.org/docs/en/parse/dayjs-clone
       */
      clone: PropTypes.func.isRequired,
      /**
       * Get the date of the month.
       * ```
       * dayjs().date()// => 1-31
       * ```
       * Docs: https://day.js.org/docs/en/get-set/date
       */
      date: PropTypes.func.isRequired,
      /**
       * Get the day of the week.
       *
       * Returns numbers from 0 (Sunday) to 6 (Saturday).
       * ```
       * dayjs().day()// 0-6
       * ```
       * Docs: https://day.js.org/docs/en/get-set/day
       */
      day: PropTypes.func.isRequired,
      /**
       * Get the number of days in the current month.
       * ```
       * dayjs('2019-01-25').daysInMonth() // 31
       * ```
       * Docs: https://day.js.org/docs/en/display/days-in-month
       */
      daysInMonth: PropTypes.func.isRequired,
      /**
       * This indicates the difference between two date-time in the specified unit.
       *
       * To get the difference in milliseconds, use `dayjs#diff`
       * ```
       * const date1 = dayjs('2019-01-25')
       * const date2 = dayjs('2018-06-05')
       * date1.diff(date2) // 20214000000 default milliseconds
       * date1.diff() // milliseconds to current time
       * ```
       *
       * To get the difference in another unit of measurement, pass that measurement as the second argument.
       * ```
       * const date1 = dayjs('2019-01-25')
       * date1.diff('2018-06-05', 'month') // 7
       * ```
       * Units are case insensitive, and support plural and short forms.
       *
       * Docs: https://day.js.org/docs/en/display/difference
       */
      diff: PropTypes.func.isRequired,
      /**
       * Returns a cloned Day.js object and set it to the end of a unit of time.
       * ```
       * dayjs().endOf('month')// => Dayjs
       * ```
       * Units are case insensitive, and support plural and short forms.
       *
       * Docs: https://day.js.org/docs/en/manipulate/end-of
       */
      endOf: PropTypes.func.isRequired,
      /**
       * Get the formatted date according to the string of tokens passed in.
       *
       * To escape characters, wrap them in square brackets (e.g. [MM]).
       * ```
       * dayjs().format()// => current date in ISO8601, without fraction seconds e.g. '2020-04-02T08:02:17-05:00'
       * dayjs('2019-01-25').format('[YYYYescape] YYYY-MM-DDTHH:mm:ssZ[Z]')// 'YYYYescape 2019-01-25T00:00:00-02:00Z'
       * dayjs('2019-01-25').format('DD/MM/YYYY') // '25/01/2019'
       * ```
       * Docs: https://day.js.org/docs/en/display/format
       */
      format: PropTypes.func.isRequired,
      /**
       * String getter, returns the corresponding information getting from Day.js object.
       *
       * In general:
       * ```
       * dayjs().get(unit) === dayjs()[unit]()
       * ```
       * Units are case insensitive, and support plural and short forms.
       * ```
       * dayjs().get('year')
       * dayjs().get('month') // start 0
       * dayjs().get('date')
       * ```
       * Docs: https://day.js.org/docs/en/get-set/get
       */
      get: PropTypes.func.isRequired,
      /**
       * Get the hour.
       * ```
       * dayjs().hour()// => 0-23
       * ```
       * Docs: https://day.js.org/docs/en/get-set/hour
       */
      hour: PropTypes.func.isRequired,
      /**
       * This indicates whether the Day.js object is after the other supplied date-time.
       * ```
       * dayjs().isAfter(dayjs('2011-01-01')) // default milliseconds
       * ```
       * If you want to limit the granularity to a unit other than milliseconds, pass it as the second parameter.
       * ```
       * dayjs().isAfter('2011-01-01', 'year')// => boolean
       * ```
       * Units are case insensitive, and support plural and short forms.
       *
       * Docs: https://day.js.org/docs/en/query/is-after
       */
      isAfter: PropTypes.func.isRequired,
      /**
       * This indicates whether the Day.js object is before the other supplied date-time.
       * ```
       * dayjs().isBefore(dayjs('2011-01-01')) // default milliseconds
       * ```
       * If you want to limit the granularity to a unit other than milliseconds, pass it as the second parameter.
       * ```
       * dayjs().isBefore('2011-01-01', 'year')// => boolean
       * ```
       * Units are case insensitive, and support plural and short forms.
       *
       * Docs: https://day.js.org/docs/en/query/is-before
       */
      isBefore: PropTypes.func.isRequired,
      isBetween: PropTypes.func.isRequired,
      /**
       * This indicates whether the Day.js object is the same as the other supplied date-time.
       * ```
       * dayjs().isSame(dayjs('2011-01-01')) // default milliseconds
       * ```
       * If you want to limit the granularity to a unit other than milliseconds, pass it as the second parameter.
       * ```
       * dayjs().isSame('2011-01-01', 'year')// => boolean
       * ```
       * Docs: https://day.js.org/docs/en/query/is-same
       */
      isSame: PropTypes.func.isRequired,
      isUTC: PropTypes.func.isRequired,
      /**
       * This returns a `boolean` indicating whether the Day.js object contains a valid date or not.
       * ```
       * dayjs().isValid()// => boolean
       * ```
       * Docs: https://day.js.org/docs/en/parse/is-valid
       */
      isValid: PropTypes.func.isRequired,
      local: PropTypes.func.isRequired,
      locale: PropTypes.func.isRequired,
      /**
       * Get the milliseconds.
       * ```
       * dayjs().millisecond()// => 0-999
       * ```
       * Docs: https://day.js.org/docs/en/get-set/millisecond
       */
      millisecond: PropTypes.func.isRequired,
      /**
       * Get the minutes.
       * ```
       * dayjs().minute()// => 0-59
       * ```
       * Docs: https://day.js.org/docs/en/get-set/minute
       */
      minute: PropTypes.func.isRequired,
      /**
       * Get the month.
       *
       * Months are zero indexed, so January is month 0.
       * ```
       * dayjs().month()// => 0-11
       * ```
       * Docs: https://day.js.org/docs/en/get-set/month
       */
      month: PropTypes.func.isRequired,
      /**
       * Get the seconds.
       * ```
       * dayjs().second()// => 0-59
       * ```
       * Docs: https://day.js.org/docs/en/get-set/second
       */
      second: PropTypes.func.isRequired,
      /**
       * Generic setter, accepting unit as first argument, and value as second, returns a new instance with the applied changes.
       *
       * In general:
       * ```
       * dayjs().set(unit, value) === dayjs()[unit](value)
       * ```
       * Units are case insensitive, and support plural and short forms.
       * ```
       * dayjs().set('date', 1)
       * dayjs().set('month', 3) // April
       * dayjs().set('second', 30)
       * ```
       * Docs: https://day.js.org/docs/en/get-set/set
       */
      set: PropTypes.func.isRequired,
      /**
       * Returns a cloned Day.js object and set it to the start of a unit of time.
       * ```
       * dayjs().startOf('year')// => Dayjs
       * ```
       * Units are case insensitive, and support plural and short forms.
       *
       * Docs: https://day.js.org/docs/en/manipulate/start-of
       */
      startOf: PropTypes.func.isRequired,
      /**
       * Returns a cloned Day.js object with a specified amount of time subtracted.
       * ```
       * dayjs().subtract(7, 'year')// => Dayjs
       * ```
       * Units are case insensitive, and support plural and short forms.
       *
       * Docs: https://day.js.org/docs/en/manipulate/subtract
       */
      subtract: PropTypes.func.isRequired,
      /**
       * To get a copy of the native `Date` object parsed from the Day.js object use `dayjs#toDate`.
       * ```
       * dayjs('2019-01-25').toDate()// => Date
       * ```
       */
      toDate: PropTypes.func.isRequired,
      /**
       * To format as an ISO 8601 string.
       * ```
       * dayjs('2019-01-25').toISOString() // '2019-01-25T02:00:00.000Z'
       * ```
       * Docs: https://day.js.org/docs/en/display/as-iso-string
       */
      toISOString: PropTypes.func.isRequired,
      /**
       * To serialize as an ISO 8601 string.
       * ```
       * dayjs('2019-01-25').toJSON() // '2019-01-25T02:00:00.000Z'
       * ```
       * Docs: https://day.js.org/docs/en/display/as-json
       */
      toJSON: PropTypes.func.isRequired,
      /**
       * Returns a string representation of the date.
       * ```
       * dayjs('2019-01-25').toString() // 'Fri, 25 Jan 2019 02:00:00 GMT'
       * ```
       * Docs: https://day.js.org/docs/en/display/as-string
       */
      toString: PropTypes.func.isRequired,
      /**
       * This returns the Unix timestamp (the number of **seconds** since the Unix Epoch) of the Day.js object.
       * ```
       * dayjs('2019-01-25').unix() // 1548381600
       * ```
       * This value is floored to the nearest second, and does not include a milliseconds component.
       *
       * Docs: https://day.js.org/docs/en/display/unix-timestamp
       */
      unix: PropTypes.func.isRequired,
      utc: PropTypes.func.isRequired,
      /**
       * Get the UTC offset in minutes.
       * ```
       * dayjs().utcOffset()
       * ```
       * Docs: https://day.js.org/docs/en/manipulate/utc-offset
       */
      utcOffset: PropTypes.func.isRequired,
      /**
       * This returns the number of **milliseconds** since the Unix Epoch of the Day.js object.
       * ```
       * dayjs('2019-01-25').valueOf() // 1548381600000
       * +dayjs(1548381600000) // 1548381600000
       * ```
       * To get a Unix timestamp (the number of seconds since the epoch) from a Day.js object, you should use Unix Timestamp `dayjs#unix()`.
       *
       * Docs: https://day.js.org/docs/en/display/unix-timestamp-milliseconds
       */
      valueOf: PropTypes.func.isRequired,
      week: PropTypes.func.isRequired,
      /**
       * Get the year.
       * ```
       * dayjs().year()// => 2020
       * ```
       * Docs: https://day.js.org/docs/en/get-set/year
       */
      year: PropTypes.func.isRequired,
    }),
  ),
  /**
   * It prevents the user from changing the value of the field
   * (not from interacting with the field).
   * @default false
   */
  readOnly: PropTypes.bool,
  /**
   * The selected value.
   * Used when the component is controlled.
   */
  value: PropTypes.object,
};

function AutocompleteDatePicker(props) {
  const { options, ...other } = props;

  const optionsLookup = React.useMemo(
    () =>
      options.reduce((acc, option) => {
        acc[option.toISOString()] = true;
        return acc;
      }, {}),
    [options],
  );

  return (
    <DatePicker
      slots={{ field: AutocompleteField, ...props.slots }}
      slotProps={{ field: { options } }}
      shouldDisableDate={(date) => !optionsLookup[date.startOf('day').toISOString()]}
      {...other}
    />
  );
}

AutocompleteDatePicker.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * Returns a cloned Day.js object with a specified amount of time added.
       * ```
       * dayjs().add(7, 'day')// => Dayjs
       * ```
       * Units are case insensitive, and support plural and short forms.
       *
       * Docs: https://day.js.org/docs/en/manipulate/add
       */
      add: PropTypes.func.isRequired,
      /**
       * All Day.js objects are immutable. Still, `dayjs#clone` can create a clone of the current object if you need one.
       * ```
       * dayjs().clone()// => Dayjs
       * dayjs(dayjs('2019-01-25')) // passing a Dayjs object to a constructor will also clone it
       * ```
       * Docs: https://day.js.org/docs/en/parse/dayjs-clone
       */
      clone: PropTypes.func.isRequired,
      /**
       * Get the date of the month.
       * ```
       * dayjs().date()// => 1-31
       * ```
       * Docs: https://day.js.org/docs/en/get-set/date
       */
      date: PropTypes.func.isRequired,
      /**
       * Get the day of the week.
       *
       * Returns numbers from 0 (Sunday) to 6 (Saturday).
       * ```
       * dayjs().day()// 0-6
       * ```
       * Docs: https://day.js.org/docs/en/get-set/day
       */
      day: PropTypes.func.isRequired,
      /**
       * Get the number of days in the current month.
       * ```
       * dayjs('2019-01-25').daysInMonth() // 31
       * ```
       * Docs: https://day.js.org/docs/en/display/days-in-month
       */
      daysInMonth: PropTypes.func.isRequired,
      /**
       * This indicates the difference between two date-time in the specified unit.
       *
       * To get the difference in milliseconds, use `dayjs#diff`
       * ```
       * const date1 = dayjs('2019-01-25')
       * const date2 = dayjs('2018-06-05')
       * date1.diff(date2) // 20214000000 default milliseconds
       * date1.diff() // milliseconds to current time
       * ```
       *
       * To get the difference in another unit of measurement, pass that measurement as the second argument.
       * ```
       * const date1 = dayjs('2019-01-25')
       * date1.diff('2018-06-05', 'month') // 7
       * ```
       * Units are case insensitive, and support plural and short forms.
       *
       * Docs: https://day.js.org/docs/en/display/difference
       */
      diff: PropTypes.func.isRequired,
      /**
       * Returns a cloned Day.js object and set it to the end of a unit of time.
       * ```
       * dayjs().endOf('month')// => Dayjs
       * ```
       * Units are case insensitive, and support plural and short forms.
       *
       * Docs: https://day.js.org/docs/en/manipulate/end-of
       */
      endOf: PropTypes.func.isRequired,
      /**
       * Get the formatted date according to the string of tokens passed in.
       *
       * To escape characters, wrap them in square brackets (e.g. [MM]).
       * ```
       * dayjs().format()// => current date in ISO8601, without fraction seconds e.g. '2020-04-02T08:02:17-05:00'
       * dayjs('2019-01-25').format('[YYYYescape] YYYY-MM-DDTHH:mm:ssZ[Z]')// 'YYYYescape 2019-01-25T00:00:00-02:00Z'
       * dayjs('2019-01-25').format('DD/MM/YYYY') // '25/01/2019'
       * ```
       * Docs: https://day.js.org/docs/en/display/format
       */
      format: PropTypes.func.isRequired,
      /**
       * String getter, returns the corresponding information getting from Day.js object.
       *
       * In general:
       * ```
       * dayjs().get(unit) === dayjs()[unit]()
       * ```
       * Units are case insensitive, and support plural and short forms.
       * ```
       * dayjs().get('year')
       * dayjs().get('month') // start 0
       * dayjs().get('date')
       * ```
       * Docs: https://day.js.org/docs/en/get-set/get
       */
      get: PropTypes.func.isRequired,
      /**
       * Get the hour.
       * ```
       * dayjs().hour()// => 0-23
       * ```
       * Docs: https://day.js.org/docs/en/get-set/hour
       */
      hour: PropTypes.func.isRequired,
      /**
       * This indicates whether the Day.js object is after the other supplied date-time.
       * ```
       * dayjs().isAfter(dayjs('2011-01-01')) // default milliseconds
       * ```
       * If you want to limit the granularity to a unit other than milliseconds, pass it as the second parameter.
       * ```
       * dayjs().isAfter('2011-01-01', 'year')// => boolean
       * ```
       * Units are case insensitive, and support plural and short forms.
       *
       * Docs: https://day.js.org/docs/en/query/is-after
       */
      isAfter: PropTypes.func.isRequired,
      /**
       * This indicates whether the Day.js object is before the other supplied date-time.
       * ```
       * dayjs().isBefore(dayjs('2011-01-01')) // default milliseconds
       * ```
       * If you want to limit the granularity to a unit other than milliseconds, pass it as the second parameter.
       * ```
       * dayjs().isBefore('2011-01-01', 'year')// => boolean
       * ```
       * Units are case insensitive, and support plural and short forms.
       *
       * Docs: https://day.js.org/docs/en/query/is-before
       */
      isBefore: PropTypes.func.isRequired,
      isBetween: PropTypes.func.isRequired,
      /**
       * This indicates whether the Day.js object is the same as the other supplied date-time.
       * ```
       * dayjs().isSame(dayjs('2011-01-01')) // default milliseconds
       * ```
       * If you want to limit the granularity to a unit other than milliseconds, pass it as the second parameter.
       * ```
       * dayjs().isSame('2011-01-01', 'year')// => boolean
       * ```
       * Docs: https://day.js.org/docs/en/query/is-same
       */
      isSame: PropTypes.func.isRequired,
      isUTC: PropTypes.func.isRequired,
      /**
       * This returns a `boolean` indicating whether the Day.js object contains a valid date or not.
       * ```
       * dayjs().isValid()// => boolean
       * ```
       * Docs: https://day.js.org/docs/en/parse/is-valid
       */
      isValid: PropTypes.func.isRequired,
      local: PropTypes.func.isRequired,
      locale: PropTypes.func.isRequired,
      /**
       * Get the milliseconds.
       * ```
       * dayjs().millisecond()// => 0-999
       * ```
       * Docs: https://day.js.org/docs/en/get-set/millisecond
       */
      millisecond: PropTypes.func.isRequired,
      /**
       * Get the minutes.
       * ```
       * dayjs().minute()// => 0-59
       * ```
       * Docs: https://day.js.org/docs/en/get-set/minute
       */
      minute: PropTypes.func.isRequired,
      /**
       * Get the month.
       *
       * Months are zero indexed, so January is month 0.
       * ```
       * dayjs().month()// => 0-11
       * ```
       * Docs: https://day.js.org/docs/en/get-set/month
       */
      month: PropTypes.func.isRequired,
      /**
       * Get the seconds.
       * ```
       * dayjs().second()// => 0-59
       * ```
       * Docs: https://day.js.org/docs/en/get-set/second
       */
      second: PropTypes.func.isRequired,
      /**
       * Generic setter, accepting unit as first argument, and value as second, returns a new instance with the applied changes.
       *
       * In general:
       * ```
       * dayjs().set(unit, value) === dayjs()[unit](value)
       * ```
       * Units are case insensitive, and support plural and short forms.
       * ```
       * dayjs().set('date', 1)
       * dayjs().set('month', 3) // April
       * dayjs().set('second', 30)
       * ```
       * Docs: https://day.js.org/docs/en/get-set/set
       */
      set: PropTypes.func.isRequired,
      /**
       * Returns a cloned Day.js object and set it to the start of a unit of time.
       * ```
       * dayjs().startOf('year')// => Dayjs
       * ```
       * Units are case insensitive, and support plural and short forms.
       *
       * Docs: https://day.js.org/docs/en/manipulate/start-of
       */
      startOf: PropTypes.func.isRequired,
      /**
       * Returns a cloned Day.js object with a specified amount of time subtracted.
       * ```
       * dayjs().subtract(7, 'year')// => Dayjs
       * ```
       * Units are case insensitive, and support plural and short forms.
       *
       * Docs: https://day.js.org/docs/en/manipulate/subtract
       */
      subtract: PropTypes.func.isRequired,
      /**
       * To get a copy of the native `Date` object parsed from the Day.js object use `dayjs#toDate`.
       * ```
       * dayjs('2019-01-25').toDate()// => Date
       * ```
       */
      toDate: PropTypes.func.isRequired,
      /**
       * To format as an ISO 8601 string.
       * ```
       * dayjs('2019-01-25').toISOString() // '2019-01-25T02:00:00.000Z'
       * ```
       * Docs: https://day.js.org/docs/en/display/as-iso-string
       */
      toISOString: PropTypes.func.isRequired,
      /**
       * To serialize as an ISO 8601 string.
       * ```
       * dayjs('2019-01-25').toJSON() // '2019-01-25T02:00:00.000Z'
       * ```
       * Docs: https://day.js.org/docs/en/display/as-json
       */
      toJSON: PropTypes.func.isRequired,
      /**
       * Returns a string representation of the date.
       * ```
       * dayjs('2019-01-25').toString() // 'Fri, 25 Jan 2019 02:00:00 GMT'
       * ```
       * Docs: https://day.js.org/docs/en/display/as-string
       */
      toString: PropTypes.func.isRequired,
      /**
       * This returns the Unix timestamp (the number of **seconds** since the Unix Epoch) of the Day.js object.
       * ```
       * dayjs('2019-01-25').unix() // 1548381600
       * ```
       * This value is floored to the nearest second, and does not include a milliseconds component.
       *
       * Docs: https://day.js.org/docs/en/display/unix-timestamp
       */
      unix: PropTypes.func.isRequired,
      utc: PropTypes.func.isRequired,
      /**
       * Get the UTC offset in minutes.
       * ```
       * dayjs().utcOffset()
       * ```
       * Docs: https://day.js.org/docs/en/manipulate/utc-offset
       */
      utcOffset: PropTypes.func.isRequired,
      /**
       * This returns the number of **milliseconds** since the Unix Epoch of the Day.js object.
       * ```
       * dayjs('2019-01-25').valueOf() // 1548381600000
       * +dayjs(1548381600000) // 1548381600000
       * ```
       * To get a Unix timestamp (the number of seconds since the epoch) from a Day.js object, you should use Unix Timestamp `dayjs#unix()`.
       *
       * Docs: https://day.js.org/docs/en/display/unix-timestamp-milliseconds
       */
      valueOf: PropTypes.func.isRequired,
      week: PropTypes.func.isRequired,
      /**
       * Get the year.
       * ```
       * dayjs().year()// => 2020
       * ```
       * Docs: https://day.js.org/docs/en/get-set/year
       */
      year: PropTypes.func.isRequired,
    }),
  ).isRequired,
  /**
   * Overrideable component slots.
   * @default {}
   */
  slots: PropTypes.any,
};

const today = dayjs().startOf('day');

export default function PickerWithAutocompleteField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AutocompleteDatePicker
        label="Pick a date"
        options={[
          today,
          today.add(1, 'day'),
          today.add(4, 'day'),
          today.add(5, 'day'),
        ]}
      />
    </LocalizationProvider>
  );
}
