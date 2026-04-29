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

  PRESET_EXPECTATIONS.forEach(({ preset, rowCount, tickWidth, totalTicks, leafRowIndex }) => {
    describe(`preset "${preset}"`, () => {
      it('should render one level row per preset header and span the full visible range', () => {
        renderHeader({ preset });

        const grid = screen.getByRole('grid');
        expect(grid.style.getPropertyValue('--unit-width')).to.equal(`${tickWidth}px`);
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
    it('should render the formatDate result as the cell label', () => {
      renderHeader({ preset: 'monthAndYear' });

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
    it('should wrap every cell label in a <time> element with an ISO dateTime', () => {
      renderHeader({ preset: 'dayAndHour' });

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
    it('should mark weekend day cells with data-weekend in `dayAndWeek` (where the day row is the leaf)', () => {
      renderHeader({ preset: 'dayAndWeek' });

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

    it('should still expose data-weekend on day cells even when the day row is a grouping level (accessibility)', () => {
      // dayAndHour: the day row is level 0 (grouping) with hour ticks below. Saturday should
      // still carry `data-weekend` for screen readers / custom CSS, but without data-unit-leaf.
      renderHeader({ preset: 'dayAndHour' });

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
    it('should clamp the first and last month cells to the visible range', () => {
      // visibleDate Jul 03 2025 → first day cell is Jul 3 (startOfDay). The 56-day window
      // (8 weeks) ends on Aug 27, so the month row should produce exactly two cells:
      //   - July: Jul 3 → Jul 31 = 29 days (clamped at the start)
      //   - August: Aug 1 → Aug 27 = 27 days (clamped at the end)
      renderHeader({ preset: 'dayAndMonth' });

      const monthCells = document.querySelectorAll<HTMLElement>(
        `.${classes.headerCell}[data-unit="month"]`,
      );
      expect(monthCells.length).to.equal(2);
      expect(Number(monthCells[0].style.getPropertyValue('--span'))).to.equal(29);
      expect(Number(monthCells[1].style.getPropertyValue('--span'))).to.equal(27);
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

  describe('aria semantics', () => {
    it('should set role="row" on each inner level row', () => {
      renderHeader({ preset: 'dayAndHour' });

      const levelRows = document.querySelectorAll<HTMLElement>(`.${classes.headerLevelRow}`);
      expect(levelRows.length).to.equal(2);
      levelRows.forEach((row) => {
        expect(row.getAttribute('role')).to.equal('row');
      });
    });

    it('should set role="columnheader" and aria-colindex on each header cell, offset by 1 for the title column', () => {
      renderHeader({ preset: 'dayAndHour' });

      const leafCells = Array.from(
        document.querySelectorAll<HTMLElement>(`.${classes.headerCell}[data-unit-leaf=""]`),
      );
      expect(leafCells.length).to.equal(4 * 24);
      leafCells.forEach((cell, i) => {
        expect(cell.getAttribute('role')).to.equal('columnheader');
        expect(cell.getAttribute('aria-colindex')).to.equal(String(i + 2));
      });
    });

    it('should set aria-colspan on grouping cells whose spanInTicks > 1 and omit it on single-tick cells', () => {
      renderHeader({ preset: 'dayAndHour' });

      const dayCells = Array.from(
        document.querySelectorAll<HTMLElement>(`.${classes.headerCell}[data-unit="day"]`),
      );
      expect(dayCells.length).to.equal(4);
      dayCells.forEach((cell) => {
        expect(cell.getAttribute('aria-colspan')).to.equal('24');
      });

      const hourCells = document.querySelectorAll<HTMLElement>(
        `.${classes.headerCell}[data-unit="hour"]`,
      );
      hourCells.forEach((cell) => {
        expect(cell.getAttribute('aria-colspan')).to.equal(null);
      });
    });

    it('should set aria-colspan to the clamped span on partial first/last grouping cells', () => {
      renderHeader({ preset: 'dayAndMonth' });

      const monthCells = Array.from(
        document.querySelectorAll<HTMLElement>(`.${classes.headerCell}[data-unit="month"]`),
      );
      expect(monthCells.length).to.equal(2);
      expect(monthCells[0].getAttribute('aria-colspan')).to.equal('29');
      expect(monthCells[1].getAttribute('aria-colspan')).to.equal('27');
    });

    it('should set aria-colcount and aria-rowcount on the grid root', () => {
      renderHeader({ preset: 'dayAndHour' });

      const grid = screen.getByRole('grid');
      // tickCount (4*24) + 1 title column = 97
      expect(grid.getAttribute('aria-colcount')).to.equal(String(4 * 24 + 1));
      // 1 header + 1 resource = 2
      expect(grid.getAttribute('aria-rowcount')).to.equal('2');
    });
  });
});
