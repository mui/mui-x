import {
  bulletList,
  creditAuthors,
  formatAuthor,
  formatDate,
  formatReference,
  joinBlocks,
  joinWords,
  labelValues,
  matchPrefix,
  parseTitle,
  section,
} from '@mui/internal-code-infra/changelog';
import type { ChangelogChange, ChangelogData } from '@mui/internal-code-infra/changelog';

const VERSION_PLACEHOLDER = '__VERSION__';
const DOCS = 'Docs';
const CORE = 'Core';
const MISCELLANEOUS = 'Miscellaneous';
const CODEMOD_LABEL = 'package: codemod';
const DOCS_LABEL = 'docs';
const TEST_PREFIX = 'test';

const EXCLUDED_LABELS = new Set(['dependencies', 'release']);

const PRO_ICON = `[![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')`;
const PREMIUM_ICON = `[![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')`;

/** The package or section of a title prefix, spelled in any case and with any separators. */
const PREFIXES = new Map([
  ['DataGrid', 'x-data-grid'],
  ['DataGridPro', 'x-data-grid-pro'],
  ['DataGridPremium', 'x-data-grid-premium'],
  ['DatePicker', 'x-date-pickers'],
  ['TimePicker', 'x-date-pickers'],
  ['DateTimePicker', 'x-date-pickers'],
  ['pickers', 'x-date-pickers'],
  ['fields', 'x-date-pickers'],
  ['DateRangeCalendar', 'x-date-pickers-pro'],
  ['DateRangePicker', 'x-date-pickers-pro'],
  ['DateTimeRangePicker', 'x-date-pickers-pro'],
  ['TimeRangePicker', 'x-date-pickers-pro'],
  ['charts', 'x-charts'],
  ['charts-pro', 'x-charts-pro'],
  ['charts-premium', 'x-charts-premium'],
  ['TreeView', 'x-tree-view'],
  ['RichTreeView', 'x-tree-view'],
  ['TreeItem', 'x-tree-view'],
  ['TreeViewPro', 'x-tree-view-pro'],
  ['RichTreeViewPro', 'x-tree-view-pro'],
  ['scheduler', 'x-scheduler'],
  ['scheduler-premium', 'x-scheduler-premium'],
  ['chat', 'x-chat'],
  ['chat-headless', 'x-chat-headless'],
  ['codemod', 'x-codemod'],
  ['code-infra', CORE],
  ['docs-infra', CORE],
  ['internal', CORE],
  ['support-infra', CORE],
]);

/** How a prefix is written in the changelog. */
const SPELLINGS = new Map([
  ['DataGrid', 'DataGrid'],
  ['x-virtualizer', 'virtualizer'],
]);

const L10N_PREFIXES = ['l10n', '118n'];

/** The package of a `scope:` label, for translations. */
const L10N_SCOPES = new Map([
  ['data grid', 'x-data-grid'],
  ['pickers', 'x-date-pickers'],
  ['charts', 'x-charts'],
  ['tree view', 'x-tree-view'],
  ['scheduler', 'x-scheduler'],
]);

/** A heading in the body of a pull request, above notes on how to migrate. */
const BREAKING_HEADING = /^(#{1,6})\s*breaking changes?\b.*$/im;

interface Product {
  name: string;
  /** Without the `@mui/` scope. */
  packageName: string;
  tiers: ('pro' | 'premium')[];
  /** Packages of their own, listed only when released. */
  companions?: string[];
  /** Left out when it has no changes, even if its version changed. */
  optional?: true;
}

const PRODUCTS: Product[] = [
  { name: 'Data Grid', packageName: 'x-data-grid', tiers: ['pro', 'premium'] },
  { name: 'Date and Time Pickers', packageName: 'x-date-pickers', tiers: ['pro'] },
  {
    name: 'Charts',
    packageName: 'x-charts',
    tiers: ['pro', 'premium'],
    companions: ['x-charts-vendor'],
  },
  { name: 'Tree View', packageName: 'x-tree-view', tiers: ['pro'] },
  { name: 'Scheduler', packageName: 'x-scheduler', tiers: ['premium'] },
  { name: 'Chat', packageName: 'x-chat', tiers: [], companions: ['x-chat-headless'] },
  { name: 'Codemod', packageName: 'x-codemod', tiers: [], optional: true },
];

const TIER_ICONS = { pro: PRO_ICON, premium: PREMIUM_ICON };

interface Entry {
  change: ChangelogChange;
  /** The prefixes to show: the one that routed it here, if any. */
  prefixes: string[];
}

function compareText(a: string, b: string) {
  return a.localeCompare(b);
}

function spell(prefix: string) {
  const known = matchPrefix(prefix, SPELLINGS.keys());

  return known ? (SPELLINGS.get(known) ?? prefix) : prefix;
}

function getPackage(data: ChangelogData, packageName: string) {
  return data.packages.find(({ path }) => path === `packages/${packageName}`);
}

function createRouter() {
  return (change: ChangelogChange): [string, string[]][] => {
    const { prefixes } = parseTitle(change.title);

    if (change.labels.includes(CODEMOD_LABEL)) {
      return [['x-codemod', prefixes]];
    }

    // `[docs][charts]` is a docs change, and so is one labeled `docs` that no product scope claims.
    const isDocs =
      prefixes.some((prefix) => matchPrefix(prefix, [DOCS])) ||
      (change.labels.includes(DOCS_LABEL) &&
        !labelValues(change.labels, 'scope').some((scope) => L10N_SCOPES.has(scope)));

    if (isDocs) {
      return [[DOCS, prefixes]];
    }

    // `[test][charts]` is a test change.
    const test = prefixes.find((prefix) => matchPrefix(prefix, [TEST_PREFIX]));

    if (test) {
      return [[MISCELLANEOUS, [test]]];
    }

    // `[tree view][scheduler]` is listed in both, with its own prefix in each.
    const routes = prefixes.flatMap((prefix): [string, string[]][] => {
      const known = matchPrefix(prefix, PREFIXES.keys());
      const group = known && PREFIXES.get(known);

      if (group) {
        return [[group, [prefix]]];
      }

      if (!matchPrefix(prefix, L10N_PREFIXES)) {
        return [];
      }

      return labelValues(change.labels, 'scope').flatMap((scope): [string, string[]][] => {
        const packageName = L10N_SCOPES.get(scope);

        return packageName ? [[packageName, prefixes]] : [];
      });
    });

    // The first prefix of a group is the one shown: `[DataGrid][data grid]` is listed once.
    const unique = new Map<string, string[]>();

    for (const [group, shown] of routes) {
      if (!unique.has(group)) {
        unique.set(group, shown);
      }
    }

    return unique.size > 0 ? [...unique] : [[MISCELLANEOUS, prefixes]];
  };
}

function groupChanges(changes: ChangelogChange[], route: ReturnType<typeof createRouter>) {
  const groups = new Map<string, Entry[]>();

  for (const change of changes) {
    for (const [group, prefixes] of route(change)) {
      groups.set(group, [...(groups.get(group) ?? []), { change, prefixes }]);
    }
  }

  return groups;
}

function renderLine({ change, prefixes }: Entry) {
  const shown = prefixes.map((prefix) => `[${spell(prefix)}]`).join('');

  return joinWords(shown, parseTitle(change.title).text);
}

function renderEntries(entries: Entry[] = []) {
  return bulletList(
    entries
      .map((entry) => ({ entry, line: renderLine(entry) }))
      .sort(
        (a, b) =>
          compareText(a.line, b.line) ||
          (a.entry.change.pullRequest?.number ?? 0) - (b.entry.change.pullRequest?.number ?? 0),
      )
      .map(({ entry, line }) =>
        joinWords(line, `(${formatReference(entry.change)})`, formatAuthor(entry.change.author)),
      ),
  );
}

/** The section on breaking changes in the body of a pull request, without its heading. */
function getBreakingNotes({ pullRequest }: ChangelogChange) {
  const body = (pullRequest?.body ?? '').replace(/\r\n/g, '\n');
  const heading = BREAKING_HEADING.exec(body);

  if (!heading) {
    return '';
  }

  const rest = body.slice(heading.index + heading[0].length);
  const end = rest.search(new RegExp(`^#{1,${heading[1].length}}\\s`, 'm'));

  return (end === -1 ? rest : rest.slice(0, end)).trim();
}

function renderBreakingChanges(entries: Entry[]) {
  const notes = [...new Set(entries.map(({ change }) => change))].flatMap((change) => {
    const note = getBreakingNotes(change);

    if (!note) {
      return [];
    }

    return note.startsWith('- ') ? [note] : [bulletList([note])];
  });

  return section('#### Breaking changes', notes);
}

function compareLogins(a: string, b: string) {
  return compareText(a.toLowerCase(), b.toLowerCase());
}

function renderContributors(changes: ChangelogChange[]) {
  const people = changes.filter(({ author }) => !author?.isBot);
  const { all, team, community } = creditAuthors(people);
  const members = team.map(formatAuthor).sort(compareLogins);
  const contributors = community.map(formatAuthor).sort(compareLogins);

  return joinBlocks(
    `We'd like to extend a big thank you to the ${all.length} contributors who made this release possible. Here are some highlights ✨:`,
    'TODO INSERT HIGHLIGHTS',
    contributors.length === 1 &&
      `Special thanks go out to community member ${contributors[0]} for their valuable contribution.`,
    contributors.length > 1 &&
      `Special thanks go out to these community members for their valuable contributions:\n${contributors.join(', ')}`,
    members.length > 0 &&
      `The following team members contributed to this release:\n${members.join(', ')}`,
  );
}

function renderProduct(
  { name, packageName, tiers, companions = [], optional }: Product,
  groups: Map<string, Entry[]>,
  data: ChangelogData,
  nextVersion: string | undefined,
) {
  const getVersion = (pkg: string) =>
    (nextVersion && getPackage(data, pkg)?.version) || VERSION_PLACEHOLDER;

  const isReleased = (pkg: string) => !nextVersion || getPackage(data, pkg)?.changed !== false;

  const version = getVersion(packageName);
  const tierPackages = tiers.map((tier) => `${packageName}-${tier}`);
  const shownCompanions = companions.filter((pkg) => groups.has(pkg) || isReleased(pkg));
  const packages = [packageName, ...tierPackages, ...shownCompanions];
  const hasChanges = packages.some((pkg) => groups.has(pkg));
  const isBumped = [packageName, ...shownCompanions].some(isReleased);

  if (!hasChanges && (optional || !isBumped)) {
    return '';
  }

  const base = `\`@mui/${packageName}@${version}\``;
  let previous = base;

  return joinBlocks(
    `### ${name}`,
    renderBreakingChanges(packages.flatMap((pkg) => groups.get(pkg) ?? [])),
    `#### ${base}`,
    renderEntries(groups.get(packageName)) || 'Internal changes.',
    tiers.map((tier, index) => {
      const tierPackage = `\`@mui/${tierPackages[index]}@${version}\``;
      const entries = renderEntries(groups.get(tierPackages[index]));
      const sameAs = previous;
      previous = tierPackage;

      return joinBlocks(
        `#### ${tierPackage} ${TIER_ICONS[tier]}`,
        entries ? `Same changes as in ${sameAs}, plus:` : `Same changes as in ${sameAs}.`,
        entries,
      );
    }),
    shownCompanions.map((pkg) =>
      joinBlocks(
        `#### \`@mui/${pkg}@${getVersion(pkg)}\``,
        renderEntries(groups.get(pkg)) || 'Internal changes.',
      ),
    ),
  );
}

/** The local day of the run, as UTC midnight, since `formatDate` prints the UTC day. */
export function getReleaseDate() {
  const now = new Date();

  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

/**
 * The changelog of a release, for CHANGELOG.md. Without `nextVersion`, versions are
 * `__VERSION__` placeholders.
 */
export function renderChangelog(data: ChangelogData, nextVersion?: string) {
  const listed = data.changes.filter(
    ({ labels }) => !labels.some((label) => EXCLUDED_LABELS.has(label)),
  );

  const groups = groupChanges(listed, createRouter());

  return joinBlocks(
    [
      `## ${nextVersion || VERSION_PLACEHOLDER}`,
      `<!-- generated comparing ${data.previous.ref}..${data.release.ref} -->`,
      `_${formatDate(data.date)}_`,
    ].join('\n'),
    renderContributors(data.changes),
    PRODUCTS.map((product) => renderProduct(product, groups, data, nextVersion)),
    [DOCS, CORE, MISCELLANEOUS].map((name) =>
      section(`### ${name}`, renderEntries(groups.get(name))),
    ),
  );
}
