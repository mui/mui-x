import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import localeNames from '../localeNames';
import { PACKAGE_CONFIGS, type TranslatePackageConfig } from './packageConfigs';

interface EnglishEntry {
  type: 'string' | 'function';
  value: string;
}

export interface MissingKeyEntry {
  en: string;
  locales: string[];
}

export interface PackageOutput {
  totalKeys: number;
  skippedFunctions: string[];
  missing: Record<string, MissingKeyEntry>;
}

export interface MissingTranslationsOutput {
  locales: Record<string, string>;
  packages: Record<string, PackageOutput>;
  expectedResponseFormat: {
    _comment: string;
    '<package>': {
      '<key>': {
        '<localeCode>': string;
      };
    };
  };
}

const ROOT = path.resolve(__dirname, '..', '..');

function fileNameToLocaleCode(fileName: string): string {
  // e.g. "frFR.ts" -> "frFR"
  return path.basename(fileName, '.ts');
}

function localeCodeToLanguageKey(code: string): string {
  // Convert camelCase locale code to BCP 47 key used in localeNames.js
  // e.g. "frFR" -> "fr-FR", "zhCN" -> "zh-CN", "eu" -> "eu", "mk" -> "mk"
  if (code.length <= 2) {
    return code;
  }
  // Find where the uppercase region starts (e.g. "frFR" -> split at index 2)
  const match = code.match(/^([a-z]+)([A-Z].*)$/);
  if (!match) {
    return code;
  }
  return `${match[1]}-${match[2]}`;
}

function getLanguageName(localeCode: string): string {
  const key = localeCodeToLanguageKey(localeCode);
  return localeNames[key] || key;
}

function extractObjectProperties(
  sourceText: string,
  variableName: string,
): Map<string, EnglishEntry> {
  const sourceFile = ts.createSourceFile('temp.ts', sourceText, ts.ScriptTarget.Latest, true);
  const result = new Map<string, EnglishEntry>();

  function findVariable(node: ts.Node): ts.ObjectLiteralExpression | undefined {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
      if (node.name.text === variableName && node.initializer) {
        if (ts.isObjectLiteralExpression(node.initializer)) {
          return node.initializer;
        }
      }
    }
    let found: ts.ObjectLiteralExpression | undefined;
    ts.forEachChild(node, (child) => {
      if (!found) {
        found = findVariable(child);
      }
    });
    return found;
  }

  const objectLiteral = findVariable(sourceFile);
  if (!objectLiteral) {
    throw new Error(`Variable "${variableName}" not found in source`);
  }

  for (const prop of objectLiteral.properties) {
    if (!ts.isPropertyAssignment(prop)) {
      continue;
    }

    let name: string;
    if (ts.isIdentifier(prop.name)) {
      name = prop.name.text;
    } else if (ts.isStringLiteral(prop.name)) {
      name = prop.name.text;
    } else {
      continue;
    }

    const initText = prop.initializer.getText(sourceFile);
    const isFunction =
      ts.isArrowFunction(prop.initializer) || ts.isFunctionExpression(prop.initializer);

    result.set(name, {
      type: isFunction ? 'function' : 'string',
      value: initText,
    });
  }

  return result;
}

function extractPropertyNames(sourceText: string): Set<string> {
  const sourceFile = ts.createSourceFile('temp.ts', sourceText, ts.ScriptTarget.Latest, true);
  const names = new Set<string>();

  function findObjectLiterals(node: ts.Node): void {
    if (ts.isVariableDeclaration(node) && node.initializer) {
      if (ts.isObjectLiteralExpression(node.initializer)) {
        for (const prop of node.initializer.properties) {
          if (!ts.isPropertyAssignment(prop)) {
            continue;
          }
          if (ts.isIdentifier(prop.name)) {
            names.add(prop.name.text);
          } else if (ts.isStringLiteral(prop.name)) {
            names.add(prop.name.text);
          }
        }
      }
    }
    ts.forEachChild(node, findObjectLiterals);
  }

  findObjectLiterals(sourceFile);
  return names;
}

function stripQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith('`') && trimmed.endsWith('`'))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

interface ProcessPackageOptions {
  selectedLocaleCodes: Set<string>;
  matchedLocales: Set<string>;
}

function processPackageWithLocaleFilter(
  _pkgName: string,
  config: TranslatePackageConfig,
  options?: ProcessPackageOptions,
): PackageOutput {
  const englishPath = path.join(ROOT, config.englishSource);
  const englishSource = fs.readFileSync(englishPath, 'utf-8');
  const englishEntries = extractObjectProperties(englishSource, config.englishVariableName);
  const englishKeys = new Set(englishEntries.keys());

  const localesDir = path.join(ROOT, config.localesDir);
  const localeFiles = fs
    .readdirSync(localesDir)
    .filter((f) => f.endsWith('.ts') && !config.excludeFiles.includes(f))
    .filter((f) => !f.startsWith('utils'));

  const filteredLocaleFiles = localeFiles.filter((f) => {
    const fullPath = path.join(localesDir, f);
    return fs.statSync(fullPath).isFile();
  });

  const localeFilesToProcess =
    options.selectedLocaleCodes && options.selectedLocaleCodes.size > 0
      ? filteredLocaleFiles.filter((fileName) => {
          const localeCode = fileNameToLocaleCode(fileName);
          const isSelected = options.selectedLocaleCodes!.has(localeCode);
          if (isSelected) {
            options.matchedLocales?.add(localeCode);
          }
          return isSelected;
        })
      : filteredLocaleFiles;

  const missingByKey = new Map<string, string[]>();
  const skippedFunctions: string[] = [];

  for (const file of localeFilesToProcess) {
    const localeCode = fileNameToLocaleCode(file);
    const filePath = path.join(localesDir, file);
    const source = fs.readFileSync(filePath, 'utf-8');
    const localeKeys = extractPropertyNames(source);

    for (const key of Array.from(englishKeys)) {
      if (!localeKeys.has(key)) {
        if (!missingByKey.has(key)) {
          missingByKey.set(key, []);
        }
        missingByKey.get(key)!.push(localeCode);
      }
    }
  }

  const missing: Record<string, MissingKeyEntry> = {};

  for (const [key, locales] of Array.from(missingByKey)) {
    const entry = englishEntries.get(key)!;
    if (entry.type === 'function') {
      skippedFunctions.push(key);
      continue;
    }
    missing[key] = {
      en: stripQuotes(entry.value),
      locales,
    };
  }

  return {
    totalKeys: englishKeys.size,
    skippedFunctions,
    missing,
  };
}

export function getMissingTranslations(
  packageNames?: string[],
  localeCodes?: string[],
): MissingTranslationsOutput {
  const localeMap: Record<string, string> = {};
  const allLocales = new Set<string>();
  const result: Record<string, PackageOutput> = {};

  const matchedLocales = new Set<string>();

  const selectedPackages = packageNames
    ? Object.entries(PACKAGE_CONFIGS).filter(([name]) => packageNames.includes(name))
    : Object.entries(PACKAGE_CONFIGS);

  if (packageNames && selectedPackages.length !== packageNames.length) {
    const unknownPackages = packageNames.filter((name) => !PACKAGE_CONFIGS[name]);
    const availablePackages = Object.keys(PACKAGE_CONFIGS).sort().join(', ');
    throw new Error(
      `Unknown package(s): ${unknownPackages.join(', ')}. Available packages: ${availablePackages}`,
    );
  }

  for (const [pkgName, config] of selectedPackages) {
    const pkgResult = processPackageWithLocaleFilter(pkgName, config, {
      selectedLocaleCodes: new Set(localeCodes),
      matchedLocales,
    });
    result[pkgName] = pkgResult;

    for (const entry of Object.values(pkgResult.missing)) {
      for (const code of entry.locales) {
        allLocales.add(code);
      }
    }
  }

  if (localeCodes && localeCodes.length > 0) {
    const unknownLocales = localeCodes.filter((locale) => !matchedLocales.has(locale));

    if (unknownLocales.length > 0) {
      throw new Error(
        `Unknown locale code(s): ${unknownLocales.join(', ')}. Make sure locale files exist for the selected package(s).`,
      );
    }
  }

  const localeCodexToUse = localeCodes && localeCodes.length > 0 ? localeCodes : allLocales;

  for (const code of localeCodexToUse) {
    localeMap[code] = getLanguageName(code);
  }

  return {
    locales: localeMap,
    packages: result,
    expectedResponseFormat: {
      _comment:
        'Respond with this structure. Only include keys and locales that have translations.',
      '<package>': {
        '<key>': {
          '<localeCode>': '<translated string>',
        },
      },
    },
  };
}
