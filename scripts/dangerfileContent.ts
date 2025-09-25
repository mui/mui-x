import type * as dangerModule from 'danger';

declare const danger: (typeof dangerModule)['danger'];
declare const markdown: (typeof dangerModule)['markdown'];

const circleCIBuildNumber = process.env.CIRCLE_BUILD_NUM;
const circleCIBuildUrl = `https://app.circleci.com/pipelines/github/mui/mui-x/jobs/${circleCIBuildNumber}`;
const dangerCommand = process.env.DANGER_COMMAND;

function prepareBundleSizeReport() {
  markdown(
    `## Bundle size report

Bundle size will be reported once [CircleCI build #${circleCIBuildNumber}](${circleCIBuildUrl}) finishes.`,
  );
}

// These functions are no longer needed as they've been moved to the prSizeDiff.js module

async function reportBundleSize() {
  let markdownContent = `## Bundle size report\n\n`;

  if (!process.env.CIRCLE_BUILD_NUM) {
    throw new Error('CIRCLE_BUILD_NUM is not defined');
  }

  const circleciBuildNumber = process.env.CIRCLE_BUILD_NUM;

  const { renderMarkdownReport } = await import('@mui/internal-bundle-size-checker');
  markdownContent += await renderMarkdownReport(danger.github.pr, {
    track: [
      '@mui/x-data-grid',
      '@mui/x-data-grid-pro',
      '@mui/x-data-grid-premium',
      '@mui/x-charts',
      '@mui/x-charts-pro',
      '@mui/x-charts-premium',
      '@mui/x-date-pickers',
      '@mui/x-date-pickers-pro',
      '@mui/x-tree-view',
      '@mui/x-tree-view-pro',
    ],
    circleciBuildNumber,
  });

  // Use the markdown function to publish the report
  markdown(markdownContent);
}

function addDeployPreviewUrls() {
  /**
   * The incoming docsPath from danger does not start with `/`
   * e.g. ['docs/data/data-grid/editing/editing.md']
   */
  function formatFileToLink(docsPath: string) {
    const url = docsPath.replace('docs/data', 'x').replace(/\/[^/]+\.md$/, '/');

    return url
      .replace('data-grid/', 'react-data-grid/')
      .replace('date-pickers/', 'react-date-pickers/')
      .replace('charts/', 'react-charts/')
      .replace('scheduler/', 'react-scheduler/')
      .replace('tree-view/', 'react-tree-view/')
      .replace(/\/[^/]+\.md$/, '/');
  }

  const netlifyPreview = `https://deploy-preview-${danger.github.pr.number}--material-ui-x.netlify.app/`;

  const files = [...danger.git.created_files, ...danger.git.modified_files];

  // limit to the first 5 docs
  const docs = files
    .filter((file) => file.startsWith('docs/data') && file.endsWith('.md'))
    .slice(0, 5);

  markdown(`**Deploy preview:** <a href="${netlifyPreview}">${netlifyPreview}</a>`);

  if (docs.length) {
    markdown(`

**Updated pages:**

${docs
  .map((docsPath) => {
    const formattedUrl = formatFileToLink(docsPath);
    return `- [${docsPath}](${netlifyPreview}${formattedUrl})`;
  })
  .join('\n')}
`);
  }
}

function addL10nHelpMessage() {
  const isAddingLocale = danger.git.created_files.some((file: string) =>
    file.includes('/src/locales/'),
  );
  const isUpdatingLocale = danger.git.modified_files.some((file: string) =>
    file.includes('/src/locales/'),
  );

  if (!isAddingLocale && !isUpdatingLocale) {
    return;
  }
  markdown(
    [
      '## Localization writing tips :writing_hand:',
      '',
      'Seems you are updating localization :earth_africa: files.',
      '',
      'Thank you for contributing to the localization! :tada: To make your PR perfect, here is a list of elements to check: :heavy_check_mark:',
      '- [ ] Verify if the PR title respects the release format. Here are two examples (depending if you update or add a locale file)',
      '  > [l10n] Improve Swedish (sv-SE) locale',
      '  > [l10n] Add Danish (da-DK) locale',
      '- [ ] Update the documentation of supported locales by running `pnpm l10n`',
      ...(isAddingLocale
        ? [
            '- [ ] Verify that you have added an export line in `src/locales/index.ts` for the new locale.',
            '- [ ] Run `pnpm docs:api` which should add your new translation to the list of exported interfaces.',
          ]
        : []),
      '- [ ] Clean files with `pnpm prettier`.',
      '',
    ].join('\n'),
  );
}

async function run() {
  addL10nHelpMessage();
  addDeployPreviewUrls();

  switch (dangerCommand) {
    case 'prepareBundleSizeReport':
      prepareBundleSizeReport();
      break;
    case 'reportBundleSize':
      await reportBundleSize();
      break;
    default:
      throw new TypeError(`Unrecognized danger command '${dangerCommand}'`);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
