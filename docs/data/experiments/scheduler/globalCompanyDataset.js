// Global company dataset
// A company with offices in 8 timezones. Each team has its own calendar, and most of its events
// are recurring series that started years ago.

import { Chance } from 'chance';

const REGIONS = [
  { id: 'americas', title: 'Americas' },
  { id: 'emea', title: 'EMEA' },
  { id: 'apac', title: 'APAC' },
];

const OFFICES = [
  {
    id: 'new-york',
    title: 'New York',
    region: 'americas',
    timezone: 'America/New_York',
    color: 'blue',
    holidays: ['01-01', '06-19', '07-04', '12-25'],
  },
  {
    id: 'san-francisco',
    title: 'San Francisco',
    region: 'americas',
    timezone: 'America/Los_Angeles',
    color: 'indigo',
    holidays: ['01-01', '06-19', '07-04', '12-25'],
  },
  {
    id: 'sao-paulo',
    title: 'São Paulo',
    region: 'americas',
    timezone: 'America/Sao_Paulo',
    color: 'green',
    holidays: ['01-01', '04-21', '09-07', '11-15', '12-25'],
  },
  {
    id: 'london',
    title: 'London',
    region: 'emea',
    timezone: 'Europe/London',
    color: 'purple',
    holidays: ['01-01', '12-25', '12-26'],
  },
  {
    id: 'paris',
    title: 'Paris',
    region: 'emea',
    timezone: 'Europe/Paris',
    color: 'teal',
    holidays: [
      '01-01',
      '05-01',
      '05-08',
      '07-14',
      '08-15',
      '11-01',
      '11-11',
      '12-25',
    ],
  },
  {
    id: 'bangalore',
    title: 'Bangalore',
    region: 'apac',
    timezone: 'Asia/Kolkata',
    color: 'orange',
    holidays: ['01-26', '08-15', '10-02'],
  },
  {
    id: 'tokyo',
    title: 'Tokyo',
    region: 'apac',
    timezone: 'Asia/Tokyo',
    color: 'pink',
    holidays: ['01-01', '02-11', '05-03', '05-05', '11-03', '11-23'],
  },
  {
    id: 'sydney',
    title: 'Sydney',
    region: 'apac',
    timezone: 'Australia/Sydney',
    color: 'amber',
    holidays: ['01-01', '01-26', '04-25', '12-25', '12-26'],
  },
];

const TEAM_NAMES = [
  'Platform',
  'Payments',
  'Growth',
  'Mobile',
  'Design',
  'Data',
  'Support',
  'Sales',
  'Marketing',
  'Security',
  'Infrastructure',
  'Finance',
  'Search',
  'Billing',
  'Identity',
  'Analytics',
];

const FIRST_NAMES = [
  'Alex',
  'Maya',
  'Liam',
  'Noor',
  'Kenji',
  'Sofia',
  'Arjun',
  'Chloé',
  'Lucas',
  'Aiko',
  'Priya',
  'Mateo',
  'Emma',
  'Ravi',
  'Hana',
  'Oscar',
  'Léa',
  'Tomás',
  'Grace',
  'Yuki',
  'Isabela',
  'Omar',
  'Zoe',
  'Felix',
];

const PROJECTS = [
  'Atlas',
  'Beacon',
  'Comet',
  'Delta',
  'Ember',
  'Falcon',
  'Granite',
  'Harbor',
  'Iris',
  'Juniper',
];

const MEETINGS = [
  'Design review',
  'Customer call',
  'Interview',
  'Incident review',
  'Demo',
  'Hiring sync',
  'Architecture review',
  'Offsite prep',
  'Vendor call',
  'Roadmap review',
];

const WEEK_DAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

/**
 * A seeded random generator, so that a seed always builds the same calendar.
 */
export function createRandom(seed) {
  const chance = new Chance(seed);

  return {
    bool: (probability) => chance.bool({ likelihood: probability * 100 }),
    int: (min, max) => chance.integer({ min, max }),
    pick: (items) => chance.pickone(items),
    weighted: (items, weights) => chance.weighted(items, weights),
  };
}

// The days are calendar days counted from January 1st, 1970.
// The timezone of each event decides which instant they start at.
const DAY_MS = 24 * 60 * 60 * 1000;

export function toDay(date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS;
}

export function parseDay(value) {
  return Date.parse(`${value.slice(0, 10)}T00:00:00Z`) / DAY_MS;
}

export function parseMinutes(value) {
  return Number(value.slice(11, 13)) * 60 + Number(value.slice(14, 16));
}

export function formatDay(day) {
  return new Date(day * DAY_MS).toISOString().slice(0, 10);
}

// The minutes past the end of the day roll over to the next days.
export function formatDateTime(day, minutes) {
  return new Date(day * DAY_MS + minutes * 60 * 1000).toISOString().slice(0, 19);
}

export function formatEndOfDay(day) {
  return `${formatDay(day)}T23:59:59`;
}

function getDayOfWeek(day) {
  return new Date(day * DAY_MS).getUTCDay();
}

export function getWeekDay(day) {
  return WEEK_DAYS[getDayOfWeek(day)];
}

export function getMonday(day) {
  return day - ((getDayOfWeek(day) + 6) % 7);
}

export function getNextWeekday(day) {
  const dayOfWeek = getDayOfWeek(day);
  if (dayOfWeek === 6) {
    return day + 2;
  }
  return dayOfWeek === 0 ? day + 1 : day;
}

export function timed(day, minutes, duration) {
  return {
    start: formatDateTime(day, minutes),
    end: formatDateTime(day, minutes + duration),
  };
}

function allDay(firstDay, lastDay = firstDay) {
  return {
    start: formatDateTime(firstDay, 0),
    end: formatEndOfDay(lastDay),
    allDay: true,
  };
}

const FIRST_DAY = parseDay('2019-01-01');

/**
 * The day the dataset treats as today.
 * It's fixed, so the calendar and its updates don't change from one day to the next.
 */
export const TODAY = parseDay('2026-10-29');

export function createTeamMeeting(team, day, id, random) {
  return {
    id,
    title: random.pick(MEETINGS),
    timezone: team.office.timezone,
    resource: team.id,
    ...timed(day, random.int(18, 34) * 30, random.pick([30, 60, 90])),
  };
}

/**
 * Creates a weekly sync on the weekday of `day`, which ends with `end`.
 */
export function createProjectSeries(team, day, id, random, end) {
  return {
    id,
    title: `${random.pick(PROJECTS)} sync · ${team.title}`,
    timezone: team.office.timezone,
    resource: team.id,
    ...timed(day, random.int(18, 34) * 30, 45),
    rrule: { freq: 'WEEKLY', byDay: [getWeekDay(day)], ...end },
  };
}

/**
 * Returns the occurrences of the standup that fall on a holiday of the office.
 */
function getHolidayExDates(office, firstDay, lastDay, minutes) {
  const exDates = [];
  const firstYear = new Date(firstDay * DAY_MS).getUTCFullYear();
  const lastYear = new Date(lastDay * DAY_MS).getUTCFullYear();
  for (let year = firstYear; year <= lastYear; year += 1) {
    office.holidays.forEach((holiday) => {
      const day = parseDay(`${year}-${holiday}`);
      if (day >= firstDay && day <= lastDay && getNextWeekday(day) === day) {
        exDates.push(formatDateTime(day, minutes));
      }
    });
  }
  return exDates;
}

function addOfficeEvents(office, calendar) {
  const base = { timezone: office.timezone, resource: office.id };

  calendar.add({
    ...base,
    id: `${office.id}-all-hands`,
    title: `All hands · ${office.title}`,
    ...timed(parseDay('2019-01-03'), 16 * 60, 60),
    rrule: { freq: 'MONTHLY', byDay: ['1TH'] },
  });
  calendar.add({
    ...base,
    id: `${office.id}-it-office-hours`,
    title: `IT office hours · ${office.title}`,
    ...timed(FIRST_DAY, 13 * 60, 60),
    rrule: { freq: 'WEEKLY', byDay: ['TU', 'TH'] },
  });
  office.holidays.forEach((holiday) => {
    calendar.add({
      ...base,
      id: `${office.id}-holiday-${holiday}`,
      title: `Office closed · ${office.title}`,
      ...allDay(parseDay(`2019-${holiday}`)),
      rrule: { freq: 'YEARLY' },
    });
  });
}

function addTeamEvents(team, calendar) {
  const { random, today } = calendar;
  const base = { timezone: team.office.timezone, resource: team.id };
  const teamStart = random.int(FIRST_DAY, today - 90);
  const people = Array.from({ length: random.int(5, 11) }, () =>
    random.pick(FIRST_NAMES),
  );
  const manager = people[0];

  const standupDay = getNextWeekday(teamStart);
  const standupMinutes = random.pick([540, 555, 570, 585, 600]);
  calendar.add({
    ...base,
    id: `${team.id}-standup`,
    title: `Standup · ${team.title}`,
    ...timed(standupDay, standupMinutes, 15),
    rrule: { freq: 'WEEKLY', byDay: ['MO', 'TU', 'WE', 'TH', 'FR'] },
    exDates: getHolidayExDates(team.office, standupDay, today + 365, standupMinutes),
  });

  const sprintStart = getMonday(teamStart) + 7;
  calendar.add({
    ...base,
    id: `${team.id}-sprint-planning`,
    title: `Sprint planning · ${team.title}`,
    ...timed(sprintStart, 10 * 60 + 30, 60),
    rrule: { freq: 'WEEKLY', interval: 2, byDay: ['MO'] },
  });
  calendar.add({
    ...base,
    id: `${team.id}-retro`,
    title: `Retro · ${team.title}`,
    ...timed(sprintStart + 11, 15 * 60, 60),
    rrule: { freq: 'WEEKLY', interval: 2, byDay: ['FR'] },
  });
  calendar.add({
    ...base,
    id: `${team.id}-monthly-sync`,
    title: `Monthly sync · ${team.title}`,
    ...timed(teamStart, 14 * 60, 60),
    rrule: {
      freq: 'MONTHLY',
      byDay: [
        `${random.pick(['1', '2', '3', '-1'])}${random.pick(['TU', 'WE', 'TH'])}`,
      ],
    },
  });
  calendar.add({
    ...base,
    id: `${team.id}-lunch`,
    title: `Team lunch · ${team.title}`,
    ...timed(teamStart, 12 * 60, 90),
    rrule: { freq: 'MONTHLY', byMonthDay: [random.int(1, 28)] },
  });

  // A two-day offsite every quarter.
  if (random.bool(0.5)) {
    calendar.add({
      ...base,
      id: `${team.id}-offsite`,
      title: `Offsite · ${team.title}`,
      ...allDay(teamStart, teamStart + 1),
      rrule: { freq: 'MONTHLY', interval: 3, byDay: ['2TU'] },
    });
  }

  people.forEach((person, index) => {
    const joinDay = index === 0 ? teamStart : random.int(teamStart, today - 14);

    // A part-time schedule, with a day off every week or every other week.
    if (random.bool(0.15)) {
      calendar.add({
        ...base,
        id: `${team.id}-day-off-${index}`,
        title: `Day off · ${person}`,
        ...allDay(joinDay),
        rrule: {
          freq: 'WEEKLY',
          interval: random.pick([1, 2]),
          byDay: [random.pick(['WE', 'FR'])],
        },
      });
    }

    if (random.bool(0.3)) {
      const firstDay = getNextWeekday(today + random.int(-28, 28));
      calendar.add({
        ...base,
        id: `${team.id}-time-off-${index}`,
        title: `Time off · ${person}`,
        ...allDay(firstDay, firstDay + random.int(1, 11)),
      });
    }

    const birthYear = new Date(joinDay * DAY_MS).getUTCFullYear();
    const birthday =
      Date.UTC(birthYear, random.int(0, 11), random.int(1, 28)) / DAY_MS;
    calendar.add({
      ...base,
      id: `${team.id}-birthday-${index}`,
      title: `${person}'s birthday`,
      ...allDay(birthday),
      rrule: { freq: 'YEARLY' },
    });

    if (index > 0) {
      const day = getNextWeekday(joinDay);
      calendar.add({
        ...base,
        id: `${team.id}-one-on-one-${index}`,
        title: `1:1 ${manager} / ${person}`,
        ...timed(day, random.int(20, 34) * 30, 30),
        rrule: { freq: 'WEEKLY', interval: 2, byDay: [getWeekDay(day)] },
      });
    }
  });

  // A project that ended, or ends soon.
  if (random.bool(0.7)) {
    const day = getNextWeekday(random.int(teamStart, today - 60));
    const until = formatEndOfDay(day + 7 * random.int(8, 40));
    calendar.add(
      createProjectSeries(team, day, `${team.id}-project`, random, { until }),
    );
  }

  // A recent hire with a fixed number of onboarding sessions.
  if (random.bool(0.5)) {
    const day = getNextWeekday(today - random.int(0, 70));
    calendar.add({
      ...base,
      id: `${team.id}-onboarding`,
      title: `Onboarding · ${random.pick(FIRST_NAMES)}`,
      ...timed(day, 11 * 60, 60),
      rrule: { freq: 'WEEKLY', byDay: [getWeekDay(day)], count: 12 },
    });
  }

  // A COUNT that started years ago: the occurrences before the visible days still count.
  if (random.bool(0.3)) {
    const day = getNextWeekday(random.int(FIRST_DAY, FIRST_DAY + 700));
    calendar.add({
      ...base,
      id: `${team.id}-mentoring`,
      title: `Mentoring · ${random.pick(people)}`,
      ...timed(day, 17 * 60, 45),
      rrule: { freq: 'WEEKLY', byDay: [getWeekDay(day)], count: 400 },
    });
  }

  if (random.bool(0.3)) {
    calendar.add({
      ...base,
      id: `${team.id}-handover`,
      title: `On-call handover · ${team.title}`,
      ...timed(teamStart, 8 * 60, 15),
      rrule: { freq: 'DAILY' },
    });
  }

  const meetingCount = random.int(6, 12);
  for (let index = 0; index < meetingCount; index += 1) {
    const day = getNextWeekday(today + random.int(-28, 28));
    calendar.add(
      createTeamMeeting(team, day, `${team.id}-meeting-${index}`, random),
    );
  }
}

/**
 * Creates a company calendar with at least `seriesCount` recurring series.
 * Teams are added to the offices in turn until the calendar reaches that count.
 */
export function createGlobalCompanyDataset(seriesCount, seed) {
  const events = [];
  let currentSeriesCount = 0;
  const calendar = {
    random: createRandom(seed),
    today: TODAY,
    add: (event) => {
      events.push(event);
      if (event.rrule != null) {
        currentSeriesCount += 1;
      }
    },
  };

  const officeIds = OFFICES.map((office) => office.id);
  calendar.add({
    id: 'company-all-hands',
    title: 'Company all hands',
    timezone: 'America/Los_Angeles',
    resource: officeIds,
    ...timed(parseDay('2019-01-09'), 9 * 60, 60),
    rrule: { freq: 'MONTHLY', byDay: ['2WE'] },
  });
  calendar.add({
    id: 'quarterly-business-review',
    title: 'Quarterly business review',
    timezone: 'America/New_York',
    resource: officeIds,
    ...timed(parseDay('2019-01-08'), 8 * 60, 120),
    rrule: { freq: 'MONTHLY', interval: 3, byDay: ['2TU'] },
  });
  OFFICES.forEach((office) => addOfficeEvents(office, calendar));

  const teams = [];
  while (currentSeriesCount < seriesCount) {
    const officeIndex = teams.length % OFFICES.length;
    const officeTeamIndex = Math.floor(teams.length / OFFICES.length);
    const name = TEAM_NAMES[(officeTeamIndex + 3 * officeIndex) % TEAM_NAMES.length];
    const round = Math.floor(officeTeamIndex / TEAM_NAMES.length);
    const team = {
      id: `team-${teams.length}`,
      title: round === 0 ? name : `${name} ${round + 1}`,
      office: OFFICES[officeIndex],
    };
    teams.push(team);
    addTeamEvents(team, calendar);
  }

  const resources = REGIONS.map((region) => ({
    id: region.id,
    title: region.title,
    children: OFFICES.filter((office) => office.region === region.id).map(
      (office) => ({
        id: office.id,
        title: office.title,
        eventColor: office.color,
        children: teams
          .filter((team) => team.office === office)
          .map((team) => ({
            id: team.id,
            title: team.title,
            eventColor: office.color,
          })),
      }),
    ),
  }));

  return { events, resources, teams };
}
