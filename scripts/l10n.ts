import * as fse from 'fs-extra';
import * as path from 'path';
import { exec } from 'child_process';
import traverse from '@babel/traverse';
import * as prettier from 'prettier';
import * as babel from '@babel/core';
import * as babelTypes from '@babel/types';
import yargs, { ArgumentsCamelCase } from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Octokit } from '@octokit/rest';
import { retry } from '@octokit/plugin-retry';
import localeNames from './localeNames';
import {
  SOURCE_CODE_REPO as DOCS_SOURCE_CODE_REPO,
  SOURCE_GITHUB_BRANCH as DOCS_SOURCE_GITHUB_BRANCH,
} from '../docs/constants';

// @ts-ignore
const MyOctokit = Octokit.plugin(retry);

const GIT_ORGANIZATION = 'mui';
const GIT_REPO = 'mui-x';
// https://github.com/mui/mui-x/issues/3211
const L10N_ISSUE_ID = 3211;
const SOURCE_CODE_REPO = `https://github.com/${GIT_ORGANIZATION}/${GIT_REPO}`;

const packagesWithL10n = [
  {
    key: 'data-grid',
    reportName: '🧑‍💼 DataGrid, DataGridPro, DataGridPremium',
    constantsRelativePath: 'packages/x-data-grid/src/constants/localeTextConstants.ts',
    localesRelativePath: 'packages/x-data-grid/src/locales',
    documentationReportPath: 'docs/data/data-grid/localization/data.json',
  },
  {
    key: 'pickers',
    reportName: '📅🕒 Date and Time Pickers',
    constantsRelativePath: 'packages/x-date-pickers/src/locales/enUS.ts',
    localesRelativePath: 'packages/x-date-pickers/src/locales',
    documentationReportPath: 'docs/data/date-pickers/localization/data.json',
  },
];

const BABEL_PLUGINS = [require.resolve('@babel/plugin-syntax-typescript')];

type Translations = Record<string, babelTypes.Node>;

type TranslationsByGroup = Record<string, Translations>;

function git(args: any) {
  return new Promise((resolve, reject) => {
    exec(`git ${args}`, (err, stdout) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

function plugin(existingTranslations: Translations): babel.PluginObj {
  return {
    visitor: {
      VariableDeclarator: {
        enter(visitorPath) {
          const { node } = visitorPath;

          if (!babelTypes.isIdentifier(node.id)) {
            visitorPath.skip();
            return;
          }

          // Test if the variable name follows the pattern xxXXGrid or xxXXPickers
          if (!/[a-z]{2}[A-Z]{2}|[a-z]{2}(Grid|Pickers)/.test(node.id.name)) {
            visitorPath.skip();
            return;
          }

          // Mark this node as the one to replace later
          (node as any).found = true;

          if (!babelTypes.isObjectExpression(node.init)) {
            visitorPath.skip();
            return;
          }

          node.init.properties.forEach((property) => {
            if (
              !babelTypes.isObjectProperty(property) ||
              !(babelTypes.isIdentifier(property.key) || babelTypes.isStringLiteral(property.key))
            ) {
              return;
            }
            // The stringLiteral keys are wrapped into `'` such that we can distinguish them from identifiers.
            const key = babelTypes.isIdentifier(property.key)
              ? (property.key as babelTypes.Identifier).name
              : `'${(property.key as babelTypes.StringLiteral).value}'`;
            existingTranslations[key] = property.value;
          });
        },
        exit(visitorPath) {
          const { node } = visitorPath;

          if (!(node as any).found) {
            visitorPath.skip();
            return;
          }

          visitorPath.get('init').replaceWith(babelTypes.identifier('_REPLACE_'));
        },
      },
    },
  };
}

function extractTranslations(translationsPath: string): [TranslationsByGroup, Translations] {
  const file = fse.readFileSync(translationsPath, { encoding: 'utf-8' });
  const ast = babel.parseSync(file, {
    plugins: BABEL_PLUGINS,
    configFile: false,
  });

  const translations: Translations = {};
  const translationsByGroup: TranslationsByGroup = {};

  traverse(ast!, {
    VariableDeclarator(visitorPath) {
      const { node } = visitorPath;

      if (!node.init || !babelTypes.isObjectExpression(node.init)) {
        visitorPath.skip();
        return;
      }

      let group = 'No group';

      node.init.properties.forEach((property) => {
        if (!babelTypes.isObjectProperty(property)) {
          return;
        }

        const key =
          (property.key as babelTypes.Identifier).name ||
          `'${(property.key as babelTypes.StringLiteral).value}'`;

        // Ignore translations for MUI Core components, for example MuiTablePagination
        if (key.startsWith('Mui')) {
          return;
        }

        if (Array.isArray(property.leadingComments) && property.leadingComments.length > 0) {
          group = property.leadingComments[0].value.trim();
        }

        if (!translationsByGroup[group]) {
          translationsByGroup[group] = {};
        }

        translationsByGroup[group][key] = property.value;
        translations[key] = property.value;
      });
    },
  });

  return [translationsByGroup, translations];
}

function findLocales(localesDirectory: string, constantsPath: string) {
  const items = fse.readdirSync(localesDirectory);
  const locales: any[] = [];
  const localeRegex = /^[a-z]{2}[A-Z]{2}|^[a-z]{2}(?=.ts)/;

  items.forEach((item) => {
    const match = item.match(localeRegex);
    if (!match) {
      return;
    }

    const localePath = path.resolve(localesDirectory, item);
    if (fse.lstatSync(localePath).isDirectory()) {
      return;
    }
    const code = match[0] || match[1];
    if (constantsPath !== localePath) {
      // Ignore the locale used as a reference
      locales.push([localePath, code]);
    }
  });

  return locales;
}

function extractAndReplaceTranslations(localePath: string) {
  const translations: Translations = {};
  const file = fse.readFileSync(localePath, { encoding: 'utf-8' });
  const { code } = babel.transformSync(file, {
    plugins: [...BABEL_PLUGINS, plugin(translations)],
    configFile: false,
    retainLines: true,
  })!;
  return { translations, transformedCode: code };
}

function injectTranslations(
  code: string,
  existingTranslations: Translations,
  baseTranslations: TranslationsByGroup,
) {
  const lines: string[] = [];
  const astBuilder = babel.template(`const _ = %%value%%;`);

  Object.entries(baseTranslations).forEach(([group, translations]) => {
    lines.push(`\n\n// ${group}`);

    Object.entries(translations).forEach(([key, value]) => {
      const valueToTransform =
        existingTranslations[key] || existingTranslations[`'${key}'`] || value;
      const isKeyStringLiteral = !existingTranslations[key] && existingTranslations[`'${key}'`];
      const ast = astBuilder({ value: valueToTransform }) as babelTypes.Statement;
      const result = babel.transformFromAstSync(babelTypes.program([ast]), undefined, {
        plugins: BABEL_PLUGINS,
        configFile: false,
      });

      const valueAsCode = result!.code!.replace(/^const _ = (.*);/gs, '$1');
      const comment = !existingTranslations[key] && !existingTranslations[`'${key}'`] ? '// ' : '';

      lines.push(`${comment}${isKeyStringLiteral ? `'${key}'` : key}: ${valueAsCode},`);
    });
  });

  return code.replace('_REPLACE_', `{\n${lines.join('\n')}\n}`);
}

// ISO 3166-1 alpha-2
function countryToFlag(isoCode: string) {
  return typeof String.fromCodePoint !== 'undefined' && isoCode
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}

interface MissingKey {
  currentLineContent: string;
  lineIndex: number;
}

interface MissingTranslations {
  [localeCode: string]: {
    [packageCode: string]: {
      path: string;
      missingKeys: MissingKey[];
    };
  };
}

async function generateReport(missingTranslations: MissingTranslations) {
  const lastCommitRef = await git('log -n 1 --pretty="format:%H"');
  const lines: string[] = [];
  Object.entries(missingTranslations).forEach(([languageCode, infoPerPackage]) => {
    lines.push('');
    lines.push(
      `### ${countryToFlag(languageCode.slice(2))} ${languageCode.slice(0, 2)}-${languageCode.slice(
        2,
      )}`,
    );

    packagesWithL10n.forEach(({ key: packageKey, reportName, localesRelativePath }) => {
      const info = infoPerPackage[packageKey];

      lines.push('<details>');

      const fileName = `${languageCode.slice(0, 2).toLowerCase()}${languageCode
        .slice(2)
        .toUpperCase()}.ts`;
      const filePath = `${localesRelativePath}/${fileName}`;
      if (!info) {
        lines.push(` <summary>${reportName}: file to create</summary>`);
        lines.push('');
        lines.push(` > Add file \`${filePath}\` to start contributing to this locale.`);
      } else if (info.missingKeys.length === 0) {
        lines.push(` <summary>${reportName} (Done ✅)</summary>`);
        lines.push('');
        lines.push(` > This locale has been completed by the community 🚀`);
        lines.push(
          ` > You can still look for typo fix or improvements in [the translation file](${SOURCE_CODE_REPO}/blob/${lastCommitRef}/${filePath}) 🕵`,
        );
      } else {
        lines.push(` <summary>${reportName} (${info.missingKeys.length} remaining)</summary>`);
        lines.push('');
        info.missingKeys.forEach((missingKey) => {
          const permalink = `${SOURCE_CODE_REPO}/blob/${lastCommitRef}/${info.path}#L${missingKey.lineIndex}`;
          let lineContent = missingKey.currentLineContent;

          if (lineContent[lineContent.length - 1] === ',') {
            lineContent = lineContent.slice(0, lineContent.length - 1);
          }
          lines.push(` - [ \`\` ${lineContent} \`\`](${permalink})`);
        });
      }

      lines.push('</details>');
    });
  });
  return lines.join('\n');
}

type DocumentationReportItem = {
  languageTag: string;
  importName: string;
  localeName: string;
  missingKeysCount: number;
  totalKeysCount: number;
  githubLink: string;
};
const generateDocReport = async (
  missingTranslations: MissingTranslations,
  baseTranslationsNumber: TranslationsNumber,
) => {
  const workspaceRoot = path.resolve(__dirname, '../');

  packagesWithL10n.forEach(async ({ key: packageKey, documentationReportPath }) => {
    const documentationReport: DocumentationReportItem[] = [];
    Object.entries(missingTranslations).forEach(([importName, infoPerPackage]) => {
      const info = infoPerPackage[packageKey];
      if (info == null) {
        return;
      }

      const languageTag =
        importName.length > 2
          ? `${importName.slice(0, 2).toLowerCase()}-${importName.slice(2).toUpperCase()}`
          : importName;
      const localeName = localeNames[languageTag as keyof typeof localeNames];

      if (localeName === undefined) {
        throw new Error(
          [
            `locale tag ${languageTag} is not associated to a locale name.`,
            'If this tag is correct, add its name to the file `scripts/localeNames.js`',
          ].join('\n'),
        );
      }
      documentationReport.push({
        languageTag,
        importName,
        localeName,
        missingKeysCount: infoPerPackage[packageKey].missingKeys.length,
        totalKeysCount: baseTranslationsNumber[packageKey],
        githubLink: `${DOCS_SOURCE_CODE_REPO}/blob/${DOCS_SOURCE_GITHUB_BRANCH}/${info.path}`,
      });
    });

    await fse.writeFileSync(
      path.join(workspaceRoot, documentationReportPath),
      `${JSON.stringify(
        documentationReport.sort((a, b) => a.localeName.localeCompare(b.localeName)),
        null,
        2,
      )}\n`,
    );
  });
};

async function updateIssue(githubToken: string, newMessage: string) {
  // Initialize the API client
  const octokit = new MyOctokit({
    auth: githubToken,
  });

  const requestBody = `You can check below all of the localization files that contain at least one missing translation. If you are a fluent speaker of any of these languages, feel free to submit a pull request. Any help is welcome to make the X components to reach new cultures.

Run \`pnpm l10n --report\` to update the list below ⬇️

${newMessage}
`;
  await octokit
    .request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
      owner: GIT_ORGANIZATION,
      repo: GIT_REPO,
      issue_number: L10N_ISSUE_ID,
      body: requestBody,
    })
    .catch((error) => {
      if (error.request.request.retryCount) {
        console.error(`request failed after ${error.request.request.retryCount} retries`);
      }
      console.error(error);
    });
}

interface HandlerArgv {
  report: boolean;
  githubToken?: string;
}

type TranslationsNumber = Record<string, number>;

async function run(argv: ArgumentsCamelCase<HandlerArgv>) {
  const { report, githubToken } = argv;
  const workspaceRoot = path.resolve(__dirname, '../');

  const missingTranslations: MissingTranslations = {};
  const baseTranslationsNumber: TranslationsNumber = {};

  await Promise.all(
    packagesWithL10n.map(async (packageInfo) => {
      const constantsPath = path.join(workspaceRoot, packageInfo.constantsRelativePath);
      const [baseTranslationsByGroup, baseTranslations] = extractTranslations(constantsPath);

      baseTranslationsNumber[packageInfo.key] = Object.keys(baseTranslations).length;

      const localesDirectory = path.resolve(workspaceRoot, packageInfo.localesRelativePath);
      const locales = findLocales(localesDirectory, constantsPath);

      await Promise.all(
        locales.map(async ([localePath, localeCode]) => {
          const { translations: existingTranslations, transformedCode } =
            extractAndReplaceTranslations(localePath);

          if (!transformedCode || Object.keys(existingTranslations).length === 0) {
            return;
          }

          const codeWithNewTranslations = injectTranslations(
            transformedCode,
            existingTranslations,
            baseTranslationsByGroup,
          );

          const prettierConfigPath = path.join(workspaceRoot, 'prettier.config.js');
          const prettierConfig = await prettier.resolveConfig(localePath, {
            config: prettierConfigPath,
          });

          const prettifiedCode = await prettier.format(codeWithNewTranslations, {
            ...prettierConfig,
            filepath: localePath,
          });

          // We always set the `locations` to [] such that we can differentiate translation completed from un-existing translations
          if (!missingTranslations[localeCode]) {
            missingTranslations[localeCode] = {};
          }
          if (!missingTranslations[localeCode][packageInfo.key]) {
            missingTranslations[localeCode][packageInfo.key] = {
              // prettier-ignore
              path: localePath
                .replace(workspaceRoot, '').slice(1) // Remove leading slash
                .split(path.sep).join('/'), // Ensure the path is using forward slashes even on Windows machines
              missingKeys: [],
            };
          }
          const lines = codeWithNewTranslations.split('\n');
          Object.entries(baseTranslations).forEach(([key]) => {
            if (!existingTranslations[key] && !existingTranslations[`'${key}'`]) {
              const location = lines.findIndex(
                (line) =>
                  line.trim().startsWith(`// ${key}:`) || line.trim().startsWith(`// '${key}':`),
              );
              // Ignore when both the translation and the placeholder are missing
              if (location >= 0) {
                missingTranslations[localeCode][packageInfo.key].missingKeys.push({
                  currentLineContent: lines[location].trim().slice(3),
                  lineIndex: location + 1,
                });
              }
            }
          });

          if (!report) {
            fse.writeFileSync(localePath, prettifiedCode);
            // eslint-disable-next-line no-console
            console.log(`Wrote ${localeCode} locale.`);
          }
        }),
      );
    }),
  );

  await generateDocReport(missingTranslations, baseTranslationsNumber);

  if (report) {
    const newMessage = await generateReport(missingTranslations);
    if (githubToken) {
      await updateIssue(githubToken, newMessage);
    } else {
      // eslint-disable-next-line no-console
      console.log(newMessage);
    }
  }

  process.exit(0);
}

yargs(hideBin(process.argv))
  .command({
    command: '$0',
    describe: 'Syncs translation files.',
    builder: (command) => {
      return command
        .option('report', {
          describe: "Don't write any file but generates a report with the missing translations.",
          type: 'boolean',
          default: false,
        })
        .option('githubToken', {
          default: process.env.GITHUB_TOKEN,
          describe:
            'The personal access token to use for authenticating with GitHub. Needs public_repo permissions.',
          type: 'string',
        });
    },
    handler: run,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
