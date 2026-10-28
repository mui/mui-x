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
  createRandom,
  getMonday,
  toDay,
} from './globalCompanyDataset';
import { applyLiveUpdate } from './globalCompanyLiveUpdates';

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

function formatDuration(duration) {
  return duration == null ? '–' : `${Math.round(duration)} ms`;
}

function getPercentile(values, percentile) {
  if (values.length === 0) {
    return undefined;
  }
  const sorted = values.toSorted((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * percentile))];
}

/**
 * Reads the update stats twice per second, with the frames per second since the last read.
 */
function useStatsSnapshot(statsRef) {
  const [snapshot, setSnapshot] = React.useState(null);

  React.useEffect(() => {
    let frameCount = 0;
    let windowStart = performance.now();
    let frame = requestAnimationFrame(function countFrame(now) {
      frameCount += 1;
      if (now - windowStart >= 500) {
        const { durations, updateCount, lastUpdate } = statsRef.current;
        setSnapshot({
          lastDuration: durations.at(-1),
          p95Duration: getPercentile(durations, 0.95),
          updateCount,
          lastUpdate,
          framesPerSecond: Math.round((frameCount * 1000) / (now - windowStart)),
        });
        frameCount = 0;
        windowStart = now;
      }
      frame = requestAnimationFrame(countFrame);
    });
    return () => cancelAnimationFrame(frame);
  }, [statsRef]);

  return snapshot;
}

function StatsPanel(props) {
  const { events, statsRef } = props;
  const snapshot = useStatsSnapshot(statsRef);

  const seriesCount = events.filter((event) => event.rrule != null).length;
  const exDateCount = events.reduce(
    (total, event) => total + (event.exDates?.length ?? 0),
    0,
  );

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" spacing={3} useFlexGap sx={{ flexWrap: 'wrap' }}>
        <Typography variant="body2">
          Last update: <b>{formatDuration(snapshot?.lastDuration)}</b>
        </Typography>
        <Typography variant="body2">
          p95 of the last {SAMPLE_COUNT}:{' '}
          <b>{formatDuration(snapshot?.p95Duration)}</b>
        </Typography>
        <Typography variant="body2">
          Frames per second: <b>{snapshot?.framesPerSecond ?? '–'}</b>
        </Typography>
        <Typography variant="body2">
          Updates: <b>{snapshot?.updateCount ?? 0}</b>
        </Typography>
        <Typography variant="body2">
          {seriesCount.toLocaleString()} recurring series,{' '}
          {(events.length - seriesCount).toLocaleString()} standalone events,{' '}
          {exDateCount.toLocaleString()} excluded dates
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" noWrap>
        {snapshot?.lastUpdate || 'No update yet'}
      </Typography>
    </Stack>
  );
}

export default function RecurringEventsStressTest() {
  const [seriesCount, setSeriesCount] = React.useState(2000);
  const [dataset, setDataset] = React.useState(null);
  const [events, setEvents] = React.useState([]);
  const [isLive, setIsLive] = React.useState(false);
  const [updateRate, setUpdateRate] = React.useState(5);
  const [displayTimezone, setDisplayTimezone] = React.useState('default');

  const eventsRef = React.useRef(events);
  const statsRef = React.useRef({
    durations: [],
    updateCount: 0,
    lastUpdate: '',
  });
  const updateStartRef = React.useRef(null);
  const visibleDayRef = React.useRef(toDay(new Date()));
  // The live updates replay the same sequence for each dataset.
  const liveRef = React.useRef({ random: createRandom(SEED), idCounter: 0 });

  const applyEvents = React.useCallback((nextEvents, description) => {
    statsRef.current.updateCount += 1;
    statsRef.current.lastUpdate = description;
    updateStartRef.current = performance.now();
    eventsRef.current = nextEvents;
    setEvents(nextEvents);
  }, []);

  // The dataset depends on the current date, so it's only built in the browser.
  React.useEffect(() => {
    const nextDataset = createGlobalCompanyDataset(seriesCount, SEED);
    liveRef.current = { random: createRandom(SEED), idCounter: 0 };
    statsRef.current = { durations: [], updateCount: 0, lastUpdate: '' };
    setDataset(nextDataset);
    applyEvents(
      nextDataset.events,
      `Loaded ${seriesCount.toLocaleString()} recurring series`,
    );
  }, [seriesCount, applyEvents]);

  React.useEffect(() => {
    const updateStart = updateStartRef.current;
    if (updateStart == null) {
      return;
    }
    updateStartRef.current = null;
    requestAnimationFrame(() => {
      const { durations } = statsRef.current;
      durations.push(performance.now() - updateStart);
      if (durations.length > SAMPLE_COUNT) {
        durations.shift();
      }
    });
  }, [events]);

  React.useEffect(() => {
    if (!isLive || dataset == null) {
      return undefined;
    }

    const interval = setInterval(() => {
      // The updates target the two weeks starting with the visible week.
      const firstDay = getMonday(visibleDayRef.current);
      const update = applyLiveUpdate(eventsRef.current, {
        random: liveRef.current.random,
        teams: dataset.teams,
        firstDay,
        lastDay: firstDay + 13,
        createId: () => {
          liveRef.current.idCounter += 1;
          return `live-${liveRef.current.idCounter}`;
        },
      });
      applyEvents(update.events, update.description);
    }, 1000 / updateRate);

    return () => clearInterval(interval);
  }, [isLive, updateRate, dataset, applyEvents]);

  const handleEventsChange = React.useCallback(
    (nextEvents) => applyEvents(nextEvents, 'Edited from the calendar'),
    [applyEvents],
  );

  const handleVisibleDateChange = React.useCallback((visibleDate) => {
    visibleDayRef.current = toDay(visibleDate);
  }, []);

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
      <StatsPanel events={events} statsRef={statsRef} />
      <Box sx={{ height: 800, width: '100%' }}>
        {dataset == null ? (
          <Typography>Building the calendar…</Typography>
        ) : (
          <EventCalendarPremium
            events={events}
            onEventsChange={handleEventsChange}
            resources={dataset.resources}
            displayTimezone={displayTimezone}
            onVisibleDateChange={handleVisibleDateChange}
          />
        )}
      </Box>
    </Stack>
  );
}
