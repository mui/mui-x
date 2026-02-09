import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';
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

type OutputFormat = 'json' | 'json-compact' | 'toml' | 'toon';

const ROOT = path.resolve(__dirname, '..', '..');

function parsePackageArgument(argv: string[]): string | undefined {
  const packageOption = argv.find((arg) => arg.startsWith('--package='));
  const packageIndex = argv.indexOf('--package');

  if (packageOption && packageIndex !== -1) {
    throw new Error('Use either "--package=<name>" or "--package <name>", not both.');
  }

  if (packageOption) {
    return packageOption.split('=')[1];
  }

  if (packageIndex !== -1) {
    const packageName = argv[packageIndex + 1];
    if (!packageName || packageName.startsWith('--')) {
      throw new Error('Missing package name after "--package".');
    }
    return packageName;
  }

  return undefined;
}

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

function processPackage(_pkgName: string, config: TranslatePackageConfig): PackageOutput {
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

  // Build inverted index: key → list of locales missing it
  const missingByKey = new Map<string, string[]>();
  const skippedFunctions: string[] = [];

  for (const file of filteredLocaleFiles) {
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
  packageNames?: string | string[],
): MissingTranslationsOutput {
  const localeMap: Record<string, string> = {};
  const allLocales = new Set<string>();
  const result: Record<string, PackageOutput> = {};
  let normalizedPackageNames: string[] | undefined;
  if (Array.isArray(packageNames)) {
    normalizedPackageNames = packageNames;
  } else if (typeof packageNames === 'string') {
    normalizedPackageNames = [packageNames];
  } else {
    normalizedPackageNames = undefined;
  }
  const selectedPackages = normalizedPackageNames
    ? Object.entries(PACKAGE_CONFIGS).filter(([name]) => normalizedPackageNames.includes(name))
    : Object.entries(PACKAGE_CONFIGS);

  if (normalizedPackageNames && selectedPackages.length !== normalizedPackageNames.length) {
    const unknownPackages = normalizedPackageNames.filter((name) => !PACKAGE_CONFIGS[name]);
    const availablePackages = Object.keys(PACKAGE_CONFIGS).sort().join(', ');
    throw new Error(
      `Unknown package(s): ${unknownPackages.join(', ')}. Available packages: ${availablePackages}`,
    );
  }

  for (const [pkgName, config] of selectedPackages) {
    const pkgResult = processPackage(pkgName, config);
    result[pkgName] = pkgResult;

    for (const entry of Object.values(pkgResult.missing)) {
      for (const code of entry.locales) {
        allLocales.add(code);
      }
    }
  }

  // Build locale legend once
  for (const code of Array.from(allLocales).sort()) {
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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function jsonString(value: string) {
  return JSON.stringify(value);
}

function tomlKey(key: string) {
  return /^[A-Za-z0-9_-]+$/.test(key) ? key : jsonString(key);
}

function tomlValue(value: unknown): string {
  if (typeof value === 'string') {
    return jsonString(value);
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (value === null) {
    return '""';
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => tomlValue(item)).join(', ')}]`;
  }

  return jsonString(String(value));
}

function toToml(value: unknown): string {
  if (!isPlainObject(value)) {
    return tomlValue(value);
  }

  const lines: string[] = [];

  const emitTable = (pathSegments: string[], obj: Record<string, unknown>) => {
    if (pathSegments.length > 0) {
      lines.push(`[${pathSegments.map(tomlKey).join('.')}]`);
    }

    const scalarEntries: Array<[string, unknown]> = [];
    const childTables: Array<[string, Record<string, unknown>]> = [];

    for (const [key, entryValue] of Object.entries(obj)) {
      if (isPlainObject(entryValue)) {
        childTables.push([key, entryValue]);
      } else {
        scalarEntries.push([key, entryValue]);
      }
    }

    for (const [key, scalarValue] of scalarEntries) {
      lines.push(`${tomlKey(key)} = ${tomlValue(scalarValue)}`);
    }

    if (scalarEntries.length > 0 && childTables.length > 0) {
      lines.push('');
    }

    childTables.forEach(([childKey, childValue], index) => {
      emitTable([...pathSegments, childKey], childValue);
      if (index < childTables.length - 1) {
        lines.push('');
      }
    });
  };

  emitTable([], value);

  return lines.join('\n');
}

function toonKeySegment(key: string) {
  return /^[A-Za-z0-9_-]+$/.test(key) ? key : `[${jsonString(key)}]`;
}

function toToon(value: unknown): string {
  const lines: string[] = [];

  const flatten = (pathSegments: string[], node: unknown) => {
    if (isPlainObject(node)) {
      const entries = Object.entries(node);
      if (entries.length === 0) {
        lines.push(`${pathSegments.join('.')} = {}`);
        return;
      }

      entries.forEach(([key, child]) => flatten([...pathSegments, toonKeySegment(key)], child));
      return;
    }

    if (pathSegments.length === 0) {
      lines.push(`value = ${JSON.stringify(node)}`);
      return;
    }

    lines.push(`${pathSegments.join('.')} = ${JSON.stringify(node)}`);
  };

  flatten([], value);

  return lines.join('\n');
}

function serialize(value: unknown, format: OutputFormat): string {
  switch (format) {
    case 'json':
      return JSON.stringify(value, null, 2);
    case 'json-compact':
      return JSON.stringify(value);
    case 'toml':
      return toToml(value);
    case 'toon':
      return toToon(value);
    default:
      return JSON.stringify(value, null, 2);
  }
}

function formatName(format: OutputFormat) {
  switch (format) {
    case 'json':
      return 'JSON';
    case 'json-compact':
      return 'Compact JSON';
    case 'toml':
      return 'TOML';
    case 'toon':
      return 'TOON';
    default:
      return 'JSON';
  }
}

function printComparisonTable(data: MissingTranslationsOutput) {
  const formats: OutputFormat[] = ['json', 'json-compact', 'toml', 'toon'];

  const rows = formats.map((format) => {
    const output = serialize(data, format);

    return {
      format: formatName(format),
      symbols: Array.from(output).length,
      bytes: Buffer.byteLength(output, 'utf8'),
      lines: output.split('\n').length,
    };
  });

  process.stdout.write('| Format | Symbols | UTF-8 bytes | Lines |\n');
  process.stdout.write('| --- | ---: | ---: | ---: |\n');
  rows.forEach((row) => {
    process.stdout.write(`| ${row.format} | ${row.symbols} | ${row.bytes} | ${row.lines} |\n`);
  });
}

function main() {
  const argv = process.argv.slice(2);
  if (!argv.includes('--compare')) {
    throw new Error('Only --compare is supported for this script now.');
  }

  const packageName = parsePackageArgument(argv);
  const data = getMissingTranslations(packageName);
  printComparisonTable(data);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}
