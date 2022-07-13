import { PickersLocaleText } from "./utils/pickersLocaleTextApi";
import { getPickersLocalization } from "./utils/getPickersLocalization";
import { CalendarPickerView } from "../internals/models";

const itITPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: "Mese precedente",
  nextMonth: "Mese successivo",

  // View navigation
  openPreviousView: "Apri vista precedente",
  openNextView: "Apri vista successiva",
  calendarViewSwitchingButtonAriaLabel: (view: CalendarPickerView) =>
    view === "year"
      ? "La vista anno è aperta, apri quella a calendario"
      : "La vista calendario è aperta, apri quella ad anno",

  // DateRange placeholders
  start: "Inizio",
  end: "Fine",

  // Action bar
  cancelButtonLabel: "Annula",
  clearButtonLabel: "Resetta",
  okButtonLabel: "OK",
  todayButtonLabel: "Oggi",

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Seleziona ${view}. ${
      time === null
        ? "Nessun orario selezionato"
        : `L'orario selezionato è ${adapter.format(time, "fullTime")}`
    }`,
  hoursClockNumberText: (hours) => `${hours} ore`,
  minutesClockNumberText: (minutes) => `${minutes} minuti`,
  secondsClockNumberText: (seconds) => `${seconds} secondi`,

  // Open picker labels
  openDatePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Scegli la data, la data selezionata è${utils.format(utils.date(rawValue)!, "fullDate")}`
      : "Scegli la data",
  openTimePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Scegli l'ora, l'ora selezionata è ${utils.format(utils.date(rawValue)!, "fullTime")}`
      : "Scegli l'ora",

  // Table labels
  timeTableLabel: "Seleziona ora",
  dateTableLabel: "Seleziona data",
};

export const itIT = getPickersLocalization(itITPickers);
