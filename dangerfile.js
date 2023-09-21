const { danger, markdown } = require('danger');
const fse = require('fs-extra');
const path = require('path');
const prettier = require('prettier');

const dangerCommand = process.env.DANGER_COMMAND;

async function reportBundleSize() {
  const snapshotPath = path.join(__dirname, './performance-snapshot.json');
  const prettierConfigPath = path.join(__dirname, './prettier.config.js');
  const snapshot = await fse.readJSON(snapshotPath);

  const headers = `
| Test case | Unit | Min | Max | Median | Mean | σ |
| --------- | ---- | --- | --- | ------ | ---- | - |`;

  let text = `These are the results for the performance tests:
${headers}\n`;

  const formatter = new Intl.NumberFormat('en');

  Object.entries(snapshot).forEach(([name, values]) => {
    const min = formatter.format(values.min);
    const max = formatter.format(values.max);
    const mean = formatter.format(values.mean);
    const median = formatter.format(values.median);
    const stdDev = formatter.format(values.stdDev);
    text += `| ${name} | ms | ${min} | ${max} | ${median} | ${mean} | ${stdDev} |\n`;
  });

  const prettierConfig = prettier.resolveConfig.sync(snapshotPath, {
    config: prettierConfigPath,
  });

  markdown(prettier.format(text, { prettierConfig, parser: 'markdown' }));
}

function addDeployPreviewUrls() {
  /**
   * The incoming docsPath from danger does not start with `/`
   * e.g. ['docs/data/data-grid/editing/editing.md']
   */
  function formatFileToLink(docsPath) {
    const url = docsPath.replace('docs/data', 'x').replace(/\/[^/]+\.md$/, '/');

    return url
      .replace('data-grid/', 'react-data-grid/')
      .replace('date-pickers/', 'react-date-pickers/')
      .replace('charts/', 'react-charts/')
      .replace(/\/[^/]+\.md$/, '/');
  }

  const netlifyPreview = `https://deploy-preview-${danger.github.pr.number}--material-ui-x.netlify.app/`;

  const files = [...danger.git.created_files, ...danger.git.modified_files];

  // limit to the first 5 docs
  const docs = files
    .filter((file) => file.startsWith('docs/data') && file.endsWith('.md'))
    .slice(0, 5);

  markdown(`
## Netlify deploy preview

Netlify deploy preview: <a href="${netlifyPreview}">${netlifyPreview}</a>

### Updated pages

${
  docs.length
    ? docs
        .map((docsPath) => {
          const formattedUrl = formatFileToLink(docsPath);
          return `- [${docsPath}](${netlifyPreview}${formattedUrl})`;
        })
        .join('\n')
    : 'No updates.'
}
`);
}

function addL10nHelpMessage() {
  const isAddingLocale = danger.git.created_files.some((file) => file.includes('/src/locales/'));
  const isUpdatingLocale = danger.git.modified_files.some((file) => file.includes('/src/locales/'));

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
      '- [ ] Update the documentation of supported locales by running `yarn l10n`',
      ...(isAddingLocale
        ? [
            '- [ ] Verify that you have added an export line in `src/locales/index.ts` for the new locale.',
            '- [ ] Run `yarn docs:api` which should add your new translation to the list of exported interfaces.',
          ]
        : []),
      '- [ ] Clean files with `yarn prettier`.',
      '',
    ].join('\n'),
  );
}

async function run() {
  addL10nHelpMessage();
  addDeployPreviewUrls();

  switch (dangerCommand) {
    case 'reportPerformance':
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
