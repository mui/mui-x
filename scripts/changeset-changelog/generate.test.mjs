/**
 * Snapshot test for the changeset changelog generator, run against the
 * `sample/.changeset` fixtures. Built on the Node test runner so it needs no
 * vitest project wiring (`scripts/` is outside the vitest workspace).
 *
 *   node --test scripts/changeset-changelog/generate.test.mjs
 *
 * Package versions are normalized to `__VERSION__` so release bumps don't break
 * the snapshot. The fixtures carry explicit `pr`/`author` frontmatter, so the
 * output is deterministic and never touches git.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const generate = path.join(here, 'generate.mjs');
const sampleDir = path.join(here, 'sample', '.changeset');

const EXPECTED = `### Data Grid

#### \`@mui/x-data-grid@__VERSION__\`

- [DataGrid] Fix scrollbar disappearing after multiple resizes. (#1234567895) @FakeAuthor

  The virtualizer now recomputes the scrollbar size on every resize observer
  callback instead of only on the first one, so rapid drag-resizes no longer
  leave the grid without a scrollbar.
- [l10n] Improve Swedish (svSE) locale. (#1234567890) @FakeAuthor

#### \`@mui/x-data-grid-pro@__VERSION__\` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in \`@mui/x-data-grid@__VERSION__\`, plus:

- [DataGridPro] Add keyboard navigation between pinned and scrollable column regions. (#1234567893) @FakeAuthor

#### \`@mui/x-data-grid-premium@__VERSION__\` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in \`@mui/x-data-grid-pro@__VERSION__\`.

### Date and Time Pickers

#### \`@mui/x-date-pickers@__VERSION__\`

Internal changes.

#### \`@mui/x-date-pickers-pro@__VERSION__\` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in \`@mui/x-date-pickers@__VERSION__\`, plus:

- [DateRangeCalendar] Use Pointer Events for drag editing in \`DateRangeCalendar\`. (#1234567892) @FakeContributor

  Replaces the old drag-and-touch event combination with a single Pointer
  Events implementation, fixing inconsistent range selection on touch devices.

### Charts

#### \`@mui/x-charts@__VERSION__\`

- [charts] Add \`data-series\` to elements of the radar chart. (#1234567894) @FakeContributor

#### \`@mui/x-charts-pro@__VERSION__\` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in \`@mui/x-charts@__VERSION__\`.

#### \`@mui/x-charts-premium@__VERSION__\` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in \`@mui/x-charts-pro@__VERSION__\`, plus:

- [charts-premium] Add a \`closePath\` option to the radial line series. (#1234567891) @FakeContributor`;

/** Replace concrete package versions (or the `__VERSION__` fallback) so the
 * snapshot is stable across releases. */
function normalizeVersions(output) {
  return output.replace(/@(?:\d+\.\d+\.\d+(?:-[A-Za-z0-9.]+)?|__VERSION__)/g, '@__VERSION__');
}

test('generate renders the sample changesets in MUI X changelog format', () => {
  const raw = execFileSync('node', [generate, sampleDir], { encoding: 'utf8' });
  assert.equal(normalizeVersions(raw).trim(), EXPECTED);
});
