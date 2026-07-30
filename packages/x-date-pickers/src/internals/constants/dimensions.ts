export const DAY_SIZE = 36;
export const DAY_MARGIN = 2;
export const DIALOG_WIDTH = 320;
export const MAX_CALENDAR_HEIGHT = 280;
export const VIEW_HEIGHT = 336;
export const DIGITAL_CLOCK_VIEW_HEIGHT = 232;
export const MULTI_SECTION_CLOCK_SECTION_WIDTH = 48;

export const DAY_SIZE_VAR = `var(--PickerDay-size, ${DAY_SIZE}px)`;

export const DAY_MARGIN_VAR = `var(--PickerDay-horizontalMargin, ${DAY_MARGIN}px)`;

export const DAY_TRACK_SIZE_VAR = `calc(${DAY_SIZE_VAR} + ${DAY_MARGIN_VAR} * 2)`;

export const WEEKS_CONTAINER_HEIGHT_VAR = `calc(${DAY_TRACK_SIZE_VAR} * 6)`;

export const CALENDAR_WIDTH_VAR = `calc(${DIALOG_WIDTH - 7 * (DAY_SIZE + DAY_MARGIN * 2)}px + ${DAY_TRACK_SIZE_VAR} * 7)`;

export const CALENDAR_HEIGHT_VAR = `calc(${VIEW_HEIGHT - 7 * (DAY_SIZE + DAY_MARGIN * 2)}px + ${DAY_TRACK_SIZE_VAR} * 7)`;
