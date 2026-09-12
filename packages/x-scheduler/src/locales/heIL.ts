import type {
    EventEditingLocaleText,
    EventCalendarLocaleText,
    EventTimelineLocaleText,
} from '../models/translations';
import { getSchedulerLocalization } from '../utils/getSchedulerLocalization';
import type { SchedulerLocalization } from '../utils/getSchedulerLocalization';

// Callbacks receive both stable English tokens and date-locale weekday strings.
const weekdays = [
    ['sunday', 'sun', 'ראשון', 'א'],
    ['monday', 'mon', 'שני', 'ב'],
    ['tuesday', 'tue', 'שלישי', 'ג'],
    ['wednesday', 'wed', 'רביעי', 'ד'],
    ['thursday', 'thu', 'חמישי', 'ה'],
    ['friday', 'fri', 'שישי', 'ו'],
    ['saturday', 'sat', 'שבת', 'ש'],
];

function localizeWeekday(value: string, abbreviated = false): string {
    const normalized = value.trim().toLowerCase().replace(/^יום\s+/, '').replace(/['’׳.]/g, '');
    const weekday = weekdays.filter((names) => names.indexOf(normalized) !== -1)[0];
    if (!weekday) {
        return value;
    }
    return abbreviated && weekday[2] !== 'שבת' ? `יום ${weekday[3]}׳` : `יום ${weekday[2]}`;
}

function monthlyWeekday(ord: number, weekday: string, abbreviated = false): string {
    const ordinals: Record<number, string> = {
        1: 'הראשון',
        2: 'השני',
        3: 'השלישי',
        4: 'הרביעי',
        5: 'החמישי',
        [-1]: 'האחרון',
    };
    return `${localizeWeekday(weekday, abbreviated)} ${ordinals[ord] ?? `ה־${ord}`} בחודש`;
}

// MUI assembles these dates as "d MMMM" / "d MMM" without Hebrew's month prefix.
function localizeDate(date: string): string {
    return date.replace(
        /^(\d{1,2}) (ינואר|פברואר|מרץ|אפריל|מאי|יוני|יולי|אוגוסט|ספטמבר|אוקטובר|נובמבר|דצמבר|ינו׳|פבר׳|אפר׳|אוג׳|ספט׳|אוק׳|נוב׳|דצמ׳)$/,
        '$1 ב$2',
    );
}

const colorNames: Record<string, string> = {
    red: 'אדום',
    pink: 'ורוד',
    purple: 'סגול',
    indigo: 'אינדיגו',
    blue: 'כחול',
    teal: 'טורקיז',
    green: 'ירוק',
    lime: 'ירוק ליים',
    amber: 'ענבר',
    orange: 'כתום',
    grey: 'אפור',
};

const viewNames = {
    day: 'יום',
    week: 'שבוע',
    month: 'חודש',
    agenda: 'סדר יום',
};

const heILDialog: EventEditingLocaleText = {
    // EventDialog
    colorPickerLabel: 'צבע האירוע',
    colorSectionLabel: 'צבע',
    dateTimeSectionLabel: 'תאריך ושעה',
    resourceColorSectionLabel: 'משאב וצבע',
    allDayLabel: 'כל היום',
    closeButtonAriaLabel: 'סגירה',
    closeButtonLabel: 'סגירה',
    editEventButtonAriaLabel: 'עריכת האירוע',
    deleteEventButtonAriaLabel: 'מחיקת האירוע',
    eventActionsToolbarAriaLabel: 'פעולות באירוע',
    deleteEvent: 'מחיקת האירוע',
    editEvent: 'עריכת האירוע',
    showEventDetails: 'הצגת פרטים',
    eventContextMenuAriaLabel: 'פעולות באירוע',
    descriptionLabel: 'תיאור',
    endDateLabel: 'תאריך סיום',
    endTimeLabel: 'שעת סיום',
    eventTitleAriaLabel: 'כותרת האירוע',
    generalTabLabel: 'כללי',
    labelNoResource: 'ללא משאב',
    labelInvalidResource: 'משאב לא תקין',
    recurrenceLabel: 'חזרה',
    recurrenceNoRepeat: 'ללא חזרה',
    recurrenceCustomRepeat: 'חזרה מותאמת אישית',
    recurrenceDailyPresetLabel: 'מדי יום',
    recurrenceDailyFrequencyLabel: 'ימים',
    recurrenceEndsLabel: 'סיום החזרה',
    recurrenceEndsAfterLabel: 'לאחר',
    recurrenceEndsNeverLabel: 'ללא תאריך סיום',
    recurrenceEndsUntilLabel: 'עד לתאריך',
    recurrenceEndsTimesLabel: 'מופעים',
    recurrenceEveryLabel: 'כל',
    recurrenceRepeatLabel: 'תדירות החזרה',
    recurrenceTabLabel: 'חזרה',
    recurrenceMainSelectCustomLabel: 'חזרה',
    recurrenceWeeklyFrequencyLabel: 'שבועות',
    recurrenceWeeklyPresetLabel: ({ weekday, weekdayName }) => `מדי שבוע ב${localizeWeekday(weekday ?? weekdayName)}`,
    recurrenceMonthlyFrequencyLabel: 'חודשים',
    recurrenceMonthlyDayOfMonthLabel: (dayNumber) => `ב־${dayNumber} בחודש`,
    recurrenceMonthlyLastWeekAriaLabel: (weekDay) => monthlyWeekday(-1, weekDay),
    recurrenceMonthlyLastWeekLabel: (weekDay) => monthlyWeekday(-1, weekDay, true),
    recurrenceMonthlyPresetLabel: (dayNumber) => `ב־${dayNumber} בכל חודש`,
    recurrenceMonthlyWeekNumberAriaLabel: (ord, weekDay) => monthlyWeekday(ord, weekDay),
    recurrenceMonthlyWeekNumberLabel: (ord, weekDay) => monthlyWeekday(ord, weekDay, true),
    recurrenceWeeklyMonthlySpecificInputsLabel: 'מועד החזרה',
    recurrenceYearlyFrequencyLabel: 'שנים',
    recurrenceYearlyPresetLabel: (date) => `מדי שנה ב־${localizeDate(date)}`,
    noResourceAriaLabel: 'ללא משאב מסוים',
    selectColorAriaLabel: (color) => `בחירת ${colorNames[color] ?? color} כצבע האירוע`,
    resourceLabel: 'משאב',
    invalidDateError: 'יש להזין תאריך תקין.',
    invalidTimeError: 'יש להזין שעה תקינה.',
    requiredResourceError: 'יש לבחור משאב.',
    saveChanges: 'שמירה',
    startDateAfterEndDateError: 'תאריך הסיום לא יכול להיות לפני תאריך ההתחלה.',
    startDateLabel: 'תאריך התחלה',
    startTimeAfterEndTimeError: 'שעת הסיום חייבת להיות אחרי שעת ההתחלה.',
    startTimeLabel: 'שעת התחלה',

    // RecurringScopeDialog: all choices apply to the current recurring series.
    all: 'כל האירועים בסדרה',
    cancel: 'ביטול',
    confirm: 'אישור',
    onlyThis: 'האירוע הזה בלבד',
    radioGroupAriaLabel: 'בחירת האירועים בסדרה שעליהם יחול השינוי',
    thisAndFollowing: 'האירוע הזה והאירועים הבאים בסדרה',
    title: 'על אילו אירועים להחיל את השינוי?',
};

const heILCalendar: Omit<EventCalendarLocaleText, keyof EventEditingLocaleText> = {
    // ResourcesTree
    resourcesLabel: 'משאבים',

    // ViewSwitcher
    agenda: 'סדר יום',
    day: 'יום',
    month: 'חודש',
    other: 'אחר',
    today: 'היום',
    week: 'שבוע',
    time: 'שעה',
    days: 'ימים',
    months: 'חודשים',
    weeks: 'שבועות',
    years: 'שנים',

    // DateNavigator and SidePanelDrawer
    closeSidePanel: 'סגירת חלונית הצד',
    openSidePanel: 'פתיחת חלונית הצד',
    openMenu: 'פתיחת התפריט',

    // Preferences menu
    amPm12h: '12 שעות (1:00 אחה״צ)',
    hour24h: '24 שעות (13:00)',
    preferencesMenu: 'העדפות',
    showWeekends: 'הצגת סופי שבוע',
    showEmptyDaysInAgenda: 'הצגת ימים ללא אירועים',
    showWeekNumber: 'הצגת מספר השבוע',
    timeFormat: 'תבנית השעה',
    viewSpecificOptions: (view) => `אפשרויות תצוגת ${viewNames[view]}`,
    startWeekOn: 'היום הראשון בשבוע',
    weekdaySunday: 'יום ראשון',
    weekdayMonday: 'יום שני',
    weekdaySaturday: 'יום שבת',

    // Calendar grids and date navigation
    allDay: 'כל היום',
    hiddenEvents: (count) => (count === 1 ? 'אירוע נוסף' : `עוד ${count} אירועים`),
    nextTimeSpan: (view) => ({ day: 'היום הבא', week: 'השבוע הבא', month: 'החודש הבא', agenda: 'התקופה הבאה' })[view],
    previousTimeSpan: (view) => ({ day: 'היום הקודם', week: 'השבוע הקודם', month: 'החודש הקודם', agenda: 'התקופה הקודמת' })[view],
    resourceAriaLabel: (resourceName) => `משאב: ${resourceName}`,
    weekAbbreviation: 'שב׳',
    weekNumberAriaLabel: (weekNumber) => `שבוע ${weekNumber}`,

    // EventItem
    eventItemMultiDayLabel: (endDate) => `מסתיים ב־${localizeDate(endDate)}`,

    // MiniCalendar
    miniCalendarLabel: 'לוח שנה',
    miniCalendarGoToPreviousMonth: 'הצגת החודש הקודם בלוח השנה',
    miniCalendarGoToNextMonth: 'הצגת החודש הבא בלוח השנה',

    // Main calendar region
    calendarContentAriaLabel: 'תוכן לוח השנה',

    // Timeline title sub grid
    timelineResourceTitleHeader: 'שם המשאב',
};

const heILTimeline: Omit<EventTimelineLocaleText, keyof EventEditingLocaleText> = {
    // Timeline title sub grid
    timelineResourceTitleHeader: 'שם המשאב',
};

export const heIL: SchedulerLocalization = getSchedulerLocalization({
    dialog: heILDialog,
    calendar: heILCalendar,
    timeline: heILTimeline,
});
