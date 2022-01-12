import { Annotation } from 'doctrine';
import kebabCase from 'lodash/kebabCase';
import * as prettier from 'prettier';
import * as fse from 'fs-extra';
import * as ts from 'typescript';

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

export interface SymbolCommonFields {
  name: string;
  description?: string;
  tags: { [tagName: string]: ts.JSDocTagInfo };
}

interface ParsedInterface extends SymbolCommonFields {
  kind: 'interface';
  properties: ParsedProperty[];
}

export interface ParsedEnum extends SymbolCommonFields {
  kind: 'enum';
  members: ParsedEnumMember[];
}

export type ParsedType = ParsedInterface | ParsedEnum;

export interface ParsedProperty {
  name: string;
  description?: string;
  tags: { [tagName: string]: ts.JSDocTagInfo };
  isOptional: boolean;
  symbol: ts.Symbol;
  typeStr: string;
}

export interface ParsedEnumMember {
  name: string;
  description?: string;
  tags: { [tagName: string]: ts.JSDocTagInfo };
}

export type DocumentedTypes = Map<string, { parsedType: ParsedType; projects: ProjectNames[] }>;

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

const linkify =
  (regexp: RegExp) =>
  (text: string | undefined, documentedTypes: DocumentedTypes, format: 'markdown' | 'html') => {
    if (text == null) {
      return '';
    }

    return text.replace(regexp, (match: string, content: string) => {
      if (!documentedTypes.get(content)) {
        return content;
      }
      const url = `/api/data-grid/${kebabCase(content)}/`;
      return format === 'markdown' ? `[${content}](${url})` : `<a href="${url}">${content}</a>`;
    });
  };

export const linkifyComment = linkify(/\[\[([^\]]+)\]\]/g);

export const linkifyCode = linkify(/([a-zA-Z]+)/);

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
