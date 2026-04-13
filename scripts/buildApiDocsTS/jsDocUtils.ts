/**
 * JSDoc extraction and MUI X declaration utilities.
 */
import * as ts from 'typescript';
import type { JsDocInfo } from './types';

export function extractJsDoc(symbol: ts.Symbol, checker: ts.TypeChecker): JsDocInfo {
  const description = ts.displayPartsToString(symbol.getDocumentationComment(checker));

  const params = new Map<string, string>();
  const paramTypes = new Map<string, string>();
  let defaultValue: string | undefined;
  let deprecated: string | undefined;
  let ignore = false;
  let seeMoreLink: { url: string; text: string } | undefined;
  let returnDescription: string | undefined;

  // Get JSDoc tags from declarations (AST nodes, not JSDocTagInfo)
  const declarations = symbol.getDeclarations() || [];
  for (const decl of declarations) {
    for (const jsDocTag of ts.getJSDocTags(decl)) {
      const tagName = jsDocTag.tagName.text;
      const comment =
        typeof jsDocTag.comment === 'string'
          ? jsDocTag.comment
          : ts.getTextOfJSDocComment(jsDocTag.comment) || '';

      if (tagName === 'default') {
        defaultValue = comment;
      } else if (tagName === 'deprecated') {
        deprecated = comment || '';
      } else if (tagName === 'ignore') {
        ignore = true;
      } else if (tagName === 'param') {
        // For @param tags, extract the name from the AST and type from the braces
        const paramTag = jsDocTag as ts.JSDocParameterTag;
        if (paramTag.name && ts.isIdentifier(paramTag.name)) {
          params.set(paramTag.name.text, comment);
        }
        // Also store the JSDoc type annotation if present (e.g., {React.MouseEvent<...>})
        if (paramTag.name && ts.isIdentifier(paramTag.name) && paramTag.typeExpression) {
          const typeText = paramTag.typeExpression.getText().replace(/^\{|\}$/g, '');
          paramTypes.set(paramTag.name.text, typeText);
        }
      } else if (tagName === 'returns' || tagName === 'return') {
        returnDescription = comment;
      } else if (tagName === 'see') {
        const linkMatch = comment.match(/\{@link\s+(https?:\/\/[^\s}]+)(?:\s+([^}]+))?\}/);
        if (linkMatch) {
          seeMoreLink = { url: linkMatch[1], text: linkMatch[2]?.trim() || '' };
        }
      }
    }
  }

  return {
    description,
    defaultValue,
    deprecated,
    ignore,
    seeMoreLink,
    params,
    paramTypes,
    returnDescription,
  };
}

export function isMuiXDeclaration(declaration: ts.Declaration): boolean {
  const fileName = declaration.getSourceFile().fileName;
  return fileName.includes('/packages/x-');
}

export function isMuiXProp(prop: ts.Symbol): boolean {
  const declarations = prop.getDeclarations();
  if (!declarations || declarations.length === 0) {
    return false;
  }
  return declarations.some((d) => isMuiXDeclaration(d));
}
