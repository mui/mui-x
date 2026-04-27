import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import {
  EventTimelinePremium,
  eventTimelinePremiumClasses as classes,
} from '@mui/x-scheduler-premium/event-timeline-premium';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { EventTimelinePremiumPreset } from '@mui/x-scheduler-headless-premium/models';

type PresetExpectations = {
  preset: EventTimelinePremiumPreset;
  rowCount: number;
  tickWidth: number;
  totalTicks: number;
};

const engineering = ResourceBuilder.new().build();

const PRESET_EXPECTATIONS: PresetExpectations[] = [
  { preset: 'dayAndHour', rowCount: 2, tickWidth: 64, totalTicks: 4 * 24 },
  { preset: 'dayAndMonth', rowCount: 2, tickWidth: 120, totalTicks: 8 * 7 },
  { preset: 'dayAndWeek', rowCount: 2, tickWidth: 64, totalTicks: 16 * 7 },
  // monthAndYear: 36 months starting July 2025 → July 2025 to June 2028.
  // 184 (Jul-Dec 2025) + 365 + 365 + 182 (Jan-Jun 2028, leap) = 1096 days.
  { preset: 'monthAndYear', rowCount: 2, tickWidth: 6, totalTicks: 1096 },
  { preset: 'year', rowCount: 1, tickWidth: 200, totalTicks: 30 },
];

describe('<EventTimelinePremiumHeader />', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  function renderHeader(options: {
    preset: EventTimelinePremiumPreset;
    presets?: EventTimelinePremiumPreset[];
    defaultPreferences?: { ampm: boolean };
  }) {
    return render(
      <EventTimelinePremium
        resources={[engineering]}
        events={[]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        preset={options.preset}
        presets={options.presets ?? [options.preset]}
        defaultPreferences={options.defaultPreferences}
      />,
    );
  }

  function getTicksSum(row: Element): number {
    return Array.from(row.querySelectorAll(`.${classes.headerCell}`)).reduce((sum, cell) => {
      const span = (cell as HTMLElement).style.getPropertyValue('--span');
      return sum + (span ? Number(span) : 0);
    }, 0);
  }

  PRESET_EXPECTATIONS.forEach(({ preset, rowCount, tickWidth, totalTicks }) => {
    describe(`preset "${preset}"`, () => {
      it('should render one level row per preset header and span the full visible range', () => {
        renderHeader({ preset });

        const grid = screen.getByRole('grid');
        expect(grid.style.getPropertyValue('--unit-width')).to.equal(`${tickWidth}px`);
        // The grid root sets `--unit-count` from `presetConfig.unitCount`; assert it matches
        // the sum of header cell spans so a regression in either path is caught independently.
        expect(grid.style.getPropertyValue('--unit-count')).to.equal(String(totalTicks));

        const rows = grid.querySelectorAll(`.${classes.headerLevelRow}`);
        expect(rows.length).to.equal(rowCount);

        rows.forEach((row) => {
          expect(getTicksSum(row)).to.equal(totalTicks);
          const cells = Array.from(row.querySelectorAll<HTMLElement>(`.${classes.headerCell}`));
          cells.forEach((cell, expectedIndex) => {
            // Guards against a formatter silently returning '' / undefined: every cell
            // must render some visible text so labels never disappear.
            expect((cell.textContent ?? '').trim().length).to.be.greaterThan(0);
            // `data-index` must be contiguous and zero-based per row so virtualization
            // can rely on the index addressing every cell once.
            expect(cell.dataset.index).to.equal(String(expectedIndex));
          });
        });
      });
    });
  });

  describe('weekend marking', () => {
    // DEFAULT_TESTING_VISIBLE_DATE is 2025-07-03 (Thursday); visible range starts Monday Jun 30.
    it('should mark weekend day cells with data-weekend in `dayAndWeek` (where the day row is the leaf)', () => {
      renderHeader({ preset: 'dayAndWeek' });

      const dayCells = document.querySelectorAll<HTMLElement>(
        `.${classes.headerCell}[data-unit="day"]`,
      );
      const weekendCells = Array.from(dayCells).filter(
        (cell) => cell.dataset.weekend !== undefined,
      );
      // 16 weeks × 2 weekend days = 32 cells.
      expect(weekendCells.length).to.equal(32);
      weekendCells.forEach((cell) => {
        expect(cell.dataset.unitLeaf).to.equal(''); // leaf → colored red via CSS
      });
    });

    it('should still expose data-weekend on day cells even when the day row is a grouping level (accessibility)', () => {
      // dayAndHour: the day row is level 0 (grouping) with hour ticks below. Saturday should
      // still carry `data-weekend` for screen readers / custom CSS, but without data-unit-leaf.
      renderHeader({ preset: 'dayAndHour' });

      const dayCells = document.querySelectorAll<HTMLElement>(
        `.${classes.headerCell}[data-unit="day"]`,
      );
      const weekendCells = Array.from(dayCells).filter(
        (cell) => cell.dataset.weekend !== undefined,
      );
      // Visible range: Jul 3 (Thu), Jul 4 (Fri), Jul 5 (Sat), Jul 6 (Sun) → 2 weekend days.
      expect(weekendCells.length).to.equal(2);
      weekendCells.forEach((cell) => {
        // Grouping row → no leaf marker → CSS leaves it neutral, but the attribute is there.
        expect(cell.dataset.unitLeaf).to.equal(undefined);
      });
    });
  });

  describe('`dayAndMonth` month row clamping', () => {
    it('should size the first month row cell to the number of days remaining in the starting month', () => {
      // visibleDate Jul 03 2025 → first day cell is Jul 3 (startOfDay). July has 31 days,
      // so the first month cell spans Jul 3 through Jul 31 = 29 days.
      renderHeader({ preset: 'dayAndMonth' });

      const monthCells = document.querySelectorAll<HTMLElement>(
        `.${classes.headerCell}[data-unit="month"]`,
      );
      expect(monthCells.length).to.be.greaterThan(1);
      // Total span across all month cells must equal the 56-day visible range.
      const total = Array.from(monthCells).reduce(
        (sum, cell) => sum + Number(cell.style.getPropertyValue('--span')),
        0,
      );
      expect(total).to.equal(8 * 7);
      // First cell only contains the last 29 days of July.
      expect(Number(monthCells[0].style.getPropertyValue('--span'))).to.equal(29);
    });
  });

  describe('`dayAndHour` hour row ampm preference', () => {
    it('should format hour labels in 12h with AM/PM when ampm is true', () => {
      renderHeader({ preset: 'dayAndHour', defaultPreferences: { ampm: true } });

      const hourCell = document.querySelector<HTMLElement>(
        `.${classes.headerCell}[data-unit="hour"][data-index="0"]`,
      );
      expect(hourCell).not.to.equal(null);
      expect(hourCell!.textContent).to.match(/AM|PM/);
    });

    it('should format hour labels in 24h without AM/PM when ampm is false', () => {
      renderHeader({ preset: 'dayAndHour', defaultPreferences: { ampm: false } });

      const hourCell = document.querySelector<HTMLElement>(
        `.${classes.headerCell}[data-unit="hour"][data-index="0"]`,
      );
      expect(hourCell).not.to.equal(null);
      expect(hourCell!.textContent).to.not.match(/AM|PM/);
    });
  });

  describe('`dayAndMonth` renderCell escape hatch', () => {
    it('should render the weekday letter and day number as separate data-slot spans', () => {
      // This is the built-in `day` row's custom renderCell — exercising the escape hatch path.
      renderHeader({ preset: 'dayAndMonth' });

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
