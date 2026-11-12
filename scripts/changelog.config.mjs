const CHAT_HEADLESS = '@mui/x-chat-headless';
const CHARTS_VENDOR = '@mui/x-charts-vendor';

/** @type {import('@mui/internal-code-infra/changelog').ChangelogConfig} */
export default {
  format: {
    version: '{{version}}',
    preservePrefixes: true,
    changelogMessage: '{{message}} (#{{prNumber}}) @{{author}}',
    sectionTitle: { forPackage: '`{{package}}@{{version}}` {{planBadge}}' },
    planBadge: {
      pro: "[![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')",
      premium:
        "[![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')",
    },
    planMessage: {
      same: 'Same changes as in `{{previousPlan}}@{{previousPlanVersion}}`.',
      plus: 'Same changes as in `{{previousPlan}}@{{previousPlanVersion}}`, plus:',
    },
    showInternalChangesMessage: true,
  },
  intro: {
    thanksMessage:
      "We'd like to extend a big thank you to the {{contributorCount}} contributors who made this release possible. Here are some highlights ✨:",
    highlightsPrefix: 'TODO INSERT HIGHLIGHTS',
  },
  contributors: {
    source: 'all',
    addContributorsToIntro: true,
    message: {
      community: {
        many: 'Special thanks go out to these community members for their valuable contributions:\n{{community}}',
        one: 'Special thanks go out to community member {{community}} for their valuable contribution.',
      },
      team: 'The following team members contributed to this release:\n{{team}}',
    },
  },
  filter: {
    excludeCommitWithLabels: ['dependencies'],
    excludeAuthorsFromContributors: ['renovate[bot]', 'code-infra-renovate[bot]'],
  },
  categorization: {
    strategy: 'package',
    labels: {
      plan: { values: ['pro', 'premium'] },
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
      categoryOverrides: {
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
    },
    packageNaming: {
      omitUnchanged: true,
      omitUnavailable: true,
      additionalPackages(commit) {
        if (commit.parsed.categoryOverride) {
          return [];
        }

        // Package names and source paths identify shared changes without PR-specific overrides.
        const text = [commit.message, commit.prTitle, commit.prBody].join('\n');
        return [CHAT_HEADLESS, CHARTS_VENDOR].filter((name) => {
          const directory = name.slice('@mui/'.length);
          return new RegExp(`(?:${name}|packages/${directory})(?![\\w-])`).test(text);
        });
      },
      mappings: {
        'data grid': '@mui/x-data-grid',
        pickers: '@mui/x-date-pickers',
        charts: '@mui/x-charts',
        'tree view': '@mui/x-tree-view',
        scheduler: '@mui/x-scheduler',
        codemod: '@mui/x-codemod',
        chat: '@mui/x-chat',
        virtualizer: '@mui/x-virtualizer',
        'chat headless': CHAT_HEADLESS,
        'charts vendor': CHARTS_VENDOR,
      },
      plans: {
        pro: {
          '@mui/x-data-grid': '@mui/x-data-grid-pro',
          '@mui/x-date-pickers': '@mui/x-date-pickers-pro',
          '@mui/x-charts': '@mui/x-charts-pro',
          '@mui/x-tree-view': '@mui/x-tree-view-pro',
        },
        premium: {
          '@mui/x-data-grid': '@mui/x-data-grid-premium',
          '@mui/x-charts': '@mui/x-charts-premium',
          '@mui/x-scheduler': '@mui/x-scheduler-premium',
        },
      },
    },
    sections: {
      fallbackSection: 'miscellaneous',
      order: {
        'data grid': 0,
        pickers: 1,
        charts: 2,
        'charts vendor': 3,
        'tree view': 4,
        scheduler: 5,
        codemod: 6,
        chat: 7,
        'chat headless': 8,
        virtualizer: 9,
        docs: 10,
        core: 11,
        miscellaneous: 12,
      },
      titles: {
        'data grid': 'Data Grid',
        pickers: 'Date and Time Pickers',
        charts: 'Charts',
        'charts vendor': 'Charts Vendor',
        'tree view': 'Tree View',
        scheduler: 'Scheduler',
        codemod: 'Codemod',
        chat: 'Chat',
        'chat headless': 'Chat Headless',
        virtualizer: 'Virtualizer',
        docs: 'Docs',
        core: 'Core',
        miscellaneous: 'Miscellaneous',
      },
    },
  },
};
