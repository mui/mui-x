import { getSchedulerLocalization } from '../utils/getSchedulerLocalization';
import type {
  SchedulerLocalization,
  SchedulerDialogTranslations,
  SchedulerEventTranslations,
  SchedulerCalendarTranslations,
  SchedulerTimelineTranslations,
} from '../utils/getSchedulerLocalization';

const colorNames: Record<string, string> = {
  red: '빨간색',
  pink: '분홍색',
  purple: '보라색',
  indigo: '남색',
  blue: '파란색',
  teal: '청록색',
  green: '초록색',
  lime: '연두색',
  amber: '호박색',
  orange: '주황색',
  grey: '회색',
};

// Korean labels write the weekday in full ("월요일"), even where the date locale abbreviates it ("월").
const weekdayNames: Record<string, string> = {
  monday: '월요일',
  tuesday: '화요일',
  wednesday: '수요일',
  thursday: '목요일',
  friday: '금요일',
  saturday: '토요일',
  sunday: '일요일',
};

const viewNames: Record<string, string> = {
  day: '일',
  week: '주',
  month: '월',
  agenda: '일정 목록',
};

const nextTimeSpanNames: Record<string, string> = {
  day: '다음 날',
  week: '다음 주',
  month: '다음 달',
  agenda: '다음 기간',
};

const previousTimeSpanNames: Record<string, string> = {
  day: '이전 날',
  week: '이전 주',
  month: '이전 달',
  agenda: '이전 기간',
};

const lagUnitNames: Record<string, string> = {
  minute: '분',
  hour: '시간',
  day: '일',
  week: '주',
};

const otherEvent = {
  finish: { before: '끝나야', after: '끝나고' },
  start: { before: '시작되어야', after: '시작되고' },
};

const waitsOn = (title: string, lag: string | null, other: 'finish' | 'start', self: string) =>
  lag === null
    ? `"${title}" 일정이 ${otherEvent[other].before} ${self} 수 있습니다.`
    : `"${title}" 일정이 ${otherEvent[other].after} ${lag} 뒤에야 ${self} 수 있습니다.`;

const koKRDialog: SchedulerDialogTranslations = {
  // EventDialog
  colorPickerLabel: '일정 색상',
  colorSectionLabel: '색상',
  dateTimeSectionLabel: '날짜 및 시간',
  resourceColorSectionLabel: '리소스 및 색상',
  allDayLabel: '종일',
  closeButtonAriaLabel: '닫기',
  closeButtonLabel: '닫기',
  editEventButtonAriaLabel: '일정 편집',
  deleteEventButtonAriaLabel: '일정 삭제',
  eventActionsToolbarAriaLabel: '일정 작업',
  deleteEvent: '일정 삭제',
  deleteConfirmationTitle: '이 일정을 삭제할까요?',
  deleteConfirmationMessage: '이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?',
  cancel: '취소',
  editEvent: '일정 편집',
  showEventDetails: '세부 정보 보기',
  eventContextMenuAriaLabel: '일정 작업',
  descriptionLabel: '설명',
  endDateLabel: '종료 날짜',
  endTimeLabel: '종료 시간',
  eventTitleAriaLabel: '일정 제목',
  generalTabLabel: '일반',
  labelNoResource: '리소스 없음',
  labelInvalidResource: '잘못된 리소스',
  recurrenceLabel: '반복',
  recurrenceNoRepeat: '반복 안 함',
  recurrenceCustomRepeat: '맞춤 반복 규칙',
  recurrenceDailyPresetLabel: '매일 반복',
  recurrenceDailyFrequencyLabel: '일',
  recurrenceEndsLabel: '종료',
  recurrenceEndsAfterLabel: '반복 횟수',
  recurrenceEndsNeverLabel: '종료 없음',
  recurrenceEndsUntilLabel: '종료 날짜',
  recurrenceEndsTimesLabel: '회',
  recurrenceEveryLabel: '반복 간격',
  recurrenceRepeatLabel: '반복',
  recurrenceTabLabel: '반복',
  recurrenceTimezoneLabel: (timezone) => `시간대: ${timezone}`,
  recurrenceLabelTimezoneSuffix: (timezone) => `(${timezone})`,
  recurrenceMainSelectCustomLabel: '반복',
  recurrenceWeeklyFrequencyLabel: '주',
  recurrenceWeeklyPresetLabel: ({ weekday, weekdayName }) =>
    `매주 ${weekdayNames[weekday] ?? weekdayName} 반복`,
  recurrenceMonthlyFrequencyLabel: '개월',
  recurrenceMonthlyDayOfMonthLabel: (dayNumber) => `${dayNumber}일`,
  recurrenceMonthlyLastWeekAriaLabel: ({ weekday, weekdayName }) =>
    `매월 마지막 ${weekdayNames[weekday] ?? weekdayName}`,
  recurrenceMonthlyLastWeekLabel: ({ weekday, weekdayName }) =>
    `마지막 ${weekdayNames[weekday] ?? weekdayName}`,
  recurrenceMonthlyPresetLabel: (dayNumber) => `매월 ${dayNumber}일 반복`,
  recurrenceMonthlyWeekNumberAriaLabel: ({ ord, weekday, weekdayName }) =>
    `매월 ${ord}번째 ${weekdayNames[weekday] ?? weekdayName}`,
  recurrenceMonthlyWeekNumberLabel: ({ ord, weekday, weekdayName }) =>
    `${ord}번째 ${weekdayNames[weekday] ?? weekdayName}`,
  recurrenceWeeklyMonthlySpecificInputsLabel: '반복일',
  recurrenceYearlyFrequencyLabel: '년',
  recurrenceYearlyPresetLabel: (date) => `매년 ${date} 반복`,
  noResourceAriaLabel: '특정 리소스 없음',
  selectColorAriaLabel: (color) => `일정 색상으로 ${colorNames[color] ?? color} 선택`,
  resourceLabel: '리소스',
  invalidDateError: '올바른 날짜를 입력하세요.',
  invalidTimeError: '올바른 시간을 입력하세요.',
  requiredResourceError: '리소스를 선택해야 합니다.',
  saveChanges: '저장',
  startDateAfterEndDateError: '종료 날짜는 시작 날짜보다 앞설 수 없습니다.',
  startDateLabel: '시작 날짜',
  startTimeAfterEndTimeError: '종료 시간은 시작 시간보다 뒤여야 합니다.',
  startTimeLabel: '시작 시간',

  // RecurringScopeDialog
  all: '모든 일정',
  confirm: '확인',
  onlyThis: '이 일정만',
  radioGroupAriaLabel: '반복 일정 편집 범위',
  thisAndFollowing: '이 일정 및 이후 일정',
  title: '이 변경 사항을 적용할 대상:',

  // Errors
  somethingWentWrongError: '문제가 발생했습니다. 다시 시도하세요.',
  eventNotLoadedError:
    '이 일정은 아직 저장 중이라 변경 사항이 적용되지 않았습니다. 저장이 끝난 뒤 다시 시도하세요.',
  eventChangedWhileConfirmingError:
    '삭제 확인 창이 열려 있는 동안 이 일정이 바뀌어 삭제되지 않았습니다. 다시 삭제해 보세요.',
  datesNotWritableError: '이 날짜는 바꿀 수 없어 변경 사항이 적용되지 않았습니다.',
  eventNotCreatableError: '새 일정으로 저장할 수 없어 변경 사항이 적용되지 않았습니다.',
  readOnlyEventMovedError: (title) =>
    `이 변경은 읽기 전용 일정 "${title}"까지 옮기게 되어 적용되지 않았습니다.`,
  unwritableEventMovedError: (title) =>
    `이 변경은 날짜를 바꿀 수 없는 일정 "${title}"까지 옮기게 되어 적용되지 않았습니다.`,
  dependencyCascadeBlockedError: '이 종속 관계는 읽기 전용 일정을 옮기게 되어 만들지 않았습니다.',
  dependencyDatesNotWritableError:
    '이 종속 관계는 날짜를 바꿀 수 없는 일정을 옮기게 되어 만들지 않았습니다.',
  dependencyCycleError: '이 종속 관계는 일정 사이에 순환을 만듭니다.',
  dependencyDuplicateError: '두 일정 사이에 이 유형의 종속 관계가 이미 있습니다.',
  dependencyRecurringEventError: '반복 일정에는 종속 관계를 만들 수 없습니다.',
  dependencyReadOnlyError: '스케줄러가 읽기 전용인 동안에는 종속 관계를 바꿀 수 없습니다.',
  dependencyUnknownEventError: '일정 중 하나가 더 이상 없어 이 종속 관계를 만들 수 없습니다.',
};

const koKREvent: SchedulerEventTranslations = {
  // Event accessible name
  eventAriaLabelTimeRange: (start, end) => `${start} ~ ${end}`,
  eventAriaLabelDateRange: (start, end) => `${start}부터 ${end}까지`,
  eventAriaLabelAllDay: '종일',
  eventAriaLabelRecurring: '반복',
  resourceAriaLabel: (resourceName) => `리소스: ${resourceName}`,
  eventAriaLabel: ({ title, when, date, resource, recurring }) =>
    [title, when, date, resource, recurring].filter(Boolean).join(', '),
};

const koKRCalendar: SchedulerCalendarTranslations = {
  // ResourcesTree
  resourcesLabel: '리소스',

  // ViewSwitcher
  agenda: '일정 목록',
  day: '일',
  month: '월',
  other: '기타',
  today: '오늘',
  week: '주',
  time: '시간별',
  days: '일별',
  months: '월별',
  weeks: '주별',
  years: '연도별',
  viewSwitcherAriaLabel: '보기',

  // DateNavigator
  closeSidePanel: '사이드 패널 닫기',
  openSidePanel: '사이드 패널 열기',

  // SidePanelDrawer (small screens)
  openMenu: '메뉴 열기',

  // Preferences menu
  amPm12h: '12시간제 (오후 1:00)',
  hour24h: '24시간제 (13:00)',
  preferencesMenu: '환경설정',
  showWeekends: '주말 표시',
  showEmptyDaysInAgenda: '일정 없는 날 표시',
  showWeekNumber: '주 번호 표시',
  timeFormat: '시간 형식',
  viewSpecificOptions: (view) => `${viewNames[view] ?? view} 보기 옵션`,
  startWeekOn: '한 주의 시작 요일',
  weekdaySunday: '일요일',
  weekdayMonday: '월요일',
  weekdaySaturday: '토요일',

  // WeekView
  allDay: '종일',
  dayGridLabel: '종일 및 여러 날 일정',
  hiddenEvents: (hiddenEventsCount) => `${hiddenEventsCount}개 더보기`,
  nextTimeSpan: (view) => nextTimeSpanNames[view] ?? `다음 ${view}`,
  previousTimeSpan: (view) => previousTimeSpanNames[view] ?? `이전 ${view}`,
  weekAbbreviation: '주',
  weekNumberAriaLabel: (weekNumber) => `${weekNumber}주차`,

  // AgendaView
  agendaViewEmptyStateLabel: '예정된 일정이 없습니다',

  // EventItem
  eventItemMultiDayLabel: (endDate) => `${endDate}에 종료`,

  // MiniCalendar
  miniCalendarLabel: '달력',
  miniCalendarGoToPreviousMonth: '달력에서 이전 달 보기',
  miniCalendarGoToNextMonth: '달력에서 다음 달 보기',

  // Main calendar region
  calendarContentAriaLabel: '달력 내용',

  // Timeline title sub grid
  timelineResourceTitleHeader: '리소스 이름',
};

const koKRTimeline: SchedulerTimelineTranslations = {
  // Timeline title sub grid
  timelineResourceTitleHeader: '리소스 이름',
  timelineResourceExpand: '리소스 펼치기',
  timelineResourceCollapse: '리소스 접기',

  // Dependency dialog
  dependencyEditTitle: '종속 관계 편집',
  dependencyDetailsTitle: '종속 관계 세부 정보',
  dependencySourceLabel: '선행 일정',
  dependencyTargetLabel: '후행 일정',
  dependencyTypeLabel: '유형',
  dependencyLagLabel: '지연 시간',
  dependencyLagUnitAriaLabel: '지연 시간 단위',
  dependencyNoLag: '없음',
  dependencyInvalidLagError: '0 이상의 정수를 입력하세요.',
  dependencyAllDayLagIgnored:
    '종일 일정은 하루 단위로만 기다릴 수 있어 이 지연 시간은 적용되지 않습니다.',
  dependencyAllDayLagRounded: (lag) => `종일 일정은 하루 단위로만 기다릴 수 있습니다: ${lag}.`,
  dependencyUpdateCascadeBlockedError:
    '이 변경은 읽기 전용 일정을 옮기게 되어 적용되지 않았습니다.',
  dependencyUpdateDatesNotWritableError:
    '이 변경은 날짜를 바꿀 수 없는 일정을 옮기게 되어 적용되지 않았습니다.',
  dependencyUpdateNotFoundError: '이 종속 관계는 더 이상 없습니다.',
  dependencyTypeFinishToStart: '종료 후 시작',
  dependencyTypeStartToStart: '시작 후 시작',
  dependencyTypeFinishToFinish: '종료 후 종료',
  dependencyTypeStartToFinish: '시작 후 종료',
  dependencyLagUnitMinutes: '분',
  dependencyLagUnitHours: '시간',
  dependencyLagUnitDays: '일',
  dependencyLagUnitWeeks: '주',
  dependencyLag: (amount, unit) => `${amount}${lagUnitNames[unit] ?? unit}`,

  // Dependency context menu and dialog actions
  dependencyActionsAriaLabel: '종속 관계 작업',
  editDependency: '종속 관계 편집',
  showDependencyDetails: '세부 정보 보기',
  deleteDependency: '삭제',

  // Accessible description of an event that waits on dependencies
  dependencyFinishToStartDescription: ({ title, lag }) => waitsOn(title, lag, 'finish', '시작할'),
  dependencyStartToStartDescription: ({ title, lag }) => waitsOn(title, lag, 'start', '시작할'),
  dependencyFinishToFinishDescription: ({ title, lag }) => waitsOn(title, lag, 'finish', '끝낼'),
  dependencyStartToFinishDescription: ({ title, lag }) => waitsOn(title, lag, 'start', '끝낼'),
};

export const koKR: SchedulerLocalization = getSchedulerLocalization({
  dialog: koKRDialog,
  event: koKREvent,
  calendar: koKRCalendar,
  timeline: koKRTimeline,
});
