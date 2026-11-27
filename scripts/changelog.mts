import {
  bulletList,
  creditAuthors,
  formatAuthor,
  formatDate,
  formatReference,
  groupBy,
  joinBlocks,
  joinWords,
  labelValues,
  parseTitle,
  section,
} from '@mui/internal-code-infra/changelog';
import type { ChangelogChange, ChangelogData } from '@mui/internal-code-infra/changelog';

const VERSION_PLACEHOLDER = '__VERSION__';
const DOCS = 'Docs';
const CORE = 'Core';
const MISCELLANEOUS = 'Miscellaneous';
const CODEMOD_LABEL = 'package: codemod';

const EXCLUDED_LABELS = new Set(['dependencies']);

const PRO_ICON = `[![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')`;
const PREMIUM_ICON = `[![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')`;

/** The package or section of a title prefix. Prefixes match as written. */
const PREFIXES = new Map([
  ['DataGrid', 'x-data-grid'],
  ['data grid', 'x-data-grid'],
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
  ['tree view', 'x-tree-view'],
  ['TreeItem', 'x-tree-view'],
  ['RichTreeViewPro', 'x-tree-view-pro'],
  ['tree view pro', 'x-tree-view-pro'],
  ['scheduler', 'x-scheduler'],
  ['scheduler-premium', 'x-scheduler-premium'],
  ['codemod', 'x-codemod'],
  ['internal', CORE],
  ['support-infra', CORE],
  ['code-infra', CORE],
  ['docs-infra', CORE],
]);

const L10N_PREFIXES = new Set(['l10n', '118n']);

/** The package of a `scope:` label, for translations. */
const L10N_SCOPES = new Map([
  ['data grid', 'x-data-grid'],
  ['pickers', 'x-date-pickers'],
  ['charts', 'x-charts'],
  ['tree view', 'x-tree-view'],
  ['scheduler', 'x-scheduler'],
]);

interface Product {
  name: string;
  /** Without the `@mui/` scope. */
  packageName: string;
  tiers: ('pro' | 'premium')[];
  /** Left out when it has no changes, even if its version changed. */
  optional?: true;
}

const PRODUCTS: Product[] = [
  { name: 'Data Grid', packageName: 'x-data-grid', tiers: ['pro', 'premium'] },
  { name: 'Date and Time Pickers', packageName: 'x-date-pickers', tiers: ['pro'] },
  { name: 'Charts', packageName: 'x-charts', tiers: ['pro', 'premium'] },
  { name: 'Tree View', packageName: 'x-tree-view', tiers: ['pro'] },
  { name: 'Scheduler', packageName: 'x-scheduler', tiers: ['premium'] },
  { name: 'Codemod', packageName: 'x-codemod', tiers: [], optional: true },
];

const TIER_ICONS = { pro: PRO_ICON, premium: PREMIUM_ICON };

function compareText(a: string, b: string) {
  return a.localeCompare(b);
}

/** The title prefixes, in alphabetical order. */
function getPrefixes({ title }: ChangelogChange) {
  return parseTitle(title).prefixes.sort(compareText);
}

function route(change: ChangelogChange) {
  if (change.labels.includes(CODEMOD_LABEL)) {
    return 'x-codemod';
  }

  const prefixes = getPrefixes(change);

  // `[docs][charts]` is a docs change.
  if (prefixes.includes('docs')) {
    return DOCS;
  }

  // Only the first prefix in alphabetical order counts: `[l10n][DataGrid]` is a Data Grid change.
  const [prefix = ''] = prefixes;

  if (!L10N_PREFIXES.has(prefix)) {
    return PREFIXES.get(prefix) ?? MISCELLANEOUS;
  }

  const packages = labelValues(change.labels, 'scope').flatMap((scope) => {
    const packageName = L10N_SCOPES.get(scope);

    return packageName ? [packageName] : [];
  });

  return packages.length > 0 ? packages : MISCELLANEOUS;
}

/** By prefixes, then by message. */
function compareChanges(a: ChangelogChange, b: ChangelogChange) {
  const order = compareText(getPrefixes(a).join(','), getPrefixes(b).join(','));

  if (order !== 0) {
    return order;
  }

  return a.message < b.message ? -1 : 1;
}

function renderEntries(changes: ChangelogChange[] = []) {
  return bulletList(
    [...changes]
      .sort(compareChanges)
      .map((change) =>
        joinWords(change.title, `(${formatReference(change)})`, formatAuthor(change.author)),
      ),
  );
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
  { name, packageName, tiers, optional }: Product,
  groups: Map<string, ChangelogChange[]>,
  data: ChangelogData,
  nextVersion: string | undefined,
) {
  const pkg = data.packages.find(({ path }) => path === `packages/${packageName}`);
  const version = (nextVersion && pkg?.version) || VERSION_PLACEHOLDER;
  const tierPackages = tiers.map((tier) => `${packageName}-${tier}`);
  const hasChanges = [packageName, ...tierPackages].some((group) => groups.has(group));

  // Without the next version, every product is listed so that the release manager can pick.
  const isBumped = !nextVersion || pkg?.changed !== false;

  if (!hasChanges && (optional || !isBumped)) {
    return '';
  }

  const base = `\`@mui/${packageName}@${version}\``;
  let previous = base;

  return joinBlocks(
    `### ${name}`,
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

  const groups = groupBy(listed, route);

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
