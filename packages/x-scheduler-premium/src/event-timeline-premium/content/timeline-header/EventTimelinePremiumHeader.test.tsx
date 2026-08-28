import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import {
  EventTimelinePremium,
  eventTimelinePremiumClasses as classes,
} from '@mui/x-scheduler-premium/event-timeline-premium';
import {
  adapter,
  absorbObserverFrames,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  ResourceBuilder,
} from 'test/utils/scheduler';
import type {
  EventTimelinePremiumPreset,
  EventTimelinePremiumPresetConfig,
} from '@mui/x-scheduler-internals-premium/models';
import { describe, it, expect } from 'vitest';

type PresetExpectations = {
  preset: EventTimelinePremiumPreset;
  rowCount: number;
  tickWidth: number;
  totalTicks: number;
  // Index of the row whose unit matches `timeResolution`, or `null` if no row does
  // (e.g. monthAndYear renders year+month rows but ticks in days). The styled wrapper
  // applies leaf-only padding via `data-unit-leaf`, so these tests pin which row carries it.
  leafRowIndex: number | null;
};

const engineering = ResourceBuilder.new().build();

const PRESET_EXPECTATIONS: PresetExpectations[] = [
  { preset: 'dayAndHour', rowCount: 2, tickWidth: 64, totalTicks: 4 * 24, leafRowIndex: 1 },
  { preset: 'dayAndMonth', rowCount: 2, tickWidth: 120, totalTicks: 8 * 7, leafRowIndex: 1 },
  { preset: 'dayAndWeek', rowCount: 2, tickWidth: 64, totalTicks: 16 * 7, leafRowIndex: 1 },
  // monthAndYear: 36 months starting July 2025 → July 2025 to June 2028.
  // 184 (Jul-Dec 2025) + 365 + 365 + 182 (Jan-Jun 2028, leap) = 1096 days.
  { preset: 'monthAndYear', rowCount: 2, tickWidth: 6, totalTicks: 1096, leafRowIndex: null },
  { preset: 'year', rowCount: 1, tickWidth: 200, totalTicks: 30, leafRowIndex: 0 },
];

describe('<EventTimelinePremiumHeader />', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  async function renderHeader(options: {
    preset: EventTimelinePremiumPreset;
    presets?: EventTimelinePremiumPreset[];
    defaultPreferences?: { ampm: boolean };
    visibleDate?: typeof DEFAULT_TESTING_VISIBLE_DATE;
    presetConfig?: EventTimelinePremiumPresetConfig;
  }) {
    // The grid is virtualized; sizing the host wide enough to fit the largest preset
    // (1096 days × 6px = 6576px plus the title column) keeps every header cell mounted
    // so the structural assertions can inspect them all without simulating scrolls.
    const view = render(
      <div style={{ width: 10000, height: 2000 }}>
        <EventTimelinePremium
          resources={[engineering]}
          events={[]}
          visibleDate={options.visibleDate ?? DEFAULT_TESTING_VISIBLE_DATE}
          preset={options.preset}
          presets={options.presets ?? [options.preset]}
          presetConfig={options.presetConfig}
          defaultPreferences={options.defaultPreferences}
        />
      </div>,
    );
    // The title-column and viewport observers deliver on the frames after the render,
    // outside act; absorb them so they cannot fail the run as un-acted updates.
    await absorbObserverFrames();
    return view;
  }

  function getTicksSum(row: Element): number {
    return Array.from(row.querySelectorAll(`.${classes.headerCell}`)).reduce((sum, cell) => {
      const span = (cell as HTMLElement).style.getPropertyValue('--span');
      return sum + (span ? Number(span) : 0);
    }, 0);
  }

  PRESET_EXPECTATIONS.forEach(({ preset, rowCount, tickWidth, totalTicks, leafRowIndex }) => {
    describe(`preset "${preset}"`, () => {
      it('should render one level row per preset header and span the full visible range', async () => {
        await renderHeader({ preset });

        const grid = screen.getByRole('grid');
        const container = grid.closest('section')!;
        expect(container.style.getPropertyValue('--unit-width')).to.equal(`${tickWidth}px`);
        // The grid root sets `--unit-count` from `presetConfig.tickCount`; assert it matches
        // the sum of header cell spans so a regression in either path is caught independently.
        expect(grid.style.getPropertyValue('--unit-count')).to.equal(String(totalTicks));

        const rows = grid.querySelectorAll(`.${classes.headerLevelRow}`);
        expect(rows.length).to.equal(rowCount);

        rows.forEach((row, rowIndex) => {
          expect(getTicksSum(row)).to.equal(totalTicks);
          const cells = Array.from(row.querySelectorAll<HTMLElement>(`.${classes.headerCell}`));
          const isLeafRow = rowIndex === leafRowIndex;
          cells.forEach((cell, expectedIndex) => {
            expect((cell.textContent ?? '').trim().length).to.be.greaterThan(0);
            // `data-index` must be contiguous and zero-based per row so virtualization
            // can rely on the index addressing every cell once.
            expect(cell.dataset.index).to.equal(String(expectedIndex));
            // The styled wrapper relies on `data-unit-leaf` for leaf-only padding rules,
            // so the marker must cover every cell of the leaf row and be absent on the rest.
            expect(cell.dataset.unitLeaf).to.equal(isLeafRow ? '' : undefined);
          });
        });
      });
    });
  });

  describe('formatDate content', () => {
    it('should render the formatDate result as the cell label', async () => {
      await renderHeader({ preset: 'monthAndYear' });

      // Visible range Jul 2025 → Jun 2028.
      const yearCells = document.querySelectorAll<HTMLElement>(
        `.${classes.headerCell}[data-unit="year"]`,
      );
      expect(yearCells[0].textContent).to.equal('2025');

      const monthCells = document.querySelectorAll<HTMLElement>(
        `.${classes.headerCell}[data-unit="month"]`,
      );
      expect(monthCells[0].textContent).to.equal('Jul');
    });
  });

  describe('<time> semantics', () => {
    it('should wrap every cell label in a <time> element with an ISO dateTime', async () => {
      await renderHeader({ preset: 'dayAndHour' });

      const hourCells = document.querySelectorAll<HTMLElement>(
        `.${classes.headerCell}[data-unit="hour"]`,
      );
      expect(hourCells.length).to.equal(4 * 24);
      hourCells.forEach((cell) => {
        expect(cell.querySelector('time')).not.to.equal(null);
      });

      // Lock in tag + format together so a regression to <span> or a format change both fail.
      expect(hourCells[0].querySelector('time[datetime="2025-07-03T00:00"]')).not.to.equal(null);
    });
  });

  describe('weekend marking', () => {
    // DEFAULT_TESTING_VISIBLE_DATE is 2025-07-03 (Thursday); the test adapter has no
    // locale configured, so date-fns starts weeks on Sunday → first cell is Sun Jun 29.
    it('should mark weekend day cells with data-weekend in `dayAndWeek` (where the day row is the leaf)', async () => {
      await renderHeader({ preset: 'dayAndWeek' });

      const dayCells = Array.from(
        document.querySelectorAll<HTMLElement>(`.${classes.headerCell}[data-unit="day"]`),
      );
      const weekendCells = dayCells.filter((cell) => cell.dataset.weekend !== undefined);
      // 16 weeks × 2 weekend days = 32 cells.
      expect(weekendCells.length).to.equal(32);
      weekendCells.forEach((cell) => {
        expect(cell.dataset.unitLeaf).to.equal(''); // leaf → colored red via CSS
      });

      // First week: Sun Jun 29 → Sat Jul 5. Lock in that both Sun and Sat are flagged
      // (a Sat-only or Sun-only bug would still pass the count check above).
      const firstWeek = dayCells.slice(0, 7);
      expect(firstWeek[0].dataset.weekend).to.equal(''); // Sun
      [1, 2, 3, 4, 5].forEach((i) => expect(firstWeek[i].dataset.weekend).to.equal(undefined));
      expect(firstWeek[6].dataset.weekend).to.equal(''); // Sat
    });

    it('should still expose data-weekend on day cells even when the day row is a grouping level (accessibility)', async () => {
      // dayAndHour: the day row is level 0 (grouping) with hour ticks below. Saturday should
      // still carry `data-weekend` for screen readers / custom CSS, but without data-unit-leaf.
      await renderHeader({ preset: 'dayAndHour' });

      const dayCells = Array.from(
        document.querySelectorAll<HTMLElement>(`.${classes.headerCell}[data-unit="day"]`),
      );
      const weekendCells = dayCells.filter((cell) => cell.dataset.weekend !== undefined);
      // Visible range: Jul 3 (Thu), Jul 4 (Fri), Jul 5 (Sat), Jul 6 (Sun) → 2 weekend days.
      expect(weekendCells.length).to.equal(2);
      weekendCells.forEach((cell) => {
        // Grouping row → no leaf marker → CSS leaves it neutral, but the attribute is there.
        expect(cell.dataset.unitLeaf).to.equal(undefined);
      });

      // Per-cell check: Sat (index 2) and Sun (index 3) are flagged, Thu/Fri are not.
      expect(dayCells[0].dataset.weekend).to.equal(undefined); // Thu
      expect(dayCells[1].dataset.weekend).to.equal(undefined); // Fri
      expect(dayCells[2].dataset.weekend).to.equal(''); // Sat
      expect(dayCells[3].dataset.weekend).to.equal(''); // Sun
    });
  });

  describe('`dayAndMonth` month row clamping', () => {
    it('should clamp the first and last month cells to the visible range', async () => {
      // visibleDate Jul 03 2025 → first day cell is Jul 3 (startOfDay). The 56-day window
      // (8 weeks) ends on Aug 27, so the month row should produce exactly two cells:
      //   - July: Jul 3 → Jul 31 = 29 days (clamped at the start)
      //   - August: Aug 1 → Aug 27 = 27 days (clamped at the end)
      await renderHeader({ preset: 'dayAndMonth' });

      const monthCells = document.querySelectorAll<HTMLElement>(
        `.${classes.headerCell}[data-unit="month"]`,
      );
      expect(monthCells.length).to.equal(2);
      expect(Number(monthCells[0].style.getPropertyValue('--span'))).to.equal(29);
      expect(Number(monthCells[1].style.getPropertyValue('--span'))).to.equal(27);
    });
  });

  describe('`dayAndHour` hour row ampm preference', () => {
    it('should format hour labels in 12h with AM/PM when ampm is true', async () => {
      await renderHeader({ preset: 'dayAndHour', defaultPreferences: { ampm: true } });

      const hourCell = document.querySelector<HTMLElement>(
        `.${classes.headerCell}[data-unit="hour"][data-index="0"]`,
      );
      expect(hourCell).not.to.equal(null);
      expect(hourCell!.textContent).to.match(/AM|PM/);
    });

    it('should format hour labels in 24h without AM/PM when ampm is false', async () => {
      await renderHeader({ preset: 'dayAndHour', defaultPreferences: { ampm: false } });

      const hourCell = document.querySelector<HTMLElement>(
        `.${classes.headerCell}[data-unit="hour"][data-index="0"]`,
      );
      expect(hourCell).not.to.equal(null);
      expect(hourCell!.textContent).to.not.match(/AM|PM/);
    });
  });

  describe('`dayAndHour` hour row across a DST transition', () => {
    // Mar 8 2026 in America/New_York skips the 02:00 wall-clock hour; Nov 2 2025 repeats
    // the 01:00 one. The hour row is a wall-clock grid, so both days show the same columns
    // as any other day, matching the Event Calendar's time axis.
    const springForward = adapter.date('2026-03-08T00:00:00', 'America/New_York');
    const fallBack = adapter.date('2025-11-02T00:00:00', 'America/New_York');

    function getHourLabels(dayIndex: number, hoursPerDay: number) {
      const cells = Array.from(
        document.querySelectorAll<HTMLElement>(`.${classes.headerCell}[data-unit="hour"]`),
      );
      return cells
        .slice(dayIndex * hoursPerDay, (dayIndex + 1) * hoursPerDay)
        .map((cell) => cell.textContent);
    }

    it('should label the hour skipped by the spring-forward transition', async () => {
      await renderHeader({
        preset: 'dayAndHour',
        visibleDate: springForward,
        defaultPreferences: { ampm: true },
      });

      expect(getHourLabels(0, 24).slice(0, 5)).to.deep.equal([
        '12:00 AM',
        '1:00 AM',
        '2:00 AM',
        '3:00 AM',
        '4:00 AM',
      ]);
    });

    it('should label the hour repeated by the fall-back transition once', async () => {
      await renderHeader({
        preset: 'dayAndHour',
        visibleDate: fallBack,
        defaultPreferences: { ampm: true },
      });

      expect(getHourLabels(0, 24).slice(0, 5)).to.deep.equal([
        '12:00 AM',
        '1:00 AM',
        '2:00 AM',
        '3:00 AM',
        '4:00 AM',
      ]);
    });

    it('should build the dateTime of the skipped hour from its wall-clock hour', async () => {
      await renderHeader({ preset: 'dayAndHour', visibleDate: springForward });

      const hourCells = document.querySelectorAll<HTMLElement>(
        `.${classes.headerCell}[data-unit="hour"]`,
      );
      expect(hourCells[2].querySelector('time')!.getAttribute('datetime')).to.equal(
        '2026-03-08T02:00',
      );
    });

    it('should keep the hour row aligned with the day row when the window starts on the skipped hour', async () => {
      await renderHeader({
        preset: 'dayAndHour',
        visibleDate: springForward,
        presetConfig: { dayAndHour: { startTime: 2, endTime: 20 } },
        defaultPreferences: { ampm: true },
      });

      const dayCells = Array.from(
        document.querySelectorAll<HTMLElement>(`.${classes.headerCell}[data-unit="day"]`),
      );
      expect(Number(dayCells[0].style.getPropertyValue('--span'))).to.equal(18);
      expect(getHourLabels(0, 18)[0]).to.equal('2:00 AM');
      expect(getHourLabels(0, 18).length).to.equal(18);
    });
  });

  describe('`dayAndMonth` renderCell escape hatch', () => {
    it('should render the weekday letter and day number as separate data-slot spans', async () => {
      // This is the built-in `day` row's custom renderCell — exercising the escape hatch path.
      await renderHeader({ preset: 'dayAndMonth' });

      const dayCells = document.querySelectorAll<HTMLElement>(
        `.${classes.headerCell}[data-unit="day"]`,
      );
      expect(dayCells.length).to.equal(8 * 7);
      dayCells.forEach((cell) => {
        expect(cell.querySelector('[data-slot="weekday"]')).not.to.equal(null);
        expect(cell.querySelector('[data-slot="dayOfMonth"]')).not.to.equal(null);
      });
    });
  });
});
