import * as React from 'react';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import {
  createGlobalCompanyDataset,
  formatDay,
  getMonday,
  toDay,
  TODAY,
} from './globalCompanyDataset';
import { createLiveUpdates } from './globalCompanyLiveUpdates';

const SEED = 2026;
const SERIES_COUNTS = [500, 2000, 10000];
const UPDATE_RATES = [1, 5, 20];
const DISPLAY_TIMEZONES = [
  { value: 'default', label: 'Browser timezone' },
  { value: 'America/Los_Angeles', label: 'Los Angeles' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
];
const SAMPLE_COUNT = 100;
// Noon UTC is on the same day in the display timezones of the experiment.
const DEFAULT_VISIBLE_DATE = new Date(`${formatDay(TODAY)}T12:00:00Z`);
// The visible weeks start on Monday, like the weeks the updates target.
const DEFAULT_PREFERENCES = { weekStartsOn: 1 } as const;

// The durations run from the change to the next frame after the calendar renders it.
interface Stats {
  loadDuration: number | undefined;
  /**
   * The durations of the last updates.
   */
  durations: number[];
  updateCount: number;
  lastUpdate: string;
}

interface Scenario {
  resources: SchedulerResource[];
  applyLiveUpdate: ReturnType<typeof createLiveUpdates>;
}

interface PendingChange {
  start: number;
  isLoad: boolean;
}

// The changes waiting to be measured, keyed by the events they commit.
const pendingChanges = new WeakMap<SchedulerEvent[], PendingChange>();

function createStats(lastUpdate: string): Stats {
  return { loadDuration: undefined, durations: [], updateCount: 0, lastUpdate };
}

function formatDuration(duration: number | undefined) {
  return duration == null ? '–' : `${Math.round(duration)} ms`;
}

function getP95(values: number[]) {
  return values.toSorted((a, b) => a - b)[Math.floor(values.length * 0.95)];
}

interface StatsSnapshot extends Omit<Stats, 'durations'> {
  lastDuration: number | undefined;
  p95Duration: number | undefined;
  framesPerSecond: number;
  updatesPerSecond: number;
  seriesCount: number;
  standaloneCount: number;
  exDateCount: number;
}

/**
 * Reads the stats and counts the events twice per second, with the frames per second since
 * the last read. The updates per second cover two seconds, as low rates need a longer window.
 */
function useStatsSnapshot(
  statsRef: React.RefObject<Stats>,
  eventsRef: React.RefObject<SchedulerEvent[]>,
) {
  const [snapshot, setSnapshot] = React.useState<StatsSnapshot | null>(null);

  React.useEffect(() => {
    let frameCount = 0;
    let windowStart = performance.now();
    let rateStart = windowStart;
    let rateUpdateCount = statsRef.current.updateCount;
    let updatesPerSecond = 0;
    let frame = requestAnimationFrame(function countFrame(now) {
      frameCount += 1;
      if (now - windowStart >= 500) {
        const { durations, ...stats } = statsRef.current;
        const events = eventsRef.current;
        const seriesCount = events.filter((event) => event.rrule != null).length;
        if (now - rateStart >= 2000) {
          updatesPerSecond =
            ((stats.updateCount - rateUpdateCount) * 1000) / (now - rateStart);
          rateStart = now;
          rateUpdateCount = stats.updateCount;
        }
        setSnapshot({
          ...stats,
          lastDuration: durations.at(-1),
          p95Duration: getP95(durations),
          framesPerSecond: Math.round((frameCount * 1000) / (now - windowStart)),
          updatesPerSecond,
          seriesCount,
          standaloneCount: events.length - seriesCount,
          exDateCount: events.reduce(
            (total, event) => total + (event.exDates?.length ?? 0),
            0,
          ),
        });
        frameCount = 0;
        windowStart = now;
      }
      frame = requestAnimationFrame(countFrame);
    });
    return () => cancelAnimationFrame(frame);
  }, [statsRef, eventsRef]);

  return snapshot;
}

// Its props never change, so the updates don't render it.
const StatsPanel = React.memo(function StatsPanel(props: {
  statsRef: React.RefObject<Stats>;
  eventsRef: React.RefObject<SchedulerEvent[]>;
}) {
  const { statsRef, eventsRef } = props;
  const snapshot = useStatsSnapshot(statsRef, eventsRef);

  if (snapshot == null) {
    return <Typography variant="body2">Measuring…</Typography>;
  }

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" spacing={3} useFlexGap sx={{ flexWrap: 'wrap' }}>
        <Typography variant="body2">
          Load: <b>{formatDuration(snapshot.loadDuration)}</b>
        </Typography>
        <Typography variant="body2">
          Last update: <b>{formatDuration(snapshot.lastDuration)}</b>
        </Typography>
        <Typography variant="body2">
          p95 of the last {SAMPLE_COUNT}:{' '}
          <b>{formatDuration(snapshot.p95Duration)}</b>
        </Typography>
        <Typography variant="body2">
          Frames per second: <b>{snapshot.framesPerSecond}</b>
        </Typography>
        <Typography variant="body2">
          Updates per second: <b>{snapshot.updatesPerSecond.toFixed(1)}</b>
        </Typography>
        <Typography variant="body2">
          Updates: <b>{snapshot.updateCount}</b>
        </Typography>
        <Typography variant="body2">
          {snapshot.seriesCount.toLocaleString()} recurring series,{' '}
          {snapshot.standaloneCount.toLocaleString()} standalone events,{' '}
          {snapshot.exDateCount.toLocaleString()} excluded dates
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" noWrap>
        {snapshot.lastUpdate}
      </Typography>
    </Stack>
  );
});

interface StressTestCalendarProps {
  seriesCount: number;
  isLive: boolean;
  updateRate: number;
  displayTimezone: string;
}

// The controls live in the parent, so the updates only render the calendar.
// The parent mounts a new one for each series count, so the updates and measures of the
// previous dataset stop with it.
function StressTestCalendar(props: StressTestCalendarProps) {
  const { seriesCount, isLive, updateRate, displayTimezone } = props;
  const [scenario, setScenario] = React.useState<Scenario | null>(null);
  const [events, setEvents] = React.useState<SchedulerEvent[]>([]);

  const eventsRef = React.useRef(events);
  const statsRef = React.useRef(createStats('No update yet'));
  const visibleDayRef = React.useRef(TODAY);

  const commitEvents = React.useCallback(
    (nextEvents: SchedulerEvent[], isLoad: boolean) => {
      pendingChanges.set(nextEvents, { start: performance.now(), isLoad });
      eventsRef.current = nextEvents;
      setEvents(nextEvents);
    },
    [],
  );

  const applyUpdate = React.useCallback(
    (nextEvents: SchedulerEvent[], description: string) => {
      statsRef.current.updateCount += 1;
      statsRef.current.lastUpdate = description;
      commitEvents(nextEvents, false);
    },
    [commitEvents],
  );

  // The dataset is built after the mount, so the server doesn't render thousands of events
  // and the load time starts right before the calendar renders them.
  React.useEffect(() => {
    const dataset = createGlobalCompanyDataset(seriesCount, SEED);
    setScenario({
      resources: dataset.resources,
      applyLiveUpdate: createLiveUpdates(dataset.teams, SEED),
    });
    statsRef.current = createStats(
      `Loaded ${seriesCount.toLocaleString()} recurring series`,
    );
    commitEvents(dataset.events, true);
  }, [seriesCount, commitEvents]);

  React.useEffect(() => {
    const pending = pendingChanges.get(events);
    if (pending == null) {
      return;
    }
    pendingChanges.delete(events);
    // A hidden tab runs no frame, so the duration would include the time it stays hidden.
    if (document.visibilityState !== 'visible') {
      return;
    }
    const stats = statsRef.current;
    requestAnimationFrame(() => {
      const duration = performance.now() - pending.start;
      if (pending.isLoad) {
        stats.loadDuration = duration;
      } else {
        stats.durations.push(duration);
        if (stats.durations.length > SAMPLE_COUNT) {
          stats.durations.shift();
        }
      }
    });
  }, [events]);

  React.useEffect(() => {
    if (!isLive || scenario == null) {
      return undefined;
    }

    const interval = setInterval(() => {
      // Most updates target the two weeks starting with the visible week.
      const firstDay = getMonday(visibleDayRef.current);
      const update = scenario.applyLiveUpdate(
        eventsRef.current,
        firstDay,
        firstDay + 13,
      );
      applyUpdate(update.events, update.description);
    }, 1000 / updateRate);

    return () => clearInterval(interval);
  }, [isLive, updateRate, scenario, applyUpdate]);

  const handleEventsChange = React.useCallback(
    (nextEvents: SchedulerEvent[]) =>
      applyUpdate(nextEvents, 'Edited from the calendar'),
    [applyUpdate],
  );

  const handleVisibleDateChange = React.useCallback((visibleDate: Date) => {
    visibleDayRef.current = toDay(visibleDate);
  }, []);

  return (
    <Stack spacing={2}>
      <StatsPanel statsRef={statsRef} eventsRef={eventsRef} />
      <Box sx={{ height: 800, width: '100%' }}>
        {scenario == null ? (
          <Typography>Building the calendar…</Typography>
        ) : (
          <EventCalendarPremium
            events={events}
            onEventsChange={handleEventsChange}
            resources={scenario.resources}
            displayTimezone={displayTimezone}
            defaultVisibleDate={DEFAULT_VISIBLE_DATE}
            onVisibleDateChange={handleVisibleDateChange}
            defaultPreferences={DEFAULT_PREFERENCES}
          />
        )}
      </Box>
    </Stack>
  );
}

export default function RecurringEventsStressTest() {
  const [seriesCount, setSeriesCount] = React.useState(2000);
  const [isLive, setIsLive] = React.useState(false);
  const [updateRate, setUpdateRate] = React.useState(5);
  const [displayTimezone, setDisplayTimezone] = React.useState('default');

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        sx={{ flexWrap: 'wrap', alignItems: 'center' }}
      >
        <ToggleButtonGroup
          size="small"
          exclusive
          value={seriesCount}
          onChange={(_event, value: number | null) =>
            value != null && setSeriesCount(value)
          }
          aria-label="Recurring series"
        >
          {SERIES_COUNTS.map((count) => (
            <ToggleButton key={count} value={count}>
              {count.toLocaleString()} series
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <FormControlLabel
          control={
            <Switch
              checked={isLive}
              onChange={(event) => setIsLive(event.target.checked)}
            />
          }
          label="Live updates"
        />
        <TextField
          select
          size="small"
          label="Rate"
          value={updateRate}
          onChange={(event) => setUpdateRate(Number(event.target.value))}
        >
          {UPDATE_RATES.map((rate) => (
            <MenuItem key={rate} value={rate}>
              {rate} per second
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Display timezone"
          value={displayTimezone}
          onChange={(event) => setDisplayTimezone(event.target.value)}
        >
          {DISPLAY_TIMEZONES.map((timezone) => (
            <MenuItem key={timezone.value} value={timezone.value}>
              {timezone.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <StressTestCalendar
        key={seriesCount}
        seriesCount={seriesCount}
        isLive={isLive}
        updateRate={updateRate}
        displayTimezone={displayTimezone}
      />
    </Stack>
  );
}
