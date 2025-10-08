import { kebabCase } from 'es-toolkit/string';
import * as prettier from 'prettier';
import { Symbol, isPropertySignature, isExportSpecifier, TypeFormatFlags } from 'typescript';
import fs from 'node:fs/promises';
import { XTypeScriptProject, XProjectNames } from '../createXTypeScriptProjects';
import { resolvePrettierConfigPath } from '../utils';

export type DocumentedInterfaces = Map<string, XProjectNames[]>;

export const getSymbolDescription = (symbol: Symbol, project: XTypeScriptProject) =>
  symbol
    .getDocumentationComment(project.checker)
    .flatMap((comment) => comment.text.split('\n'))
    .filter((line) => !line.startsWith('TODO'))
    .join('\n');

export const getSymbolJSDocTags = (symbol: Symbol) =>
  Object.fromEntries(symbol.getJsDocTags().map((tag) => [tag.name, tag]));

export function escapeCell(value: string) {
  return value.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r?\n/g, '<br />');
}

export const formatType = async (rawType: string) => {
  if (!rawType) {
    return '';
  }

  const prefix = 'type FakeType = ';
  const signatureWithTypeName = `${prefix}${rawType}`;

  const prettifiedSignatureWithTypeName = await prettier.format(signatureWithTypeName, {
    printWidth: 999,
    singleQuote: true,
    semi: false,
    trailingComma: 'none',
    parser: 'typescript',
  });

  return prettifiedSignatureWithTypeName.slice(prefix.length).replace(/\n$/, '');
};

export const stringifySymbol = async (symbol: Symbol, project: XTypeScriptProject) => {
  let rawType: string;

  const declaration = symbol.declarations?.[0];
  if (declaration && isPropertySignature(declaration)) {
    rawType = declaration.type?.getText() ?? '';
  } else {
    rawType = project.checker.typeToString(
      project.checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!),
      symbol.valueDeclaration,
      TypeFormatFlags.NoTruncation,
    );
  }

  return formatType(rawType);
};

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

/**
 * Goes to the root symbol of ExportSpecifier
 * That corresponds to one of the following patterns
 * - `export { XXX}`
 * - `export { XXX } from './modules'`
 *
 * Do not go to the root definition for TypeAlias (ie: `export type XXX = YYY`)
 * Because we usually want to keep the description and tags of the aliased symbol.
 */
export const resolveExportSpecifier = (symbol: Symbol, project: XTypeScriptProject) => {
  let resolvedSymbol = symbol;

  while (resolvedSymbol.declarations && isExportSpecifier(resolvedSymbol.declarations[0])) {
    const newResolvedSymbol = project.checker.getImmediateAliasedSymbol(resolvedSymbol);

    if (!newResolvedSymbol) {
      throw new Error('Impossible to resolve export specifier');
    }

    resolvedSymbol = newResolvedSymbol;
  }

  return resolvedSymbol;
};
