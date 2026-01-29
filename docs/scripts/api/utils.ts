import { kebabCase } from 'es-toolkit/string';
import * as prettier from 'prettier';
import { Symbol } from 'typescript';
import fs from 'node:fs/promises';
// eslint-disable-next-line no-restricted-imports
import {
  getSymbolDescription as getSymbolDescriptionBase,
  getSymbolJSDocTags as getSymbolJSDocTagsBase,
  formatType,
  stringifySymbol as stringifySymbolBase,
} from '@mui/monorepo/packages/api-docs-builder/buildApiUtils';
// eslint-disable-next-line no-restricted-imports
import resolveExportSpecifierBase from '@mui/monorepo/packages/api-docs-builder/utils/resolveExportSpecifier';
import { XTypeScriptProject, XProjectNames } from '../createXTypeScriptProjects';
import { resolvePrettierConfigPath } from '../utils';

export type DocumentedInterfaces = Map<string, XProjectNames[]>;

// Re-export formatType from api-docs-builder
export { formatType };

// Wrap functions to use XTypeScriptProject type (which extends TypeScriptProject)
export const getSymbolDescription = (symbol: Symbol, project: XTypeScriptProject) =>
  getSymbolDescriptionBase(symbol, project);

export const getSymbolJSDocTags = getSymbolJSDocTagsBase;

export const stringifySymbol = (symbol: Symbol, project: XTypeScriptProject) =>
  stringifySymbolBase(symbol, project);

export const resolveExportSpecifier = (symbol: Symbol, project: XTypeScriptProject) =>
  resolveExportSpecifierBase(symbol, project);

/**
 * Escapes HTML entities for display in HTML context.
 * Note: This is different from the api-docs-builder escapeCell which also handles
 * markdown table pipes. This version is specifically for HTML output.
 */
export function escapeCell(value: string) {
  return value.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r?\n/g, '<br />');
}

export function linkify(
  text: string | undefined,
  documentedInterfaces: DocumentedInterfaces,
  format: 'markdown' | 'html',
  folder: string,
) {
  if (text == null) {
    return '';
  }

  const bracketsRegexp = /\[\[([^\]]+)\]\]/g;
  return text.replace(bracketsRegexp, (match: string, content: string) => {
    if (!documentedInterfaces.get(content)) {
      return content;
    }
    const url = `/x/api/${folder}/${kebabCase(content)}/`;
    return format === 'markdown' ? `[${content}](${url})` : `<a href="${url}">${content}</a>`;
  });
}

export async function writePrettifiedFile(filename: string, data: string) {
  const prettierConfigPath = await resolvePrettierConfigPath();
  const prettierConfig = await prettier.resolveConfig(filename, {
    config: prettierConfigPath,
  });
  if (prettierConfig === null) {
    throw new Error(
      `Could not resolve config for '${filename}' using prettier config path '${prettierConfigPath}'.`,
    );
  }

  await fs.writeFile(
    filename,
    await prettier.format(data, { ...prettierConfig, filepath: filename }),
    {
      encoding: 'utf8',
    },
  );
}
