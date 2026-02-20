export default /** @type {import('@mui/internal-code-infra/changelog').ChangelogConfig} */ ({
  format: {
    version: '{{version}}',
    changelogMessage: '{{rawMessage}} @{{author}}',
    sectionTitle: {
      forPackage: '`{{package}}@{{version}}`{{planBadge}}',
    },
    planMessage: {
      same: 'Same changes as in `{{previousPlan}}@{{previousPlanVersion}}`.',
      plus: 'Same changes as in `{{previousPlan}}@{{previousPlanVersion}}`, plus:',
    },
    // Badges for each plan (keys must match plan names in labels.plan.values)
    planBadge: {
      pro: " [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')",
      premium:
        " [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')",
    },
    showInternalChangesMessage: true,
  },

  intro: {
    thanksMessage: `We'd like to extend a big thank you to the {{contributorCount}} contributors who made this release possible. Here are some highlights ✨:
<!-- Highlights placeholder - manually add key features/changes here -->
<!-- Example: -->
<!-- - 🎉 New feature description -->
<!-- - 🐛 Important bug fix description -->
<!-- - ⚡ Performance improvement description -->`,
  },

  contributors: {
    message: {
      community: `Special thanks go out to these community member(s) for their valuable contributions:
{{community}}`,
      team: `The following team member(s) contributed to this release:
{{team}}`,
    },

    addContributorsToIntro: true,
  },

  filter: {
    // Exclude bot commits
    excludeCommitByAuthors: [/\[bot\]$/],
    // Exclude commits with certain labels
    excludeCommitWithLabels: ['dependencies', 'release', 'scope: scheduler'],
    // Shows packages that had some changes but were filtered out
    showFilteredPackages: true,
    excludeAuthorsFromContributors: ['Copilot'],
  },

  categorization: {
    strategy: 'package',

    labels: {
      plan: {
        values: ['pro', 'premium'],
      },
      // Category overrides (if needed for MUI X)
      categoryOverrides: {
        test: 'miscellaneous',
        l10n: 'miscellaneous',
        docs: 'docs',
        recipe: 'miscellaneous',
        internal: 'core',
        'scope: code-infra': 'core',
        'scope: docs-infra': 'core',
        'scope: support-infra': 'core',
      },
      // Explicit flag labels
      flags: {
        'breaking change': {
          name: 'Breaking Change',
          prefix: '🚨 **Breaking Change**:',
        },
        'type: bug': {
          name: 'Bug Fix',
          prefix: '🐛',
        },
      },
      extractLabelsFromTitle: (/** @type {string} */ title) => {
        const titleLabels = Array.from(title.matchAll(/(?:\[([^\]]+)\])/g), (match) => match[1]);
        if (titleLabels.length > 0) {
          return titleLabels
            .map((label) => {
              if (label.endsWith('-pro') || label.endsWith('Pro')) {
                return 'plan: Pro';
              }
              if (label.endsWith('-premium') || label.endsWith('Premium')) {
                return 'plan: Premium';
              }
              if (label === 'docs') {
                return 'docs';
              }
              if (label === 'codemod') {
                return 'scope: codemod';
              }
              if (label === 'code-infra') {
                return 'scope: code-infra';
              }
              if (label === 'docs-infra') {
                return 'scope: docs-infra';
              }
              if (label === 'support-infra') {
                return 'scope: support-infra';
              }
              return false;
            })
            .filter(Boolean);
        }
        return [];
      },
    },

    packageNaming: {
      // Explicit mappings from scope label value to package name
      mappings: {
        'data grid': '@mui/x-data-grid',
        'date pickers': '@mui/x-date-pickers',
        'Date and Time Pickers': '@mui/x-date-pickers',
        'date and pickers': '@mui/x-date-pickers',
        pickers: '@mui/x-date-pickers',
        charts: '@mui/x-charts',
        'tree view': '@mui/x-tree-view',
        codemod: '@mui/x-codemod',
        // scheduler: '@mui/x-scheduler',
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
        },
      },
    },

    sections: {
      order: {
        'data grid': -20,
        'Date and Time Pickers': -15,
        'date pickers': -15,
        pickers: -15,
        charts: -10,
        'tree view': -8,
        codemod: -5,
        docs: 10,
        core: 15,
        miscellaneous: 20,
      },

      // Custom titles for sections (maps package or scope to display title)
      titles: {
        '@mui/x-data-grid': 'data grid',
        'data-grid': 'data grid',
        '@mui/x-date-pickers': 'Date and Time Pickers',
        'date-pickers': 'Date and Time Pickers',
        pickers: 'Date and Time Pickers',
        '@mui/x-charts': 'charts',
        charts: 'charts',
        '@mui/x-tree-view': 'tree view',
        '@mui/x-codemod': 'codemod',
        // '@mui/x-scheduler': 'scheduler',
      },

      fallbackSection: 'miscellaneous',
    },
  },
});
