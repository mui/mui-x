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

import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import {
  createGlobalCompanyDataset,
  getMonday,
  toDay,
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

// The durations run from the change to the next frame after the calendar renders it.

function createStats(lastUpdate) {
  return { loadDuration: undefined, durations: [], updateCount: 0, lastUpdate };
}

function formatDuration(duration) {
  return duration == null ? '–' : `${Math.round(duration)} ms`;
}

function getP95(values) {
  return values.toSorted((a, b) => a - b)[Math.floor(values.length * 0.95)];
}

/**
 * Reads the stats and counts the events twice per second,
 * with the frames per second since the last read.
 */
function useStatsSnapshot(statsRef, eventsRef) {
  const [snapshot, setSnapshot] = React.useState(null);

  React.useEffect(() => {
    let frameCount = 0;
    let windowStart = performance.now();
    let frame = requestAnimationFrame(function countFrame(now) {
      frameCount += 1;
      if (now - windowStart >= 500) {
        const { durations, ...stats } = statsRef.current;
        const events = eventsRef.current;
        const seriesCount = events.filter((event) => event.rrule != null).length;
        setSnapshot({
          ...stats,
          lastDuration: durations.at(-1),
          p95Duration: getP95(durations),
          framesPerSecond: Math.round((frameCount * 1000) / (now - windowStart)),
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
const StatsPanel = React.memo(function StatsPanel(props) {
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

// The controls live in the parent, so the updates only render the calendar.
function StressTestCalendar(props) {
  const { seriesCount, isLive, updateRate, displayTimezone } = props;
  const [scenario, setScenario] = React.useState(null);
  const [events, setEvents] = React.useState([]);

  const eventsRef = React.useRef(events);
  const statsRef = React.useRef(createStats('No update yet'));
  const pendingRef = React.useRef(null);
  const visibleDayRef = React.useRef(toDay(new Date()));

  const commitEvents = React.useCallback((nextEvents, isLoad) => {
    pendingRef.current = { start: performance.now(), isLoad };
    eventsRef.current = nextEvents;
    setEvents(nextEvents);
  }, []);

  const applyUpdate = React.useCallback(
    (nextEvents, description) => {
      statsRef.current.updateCount += 1;
      statsRef.current.lastUpdate = description;
      commitEvents(nextEvents, false);
    },
    [commitEvents],
  );

  // The dataset depends on the current date, so it's only built in the browser.
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
    const pending = pendingRef.current;
    if (pending == null) {
      return;
    }
    pendingRef.current = null;
    requestAnimationFrame(() => {
      const duration = performance.now() - pending.start;
      const stats = statsRef.current;
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
      // The updates target the two weeks starting with the visible week.
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
    (nextEvents) => applyUpdate(nextEvents, 'Edited from the calendar'),
    [applyUpdate],
  );

  const handleVisibleDateChange = React.useCallback((visibleDate) => {
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
            onVisibleDateChange={handleVisibleDateChange}
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
          onChange={(_event, value) => value != null && setSeriesCount(value)}
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
        seriesCount={seriesCount}
        isLive={isLive}
        updateRate={updateRate}
        displayTimezone={displayTimezone}
      />
    </Stack>
  );
}
