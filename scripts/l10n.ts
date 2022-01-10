import * as fse from 'fs-extra';
import * as path from 'path';
import { exec } from 'child_process';
import traverse from '@babel/traverse';
import * as prettier from 'prettier';
import * as babel from '@babel/core';
import * as babelTypes from '@babel/types';
import * as yargs from 'yargs';

const SOURCE_CODE_REPO = 'https://github.com/mui-org/material-ui-x';

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

          // Test if the variable name follows the pattern xxXXGrid
          if (!/[a-z]{2}[A-Z]{2}Grid/.test(node.id.name)) {
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
            if (!babelTypes.isObjectProperty(property) || !babelTypes.isIdentifier(property.key)) {
              return;
            }
            const name = property.key.name;
            existingTranslations[name] = property.value;
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

        const key = (property.key as babelTypes.Identifier).name;

        // Ignore translations for MUI Core components, e.g. MuiTablePagination
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

function findLocales(localesDirectory: string) {
  const items = fse.readdirSync(localesDirectory);
  const locales: any[] = [];
  const localeRegex = /^[a-z]{2}[A-Z]{2}/;

  items.forEach((item) => {
    const match = item.match(localeRegex);
    if (!match) {
      return;
    }

    const localePath = path.resolve(localesDirectory, item);
    const code = match[0];
    locales.push([localePath, code]);
  });

  return locales;
}

function extractAndReplaceTranslations(localePath: string) {
  const translations = {};
  const file = fse.readFileSync(localePath, { encoding: 'utf-8' });
  const { code } = babel.transformSync(file, {
    plugins: [...BABEL_PLUGINS, plugin(translations)],
    configFile: false,
    retainLines: true,
  })!;
  return { translations, transformedCode: code, rawCode: file };
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
      const valueToTransform = existingTranslations[key] || value;
      const ast = astBuilder({ value: valueToTransform }) as babelTypes.Statement;
      const result = babel.transformFromAstSync(babelTypes.program([ast]), undefined, {
        plugins: BABEL_PLUGINS,
        configFile: false,
      });

      const valueAsCode = result!.code!.replace(/^const _ = (.*);/gs, '$1');
      const comment = !existingTranslations[key] ? '// ' : '';

      lines.push(`${comment}${key}: ${valueAsCode},`);
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

async function generateReport(
  missingTranslations: Record<string, { path: string; locations: number[] }>,
) {
  const lastCommitRef = await git('log -n 1 --pretty="format:%H"');
  const lines: string[] = [];
  Object.entries(missingTranslations).forEach(([code, info]) => {
    if (info.locations.length === 0) {
      return;
    }
    lines.push(`### ${countryToFlag(code.slice(2))} ${code}`);
    info.locations.forEach((location) => {
      const permalink = `${SOURCE_CODE_REPO}/blob/${lastCommitRef}/${info.path}#L${location}`;
      lines.push(permalink);
    });
  });
  return lines.join('\n');
}

interface HandlerArgv {
  report: boolean;
}

async function run(argv: HandlerArgv) {
  const { report } = argv;
  const workspaceRoot = path.resolve(__dirname, '../');

  const constantsPath = path.join(
    workspaceRoot,
    'packages/grid/_modules_/grid/constants/localeTextConstants.ts',
  );
  const [baseTranslationsByGroup, baseTranslations] = extractTranslations(constantsPath);

  const localesDirectory = path.resolve(workspaceRoot, 'packages/grid/_modules_/grid/locales');
  const locales = findLocales(localesDirectory);

  const missingTranslations: Record<string, any> = {};

  locales.forEach(([localePath, localeCode]) => {
    const {
      translations: existingTranslations,
      transformedCode,
      rawCode,
    } = extractAndReplaceTranslations(localePath);

    if (!transformedCode || Object.keys(existingTranslations).length === 0) {
      return;
    }

    const codeWithNewTranslations = injectTranslations(
      transformedCode,
      existingTranslations,
      baseTranslationsByGroup,
    );

    const prettierConfigPath = path.join(workspaceRoot, 'prettier.config.js');
    const prettierConfig = prettier.resolveConfig.sync(localePath, { config: prettierConfigPath });

    const prettifiedCode = prettier.format(codeWithNewTranslations, {
      ...prettierConfig,
      filepath: localePath,
    });

    const lines = rawCode.split('\n');
    Object.entries(baseTranslations).forEach(([key]) => {
      if (!existingTranslations[key]) {
        if (!missingTranslations[localeCode]) {
          missingTranslations[localeCode] = {
            path: localePath.replace(workspaceRoot, '').slice(1), // Remove leading slash
            locations: [],
          };
        }
        const location = lines.findIndex((line) => line.trim().startsWith(`// ${key}:`));
        // Ignore when both the translation and the placeholder are missing
        if (location >= 0) {
          missingTranslations[localeCode].locations.push(location + 1);
        }
      }
    });

    if (!report) {
      fse.writeFileSync(localePath, prettifiedCode);
      // eslint-disable-next-line no-console
      console.log(`Wrote ${localeCode} locale.`);
    }
  });

  if (report) {
    // eslint-disable-next-line no-console
    console.log(await generateReport(missingTranslations));
  }

  process.exit(0);
}

yargs
  .command({
    command: '$0',
    describe: 'Syncs translation files.',
    builder: (command) => {
      return command.option('report', {
        describe: "Don't write any file but generates a report with the missing translations.",
        type: 'boolean',
        default: false,
      });
    },
    handler: run,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
