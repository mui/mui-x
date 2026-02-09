import { getMissingTranslations } from './getMissingTranslations';

type PromptFormat = 'json' | 'json-compact' | 'toml' | 'toon';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function jsonString(value: string) {
  return JSON.stringify(value);
}

function tomlKey(key: string) {
  return /^[A-Za-z0-9_-]+$/.test(key) ? key : jsonString(key);
}

function tomlString(value: string) {
  return jsonString(value);
}

function tomlValue(value: unknown): string {
  if (typeof value === 'string') {
    return tomlString(value);
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

  return tomlString(String(value));
}

function toToml(value: unknown): string {
  if (!isPlainObject(value)) {
    return tomlValue(value);
  }

  const lines: string[] = [];

  const emitTable = (path: string[], obj: Record<string, unknown>) => {
    if (path.length > 0) {
      lines.push(`[${path.map(tomlKey).join('.')}]`);
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
      emitTable([...path, childKey], childValue);
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

  const flatten = (path: string[], node: unknown) => {
    if (isPlainObject(node)) {
      const entries = Object.entries(node);
      if (entries.length === 0) {
        lines.push(`${path.join('.')} = {}`);
        return;
      }

      entries.forEach(([key, child]) => flatten([...path, toonKeySegment(key)], child));
      return;
    }

    if (path.length === 0) {
      lines.push(`value = ${JSON.stringify(node)}`);
      return;
    }

    lines.push(`${path.join('.')} = ${JSON.stringify(node)}`);
  };

  flatten([], value);

  return lines.join('\n');
}

function serialize(value: unknown, format: PromptFormat): string {
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
      return JSON.stringify(value);
  }
}

function formatName(format: PromptFormat) {
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

function buildPrompt(format: PromptFormat, packageName?: string) {
  const data = getMissingTranslations(packageName);
  const missingByPackage: Record<string, Record<string, { en: string; locales: string[] }>> = {};

  for (const [packageName, packageData] of Object.entries(data.packages)) {
    const missingKeys = Object.entries(packageData.missing);
    if (missingKeys.length === 0) {
      continue;
    }

    missingByPackage[packageName] = {};
    for (const [key, value] of missingKeys) {
      missingByPackage[packageName][key] = {
        en: value.en,
        locales: value.locales,
      };
    }
  }

  const fallbackExpectedResponseFormat = {
    '<package>': {
      '<key>': {
        '<localeCode>': '<translated string>',
      },
    },
  };
  const expectedOutputExample =
    data.expectedResponseFormat && typeof data.expectedResponseFormat === 'object'
      ? data.expectedResponseFormat
      : fallbackExpectedResponseFormat;

  const outputLabel = formatName(format);

  return `You are translating MUI X localization strings.

Task:
- Translate each English source string into the listed missing locales.
- Keep package names and translation keys exactly as provided.
- Preserve placeholders and formatting exactly (examples: {0}, {value}, %s, \\n, punctuation).
- Return ONLY valid ${outputLabel} (no markdown, no explanation).
- Include ONLY keys/locales that you actually translated.

Expected output format example:
${serialize(expectedOutputExample, format)}

Locale codes:
${serialize(data.locales, format)}

Missing translations input:
${serialize(missingByPackage, format)}
`;
}

function parseFormatArgument(argv: string[]): PromptFormat {
  const formatOption = argv.find((arg) => arg.startsWith('--format='));
  const rawFormat = formatOption?.split('=')[1];

  if (
    rawFormat === 'json' ||
    rawFormat === 'json-compact' ||
    rawFormat === 'toml' ||
    rawFormat === 'toon'
  ) {
    return rawFormat;
  }

  return 'json-compact';
}

function main() {
  const argv = process.argv.slice(2);
  const format = parseFormatArgument(argv);
  const packageName = parsePackageArgument(argv);
  process.stdout.write(buildPrompt(format, packageName));
  process.stdout.write('\n');
}

main();
