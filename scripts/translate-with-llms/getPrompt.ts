import { getMissingTranslations } from './getMissingTranslations';

function normalizeSelectedPackages(packageNames?: string | string[]): string[] | undefined {
  if (!packageNames) {
    return undefined;
  }

  return Array.isArray(packageNames) ? packageNames : [packageNames];
}

export function buildPrompt(packageNames?: string | string[]) {
  const selectedPackageNames = normalizeSelectedPackages(packageNames);
  const data = getMissingTranslations(selectedPackageNames);
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

  return `You are translating MUI X localization strings.

Task:
- Translate each English source string into the listed missing locales.
- Keep package names and translation keys exactly as provided.
- Preserve placeholders and formatting exactly (examples: {0}, {value}, %s, \\n, punctuation).
- Return ONLY valid compact JSON (no markdown, no explanation).
- Include ONLY keys/locales that you actually translated.

Expected output format example:
${JSON.stringify(expectedOutputExample)}

Locale codes:
${JSON.stringify(data.locales)}

Missing translations input:
${JSON.stringify(missingByPackage)}
`;
}
