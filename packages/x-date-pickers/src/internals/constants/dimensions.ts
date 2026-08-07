export const DAY_SIZE = 36;
export const DAY_MARGIN = 2;
export const DIALOG_WIDTH = 320;
export const MAX_CALENDAR_HEIGHT = 280;
export const VIEW_HEIGHT = 336;
export const DIGITAL_CLOCK_VIEW_HEIGHT = 232;
export const MULTI_SECTION_CLOCK_SECTION_WIDTH = 48;

export const DAYS_IN_WEEK = 7;
export const MAX_WEEKS_IN_MONTH = 6;
export const WEEK_DAY_LABELS_ROW_COUNT = 1;
export const CALENDAR_ROW_COUNT = MAX_WEEKS_IN_MONTH + WEEK_DAY_LABELS_ROW_COUNT;

/**
 * The space a single day takes in the grid, margins included.
 */
export const DAY_TRACK_SIZE = DAY_SIZE + DAY_MARGIN * 2;

/**
 * The space the calendar takes around the day grid, derived from the default dimensions so that
 * the default rendering is left untouched.
 */
export const CALENDAR_HORIZONTAL_PADDING = DIALOG_WIDTH - DAY_TRACK_SIZE * DAYS_IN_WEEK;
export const CALENDAR_HEADER_HEIGHT = VIEW_HEIGHT - DAY_TRACK_SIZE * CALENDAR_ROW_COUNT;

/**
 * The calendar-level size token.
 * Set `--PickerCalendar-daySize` on the calendar or on any of its ancestors to resize the day cells
 * and every dimension derived from them.
 */
export const CALENDAR_DAY_SIZE_VAR = `var(--PickerCalendar-daySize, ${DAY_SIZE}px)`;

/**
 * The `--PickerDay-*` variables are declared by the day slots, so they can only be read on the day
 * itself and on its descendants.
 * Anything outside the day has to read `CALENDAR_DAY_SIZE_VAR` instead.
 */
export const DAY_SIZE_VAR = 'var(--PickerDay-size)';
export const DAY_MARGIN_VAR = 'var(--PickerDay-horizontalMargin)';

/**
 * The margins are added as a constant instead of being read from `--PickerDay-horizontalMargin`,
 * so that the unitless values this variable has always accepted (`0`) keep working.
 * The week rows are centered, so a day margin override still renders like it does today, it only
 * doesn't resize the calendar around the grid.
 */
export const DAY_TRACK_SIZE_VAR = `calc(${CALENDAR_DAY_SIZE_VAR} + ${DAY_MARGIN * 2}px)`;

export const WEEKS_CONTAINER_HEIGHT_VAR = `calc(${DAY_TRACK_SIZE_VAR} * ${MAX_WEEKS_IN_MONTH})`;

export const CALENDAR_WIDTH_VAR = `calc(${CALENDAR_HORIZONTAL_PADDING}px + ${DAY_TRACK_SIZE_VAR} * ${DAYS_IN_WEEK})`;

export const CALENDAR_HEIGHT_VAR = `calc(${CALENDAR_HEADER_HEIGHT}px + ${DAY_TRACK_SIZE_VAR} * ${CALENDAR_ROW_COUNT})`;
