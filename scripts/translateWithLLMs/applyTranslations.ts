import * as fs from 'node:fs';
import * as path from 'node:path';
import * as ts from 'typescript';
import { z } from 'zod';
import { getMissingTranslations } from './getMissingTranslations';
import { PACKAGE_CONFIGS } from './packageConfigs';

type LocaleTranslations = Record<string, string>;
type KeyTranslations = Record<string, LocaleTranslations>;
type TranslationPayload = Record<string, KeyTranslations>;

interface ApplyTranslationsOptions {
  dryRun?: boolean;
}

interface ApplyTranslationsResult {
  mode: 'dry-run' | 'write';
  filesTargeted: number;
  filesUpdated: number;
  translationsInserted: number;
  commentedOutFieldsUncommentedInPlace: number;
  translationsSkippedAlreadyPresent: number;
  warnings: string[];
}

interface FileUpdateTarget {
  variableName: string;
  entries: Array<[string, string]>;
}

/**
 * Build a mapping from translation key to the English variable name that contains it.
 * For multi-object packages (e.g., Scheduler), this maps each key to its source variable
 * (e.g., 'colorPickerLabel' → 'enUSDialog', 'agenda' → 'enUSCalendar').
 */
function buildKeyToVariableMap(sourceText: string, variableNames: string[]): Map<string, string> {
  const sourceFile = ts.createSourceFile('temp.ts', sourceText, ts.ScriptTarget.Latest, true);
  const keyMap = new Map<string, string>();

  function visit(node: ts.Node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      variableNames.includes(node.name.text) &&
      node.initializer &&
      ts.isObjectLiteralExpression(node.initializer)
    ) {
      for (const prop of node.initializer.properties) {
        if (!ts.isPropertyAssignment(prop)) {
          continue;
        }
        if (ts.isIdentifier(prop.name)) {
          keyMap.set(prop.name.text, node.name.text);
        } else if (ts.isStringLiteral(prop.name)) {
          keyMap.set(prop.name.text, node.name.text);
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return keyMap;
}

const ROOT = path.resolve(__dirname, '..', '..');

const translationPayloadSchema = z.record(
  z.string(),
  z.record(z.string(), z.record(z.string(), z.string())),
);

function parsePayload(rawInput: string): TranslationPayload {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawInput.replace(/^\uFEFF/, ''));
  } catch (error) {
    const parseErrorDetail = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid JSON input. ${parseErrorDetail}`);
  }

  const parseResult = translationPayloadSchema.safeParse(parsed);
  if (!parseResult.success) {
    const detail = parseResult.error.issues
      .map((issue) => {
        const pathString = issue.path.length > 0 ? issue.path.join('.') : '<root>';
        return `${pathString}: ${issue.message}`;
      })
      .join('; ');

    throw new Error(
      `Input must be a JSON object: { "<package>": { "<key>": { "<locale>": "..." } } }. ${detail}`,
    );
  }

  return parseResult.data;
}

function getPropertyName(prop: ts.PropertyAssignment): string | undefined {
  if (ts.isIdentifier(prop.name)) {
    return prop.name.text;
  }

  if (ts.isStringLiteral(prop.name)) {
    return prop.name.text;
  }

  return undefined;
}

function findLocaleObjectLiteral(
  sourceText: string,
  variableName: string,
): ts.ObjectLiteralExpression {
  const sourceFile = ts.createSourceFile('locale.ts', sourceText, ts.ScriptTarget.Latest, true);
  let match: ts.ObjectLiteralExpression | undefined;

  function visit(node: ts.Node) {
    if (match) {
      return;
    }

    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === variableName &&
      node.initializer &&
      ts.isObjectLiteralExpression(node.initializer)
    ) {
      match = node.initializer;
      return;
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  if (!match) {
    throw new Error(`Could not find object literal variable "${variableName}".`);
  }

  return match;
}

function isAsciiIdentifier(key: string): boolean {
  return /^[$A-Z_a-z][$0-9A-Z_a-z]*$/.test(key);
}

function renderPropertyKey(key: string): string {
  return isAsciiIdentifier(key) ? key : JSON.stringify(key);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function insertMissingProperties(
  sourceText: string,
  objectLiteral: ts.ObjectLiteralExpression,
  entries: Array<[string, string]>,
): { nextSource: string; inserted: number; skipped: number; uncommented: number } {
  const existingKeys = new Set<string>();

  for (const prop of objectLiteral.properties) {
    if (!ts.isPropertyAssignment(prop)) {
      continue;
    }

    const propName = getPropertyName(prop);
    if (propName) {
      existingKeys.add(propName);
    }
  }

  const toInsert = entries.filter(([key]) => !existingKeys.has(key));
  if (toInsert.length === 0) {
    return {
      nextSource: sourceText,
      inserted: 0,
      skipped: entries.length,
      uncommented: 0,
    };
  }

  const lineEnding = sourceText.includes('\r\n') ? '\r\n' : '\n';
  const objectStart = objectLiteral.getStart();
  const objectEnd = objectLiteral.getEnd();
  let nextObjectSource = sourceText.slice(objectStart, objectEnd);

  const firstProperty = objectLiteral.properties[0];
  let propertyIndent = '  ';
  if (firstProperty) {
    const lineStart =
      sourceText.lastIndexOf(lineEnding, firstProperty.getStart()) + lineEnding.length;
    const leading = sourceText.slice(lineStart, firstProperty.getStart());
    const matched = leading.match(/^\s*/);
    if (matched) {
      propertyIndent = matched[0];
    }
  }

  const appendEntries: Array<[string, string]> = [];
  let uncommented = 0;

  for (const [key, value] of toInsert) {
    const escapedKey = escapeRegExp(key);
    const keyPattern = isAsciiIdentifier(key)
      ? `(?:${escapedKey}|'${escapedKey}'|"${escapedKey}")`
      : `(?:'${escapedKey}'|"${escapedKey}")`;
    const linePattern = new RegExp(`^([\\t ]*)//[\\t ]*${keyPattern}[\\t ]*:.*(?:\\r?\\n)?`, 'm');
    const matchedLine = nextObjectSource.match(linePattern);

    if (!matchedLine) {
      appendEntries.push([key, value]);
      continue;
    }

    const lineIndent = matchedLine[1] ?? propertyIndent;
    const updatedLine = `${lineIndent}${renderPropertyKey(key)}: ${JSON.stringify(value)},${lineEnding}`;
    nextObjectSource = nextObjectSource.replace(linePattern, updatedLine);
    uncommented += 1;
  }

  if (appendEntries.length > 0) {
    const insertionPointInObject = nextObjectSource.lastIndexOf('}');
    const before = nextObjectSource.slice(0, insertionPointInObject);
    const after = nextObjectSource.slice(insertionPointInObject);
    const insertedLines = appendEntries.map(
      ([key, value]) => `${propertyIndent}${renderPropertyKey(key)}: ${JSON.stringify(value)},`,
    );
    const needsLeadingLineBreak = !(before.endsWith('\n') || before.endsWith('\r'));
    const injected = `${needsLeadingLineBreak ? lineEnding : ''}${insertedLines.join(lineEnding)}${lineEnding}`;
    nextObjectSource = `${before}${injected}${after}`;
  }

  const nextSource = `${sourceText.slice(0, objectStart)}${nextObjectSource}${sourceText.slice(objectEnd)}`;

  return {
    nextSource,
    inserted: toInsert.length,
    skipped: entries.length - toInsert.length,
    uncommented,
  };
}

export function applyTranslations(
  rawInput: string,
  options: ApplyTranslationsOptions = {},
): ApplyTranslationsResult {
  const payload = parsePayload(rawInput);
  const dryRun = options.dryRun ?? false;
  const missingData = getMissingTranslations();

  // For multi-object packages, build a map from key → English variable name
  const keyToVariableMaps = new Map<string, Map<string, string>>();
  for (const [packageName, packageConfig] of Object.entries(PACKAGE_CONFIGS)) {
    if (Array.isArray(packageConfig.englishVariableName)) {
      const englishPath = path.join(ROOT, packageConfig.englishSource);
      const englishSource = fs.readFileSync(englishPath, 'utf-8');
      keyToVariableMaps.set(
        packageName,
        buildKeyToVariableMap(englishSource, packageConfig.englishVariableName),
      );
    }
  }

  // Group updates by file + variable name
  const updatesByFileAndVar = new Map<string, FileUpdateTarget[]>();
  const warnings: string[] = [];

  for (const [packageName, packagePayload] of Object.entries(payload)) {
    const packageConfig = PACKAGE_CONFIGS[packageName];
    if (!packageConfig) {
      warnings.push(`Skipping unknown package "${packageName}".`);
      continue;
    }

    const packageMissing = missingData.packages[packageName];
    if (!packageMissing) {
      warnings.push(
        `Skipping package "${packageName}" because it has no missing translation data.`,
      );
      continue;
    }

    const keyToVarMap = keyToVariableMaps.get(packageName);

    for (const [key, localePayload] of Object.entries(packagePayload)) {
      const keyMissing = packageMissing.missing[key];
      if (!keyMissing) {
        warnings.push(`Skipping "${packageName}.${key}" because it is not currently missing.`);
        continue;
      }

      for (const [localeCode, translatedText] of Object.entries(localePayload)) {
        if (!keyMissing.locales.includes(localeCode)) {
          warnings.push(
            `Skipping "${packageName}.${key}.${localeCode}" because this locale is not missing for that key.`,
          );
          continue;
        }

        const localePath = path.join(ROOT, packageConfig.localesDir, `${localeCode}.ts`);
        if (!fs.existsSync(localePath)) {
          warnings.push(
            `Skipping "${packageName}.${key}.${localeCode}" because "${localePath}" was not found.`,
          );
          continue;
        }

        let variableName: string;
        if (keyToVarMap) {
          // Multi-object: map key to the correct locale variable
          // e.g., key 'colorPickerLabel' is in 'enUSDialog' → locale variable is 'frFRDialog'
          const englishVarName = keyToVarMap.get(key);
          if (!englishVarName) {
            warnings.push(
              `Skipping "${packageName}.${key}.${localeCode}" because key could not be mapped to a variable.`,
            );
            continue;
          }
          // Replace the English locale prefix with the target locale prefix
          // e.g., 'enUSDialog' → 'frFRDialog'
          const suffix = englishVarName.replace(/^[a-z]{2}[A-Z]{2}/, '');
          variableName = `${localeCode}${suffix}`;
        } else {
          variableName = packageConfig.getLocaleVariableName(localeCode);
        }

        const targets = updatesByFileAndVar.get(localePath) ?? [];
        let target = targets.find((t) => t.variableName === variableName);
        if (!target) {
          target = { variableName, entries: [] };
          targets.push(target);
        }
        target.entries.push([key, translatedText]);
        updatesByFileAndVar.set(localePath, targets);
      }
    }
  }

  let filesUpdated = 0;
  let insertedCount = 0;
  let alreadyPresentCount = 0;
  let uncommentedCount = 0;

  for (const [localePath, targets] of updatesByFileAndVar) {
    let sourceText = fs.readFileSync(localePath, 'utf8');
    let fileModified = false;

    for (const target of targets) {
      const objectLiteral = findLocaleObjectLiteral(sourceText, target.variableName);
      const { nextSource, inserted, skipped, uncommented } = insertMissingProperties(
        sourceText,
        objectLiteral,
        target.entries,
      );

      sourceText = nextSource;
      insertedCount += inserted;
      alreadyPresentCount += skipped;
      uncommentedCount += uncommented;

      if (inserted > 0 || uncommented > 0) {
        fileModified = true;
      }
    }

    if (fileModified && !dryRun) {
      fs.writeFileSync(localePath, sourceText);
      filesUpdated += 1;
    }

    if (fileModified && dryRun) {
      filesUpdated += 1;
    }
  }

  return {
    mode: dryRun ? 'dry-run' : 'write',
    filesTargeted: updatesByFileAndVar.size,
    filesUpdated,
    translationsInserted: insertedCount,
    commentedOutFieldsUncommentedInPlace: uncommentedCount,
    translationsSkippedAlreadyPresent: alreadyPresentCount,
    warnings,
  };
}
