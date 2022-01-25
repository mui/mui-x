import { Annotation } from 'doctrine';
import kebabCase from 'lodash/kebabCase';
import * as prettier from 'prettier';
import * as fse from 'fs-extra';
import * as ts from 'typescript';
import FEATURE_TOGGLE from '../../src/featureToggle';

export interface Project {
  name: ProjectNames;
  exports: Record<string, ts.Symbol>;
  program: ts.Program;
  checker: ts.TypeChecker;
  workspaceRoot: string;
  prettierConfigPath: string;
}

export type ProjectNames = 'x-data-grid' | 'x-data-grid-pro';

export type Projects = Map<ProjectNames, Project>;

export type DocumentedInterfaces = Map<string, ProjectNames[]>;

export const getSymbolDescription = (symbol: ts.Symbol, project: Project) =>
  symbol
    .getDocumentationComment(project.checker)
    .map((comment) => comment.text)
    .join('\n');

export const getSymbolJSDocTags = (symbol: ts.Symbol) =>
  Object.fromEntries(symbol.getJsDocTags().map((tag) => [tag.name, tag]));

export function getJsdocDefaultValue(jsdoc: Annotation) {
  const defaultTag = jsdoc.tags.find((tag) => tag.title === 'default');
  if (defaultTag === undefined) {
    return undefined;
  }
  return defaultTag.description || '';
}

export function escapeCell(value: string) {
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, '<br />');
}

export const formatType = (rawType: string) => {
  const prefix = 'type FakeType = ';
  const signatureWithTypeName = `${prefix}${rawType}`;

  const prettifiedSignatureWithTypeName = prettier.format(signatureWithTypeName, {
    printWidth: 999,
    singleQuote: true,
    semi: false,
    trailingComma: 'none',
    parser: 'typescript',
  });

  return prettifiedSignatureWithTypeName.slice(prefix.length).replace(/\n$/, '');
};

export const stringifySymbol = (symbol: ts.Symbol, project: Project) => {
  const rawType =
    symbol.valueDeclaration && ts.isPropertySignature(symbol.valueDeclaration)
      ? symbol.valueDeclaration.type?.getText() ?? ''
      : project.checker.typeToString(
          project.checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!),
          symbol.valueDeclaration,
          ts.TypeFormatFlags.NoTruncation,
        );

  return formatType(rawType);
};

export function linkify(
  text: string | undefined,
  documentedInterfaces: DocumentedInterfaces,
  format: 'markdown' | 'html',
) {
  if (text == null) {
    return '';
  }

  const bracketsRegexp = /\[\[([^\]]+)\]\]/g;
  return text.replace(bracketsRegexp, (match: string, content: string) => {
    if (!documentedInterfaces.get(content)) {
      return content;
    }
    const url = `${FEATURE_TOGGLE.enable_redirects ? '/x' : ''}/api/data-grid/${kebabCase(
      content,
    )}/`;
    return format === 'markdown' ? `[${content}](${url})` : `<a href="${url}">${content}</a>`;
  });
}

export function writePrettifiedFile(filename: string, data: string, project: Project) {
  const prettierConfig = prettier.resolveConfig.sync(filename, {
    config: project.prettierConfigPath,
  });
  if (prettierConfig === null) {
    throw new Error(
      `Could not resolve config for '${filename}' using prettier config path '${project.prettierConfigPath}'.`,
    );
  }

  fse.writeFileSync(filename, prettier.format(data, { ...prettierConfig, filepath: filename }), {
    encoding: 'utf8',
  });
}
