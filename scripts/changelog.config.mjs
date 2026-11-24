import {
  Contributors,
  Entry,
  EntryList,
  Heading,
  PackageHeading,
  creditAuthors,
  formatDate,
  groupBy,
  hasLabel,
  md,
  not,
  parseLabels,
  sortEntries,
} from '@mui/internal-code-infra/changelog';

/**
 * @typedef {import('@mui/internal-code-infra/changelog').ReleaseEntry} ReleaseEntry
 * @typedef {import('@mui/internal-code-infra/changelog').ReleaseFacts} ReleaseFacts
 * @typedef {import('@mui/internal-code-infra/changelog').ParsedEntryLabels} ParsedEntryLabels
 * @typedef {ReleaseEntry & { parsed: ParsedEntryLabels }} XEntry
 * @typedef {{ name: string; version: string | null; plan: Plan; entries: XEntry[] }} Tier
 * @typedef {{ key: string; title: string; tiers?: Tier[]; entries: XEntry[] }} XSection
 * @typedef {{ facts: ReleaseFacts; version: string; sections: XSection[]; team: string[]; community: string[] }} XRelease
 * @typedef {'base' | 'pro' | 'premium'} Plan
 */

const CHAT_HEADLESS = '@mui/x-chat-headless';
const CHARTS_VENDOR = '@mui/x-charts-vendor';
const MISCELLANEOUS = 'miscellaneous';
const VIRTUALIZER = 'virtualizer';
const RELEASE = 'release';
const VERSION_PLACEHOLDER = '__VERSION__';
const PLANS = /** @type {const} */ (['base', 'pro', 'premium']);

const BADGES = {
  pro: "[![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')",
  premium:
    "[![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')",
};

/**
 * Products in display order; each tier lists its package. A companion follows the tiers: `always`,
 * or only with entries. `entriesOnly` hides a product that only has version bumps.
 */
const PRODUCTS = [
  {
    key: 'data grid',
    title: 'Data Grid',
    base: '@mui/x-data-grid',
    pro: '@mui/x-data-grid-pro',
    premium: '@mui/x-data-grid-premium',
  },
  {
    key: 'pickers',
    title: 'Date and Time Pickers',
    base: '@mui/x-date-pickers',
    pro: '@mui/x-date-pickers-pro',
  },
  {
    key: 'charts',
    title: 'Charts',
    base: '@mui/x-charts',
    pro: '@mui/x-charts-pro',
    premium: '@mui/x-charts-premium',
    companion: { key: 'charts vendor', name: CHARTS_VENDOR, always: false },
  },
  { key: 'tree view', title: 'Tree View', base: '@mui/x-tree-view', pro: '@mui/x-tree-view-pro' },
  {
    key: 'scheduler',
    title: 'Scheduler',
    base: '@mui/x-scheduler',
    premium: '@mui/x-scheduler-premium',
  },
  {
    key: 'chat',
    title: 'Chat',
    base: '@mui/x-chat',
    companion: { key: 'chat headless', name: CHAT_HEADLESS, always: true },
    entriesOnly: true,
  },
  { key: 'codemod', title: 'Codemod', base: '@mui/x-codemod' },
];

const GROUPS = { docs: 'Docs', core: 'Core' };

const LABELS = {
  plans: ['pro', 'premium'],
  titleMappings: {
    DataGrid: ['scope: data grid'],
    DataGridPro: ['scope: data grid', 'plan: pro'],
    DataGridPremium: ['scope: data grid', 'plan: premium'],
    'data grid': ['scope: data grid'],
    pickers: ['scope: pickers'],
    DatePicker: ['scope: pickers', 'component: DatePicker'],
    TimePicker: ['scope: pickers', 'component: TimePicker'],
    DateTimePicker: ['scope: pickers', 'component: DateTimePicker'],
    fields: ['scope: pickers'],
    DateRangePicker: ['scope: pickers', 'plan: pro', 'component: DateRangePicker'],
    DateRangeCalendar: ['scope: pickers', 'plan: pro', 'component: DateRangeCalendar'],
    DateTimeRangePicker: ['scope: pickers', 'plan: pro', 'component: DateTimeRangePicker'],
    TimeRangePicker: ['scope: pickers', 'plan: pro', 'component: TimeRangePicker'],
    charts: ['scope: charts'],
    'charts-pro': ['scope: charts', 'plan: pro'],
    'charts-premium': ['scope: charts', 'plan: premium'],
    TreeView: ['scope: tree view'],
    RichTreeView: ['scope: tree view', 'component: RichTreeView'],
    TreeItem: ['scope: tree view', 'component: TreeItem'],
    'tree view': ['scope: tree view'],
    RichTreeViewPro: ['scope: tree view', 'plan: pro', 'component: RichTreeViewPro'],
    'tree view pro': ['scope: tree view', 'plan: pro'],
    scheduler: ['scope: scheduler'],
    'scheduler-premium': ['scope: scheduler', 'plan: premium'],
    codemod: ['scope: codemod'],
    chat: ['scope: chat'],
    'chat-headless': ['scope: chat headless'],
    'charts-vendor': ['scope: charts vendor'],
    virtualizer: ['scope: virtualizer'],
    docs: ['docs'],
    internal: ['internal'],
    'code-infra': ['scope: code-infra'],
    'docs-infra': ['scope: docs-infra'],
    'support-infra': ['scope: support-infra'],
  },
  overrides: {
    docs: 'docs',
    internal: 'core',
    'scope: code-infra': 'core',
    'scope: docs-infra': 'core',
    'scope: support-infra': 'core',
    'scope: x-license': 'core',
    'scope: x-telemetry': 'core',
    'scope: all components': 'core',
    'scope: design-kits': 'core',
  },
};

/**
 * Packages an entry belongs to: a tier of each scoped product, or `miscellaneous`.
 * @param {XEntry} entry
 * @returns {string[]}
 */
function destinations(entry) {
  const { override, scopePlans, plan } = entry.parsed;
  // The virtualizer has no section; its other scopes place the entry.
  const scopes = entry.parsed.scopes.filter((scope) => scope !== VIRTUALIZER);

  if (override) {
    return [override];
  }

  const keys = scopes.length === 0 ? [MISCELLANEOUS] : [];

  for (const scope of scopes) {
    const companion = PRODUCTS.find((candidate) => candidate.companion?.key === scope)?.companion;

    if (companion) {
      keys.push(companion.name);
      continue;
    }

    const product = PRODUCTS.find((candidate) => candidate.key === scope);

    if (!product) {
      console.warn(
        `No package mapping found for scope "${scope}" in commit ${entry.pr ?? entry.sha}; using ${MISCELLANEOUS}.`,
      );
      keys.push(MISCELLANEOUS);
      continue;
    }

    const tier = /** @type {Plan | undefined} */ (scopePlans?.[scope.toLowerCase()] ?? plan);

    if (!tier || tier === 'base') {
      keys.push(product.base);
      continue;
    }

    const pkg = product[tier];

    // A shared PR's unscoped tier can belong to another product.
    const shared =
      !scopePlans?.[scope.toLowerCase()] &&
      scopes.some((other) => PRODUCTS.find((p) => p.key === other)?.[tier]);

    if (!pkg && !shared) {
      throw new Error(
        `No ${tier} plan package mapping found for base package "${product.base}" in commit #${entry.pr}`,
      );
    }

    keys.push(pkg ?? product.base);
  }

  // Release PRs quote other packages' changes.
  if (hasLabel(RELEASE)(entry)) {
    return keys;
  }

  // Package names and source paths identify shared changes without PR-specific overrides.
  const text = [entry.message, entry.prTitle, entry.body].join('\n');

  for (const name of [CHAT_HEADLESS, CHARTS_VENDOR]) {
    const directory = name.slice('@mui/'.length);

    if (new RegExp(`(?:${name}|packages/${directory})(?![\\w-])`).test(text)) {
      keys.push(name);
    }
  }

  return keys;
}

/** @type {import('@mui/internal-code-infra/changelog').ChangelogPreset<XRelease>} */
export default {
  includeDirectCommits: true,
  prepare(facts) {
    const packages = new Map(facts.packages.map((pkg) => [pkg.name, pkg]));
    // False before `release:version` runs.
    const bumped = facts.packages.some((pkg) => !pkg.private && pkg.changed !== false);

    const entries = facts.entries.filter(not(hasLabel('dependencies'))).map((entry) => ({
      ...entry,
      parsed: parseLabels(entry, LABELS),
    }));

    const groups = groupBy(entries, destinations);
    /** @param {string} key */
    const entriesOf = (key) => groups.get(key) ?? [];

    /** @type {XSection[]} */
    const sections = [];

    for (const product of PRODUCTS) {
      const { companion } = product;

      /** @type {{ plan: Plan; name: string | undefined }[]} */
      const candidates = PLANS.map((plan) => ({ plan, name: product[plan] }));

      if (companion && (companion.always || entriesOf(companion.name).length > 0)) {
        candidates.push({ plan: 'base', name: companion.name });
      }

      const tiers = candidates.flatMap(({ plan, name }) => {
        const pkg = name ? packages.get(name) : undefined;

        if (!name) {
          return [];
        }

        if (!pkg || pkg.private) {
          if (entriesOf(name).length > 0) {
            console.warn(
              `Omitting ${entriesOf(name).length} entries for unavailable package ${name}: ${entriesOf(
                name,
              )
                .map((entry) => entry.pr ?? entry.sha.slice(0, 7))
                .join(', ')}.`,
            );
          }

          return [];
        }

        return [
          {
            name,
            version: bumped ? pkg.version : VERSION_PLACEHOLDER,
            plan,
            entries: entriesOf(name),
            changed: pkg.changed,
          },
        ];
      });

      const hasEntries = tiers.some((tier) => tier.entries.length > 0);

      const shown =
        hasEntries ||
        (!product.entriesOnly && (!bumped || tiers.some((tier) => tier.changed !== false)));

      if (tiers.length > 0 && shown) {
        sections.push({ key: product.key, title: product.title, tiers, entries: [] });
      }
    }

    for (const [key, title] of Object.entries(GROUPS)) {
      if (entriesOf(key).length > 0) {
        sections.push({ key, title, entries: entriesOf(key) });
      }
    }

    if (entriesOf(MISCELLANEOUS).length > 0) {
      sections.push({
        key: MISCELLANEOUS,
        title: 'Miscellaneous',
        entries: entriesOf(MISCELLANEOUS),
      });
    }

    const { team, community } = creditAuthors(facts.entries, { exclude: [/\[bot\]$/] });
    const version = facts.lastRelease === `v${facts.version}` ? VERSION_PLACEHOLDER : facts.version;

    return { facts, version, sections, team, community };
  },
  view: ({ facts, version, sections, team, community }) => md`
## ${version}

<!-- generated comparing ${facts.lastRelease}...${facts.release} -->

${formatDate(facts.date)}

We'd like to extend a big thank you to the ${team.length + community.length} contributors who made this release possible. Here are some highlights ✨:

TODO INSERT HIGHLIGHTS

${Contributors(community, (list, count) =>
  count > 1
    ? `Special thanks go out to these community members for their valuable contributions:\n${list}`
    : `Special thanks go out to community member ${list} for their valuable contribution.`,
)}

${Contributors(team, (list) => `The following team members contributed to this release:\n${list}`)}

${sections.map((section) => [Heading(3, section.title), section.tiers ? section.tiers.map(TierSection) : Entries(section.entries)])}
`,
};

/**
 * @param {Tier} tier
 * @param {number} index
 * @param {Tier[]} tiers
 */
function TierSection(tier, index, tiers) {
  const previous = tiers[index - 1];
  let intro = '';

  if (tier.plan === 'base') {
    intro = tier.entries.length === 0 ? 'Internal changes.' : '';
  } else if (previous) {
    const same = `Same changes as in \`${previous.name}@${previous.version ?? ''}\``;
    intro = tier.entries.length === 0 ? `${same}.` : `${same}, plus:`;
  }

  return [
    PackageHeading(4, tier, tier.plan === 'base' ? '' : BADGES[tier.plan]),
    intro,
    Entries(tier.entries),
  ];
}

/** @param {XEntry[]} entries */
function Entries(entries) {
  return EntryList(
    sortEntries(entries, (entry) => entry.parsed.prefixes),
    (entry) => Entry(entry, entry.parsed.prefixes),
  );
}
