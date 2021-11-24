import { Annotation } from 'doctrine';
import kebabCase from 'lodash/kebabCase';
import * as prettier from 'prettier';
import * as fse from 'fs-extra';
import * as TypeDoc from 'typedoc';

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

export interface DeclarationContext {
  name: string;
  description?: string;
  properties: TypeDoc.DeclarationReflection[];
}

export function linkify(
  text: string | undefined,
  documentedInterfaces: Map<string, boolean>,
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
    const url = `/api/data-grid/${kebabCase(content)}/`;
    return format === 'markdown' ? `[${content}](${url})` : `<a href="${url}">${content}</a>`;
  });
}

export function writePrettifiedFile(filename: string, data: string, prettierConfigPath: string) {
  const prettierConfig = prettier.resolveConfig.sync(filename, {
    config: prettierConfigPath,
  });
  if (prettierConfig === null) {
    throw new Error(
      `Could not resolve config for '${filename}' using prettier config path '${prettierConfigPath}'.`,
    );
  }

  fse.writeFileSync(filename, prettier.format(data, { ...prettierConfig, filepath: filename }), {
    encoding: 'utf8',
  });
}

const isUnionType = (type: TypeDoc.Type): type is TypeDoc.UnionType => type.type === 'union';

const isIntrinsicType = (type: TypeDoc.Type): type is TypeDoc.IntrinsicType =>
  type.type === 'intrinsic';

const isLiteralType = (type: TypeDoc.Type): type is TypeDoc.LiteralType => type.type === 'literal';

const isArrayType = (type: TypeDoc.Type): type is TypeDoc.ArrayType => type.type === 'array';

const isReflectionType = (type: TypeDoc.Type): type is TypeDoc.ReflectionType =>
  type.type === 'reflection';

const isReferenceType = (type: TypeDoc.Type): type is TypeDoc.ReferenceType =>
  type.type === 'reference';

const isIndexedAccessType = (type: TypeDoc.Type): type is TypeDoc.IndexedAccessType =>
  type.type === 'indexedAccess';

const isTypeOperatorType = (type: TypeDoc.Type): type is TypeDoc.TypeOperatorType =>
  type.type === 'typeOperator';

export const isDeclarationReflection = (
  reflection: TypeDoc.Reflection,
): reflection is TypeDoc.DeclarationReflection =>
  reflection instanceof TypeDoc.DeclarationReflection;

// Based on https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/type.hbs
export function generateTypeStr(type: TypeDoc.Type, needsParenthesis = false): string {
  if (isUnionType(type)) {
    let text = needsParenthesis ? '(' : '';
    text += type.types.map((childType) => generateTypeStr(childType, true)).join(' | ');
    return needsParenthesis ? `${text})` : text;
  }
  if (isIntrinsicType(type)) {
    return type.name;
  }
  if (isLiteralType(type)) {
    return `${type.value}`;
  }
  if (isArrayType(type)) {
    return `${generateTypeStr(type.elementType, true)}[]`;
  }
  if (isReflectionType(type)) {
    if (type.declaration.signatures && type.declaration.signatures.length === 1) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return generateSignatureStr(type.declaration.signatures[0], needsParenthesis);
    }
    if (type.declaration.children) {
      let text = '{ ';
      text += type.declaration.children
        .map((child) => {
          let memberText = child.name;
          if (child.flags.isOptional) {
            memberText += '?';
          }
          return `${memberText}: ${child.type ? generateTypeStr(child.type) : 'any'}`;
        })
        .join('; ');
      text += ' }';
      return text;
    }

    const param = type.declaration.indexSignature?.parameters?.[0];
    const indexSignatureType = type.declaration.indexSignature?.type;

    if (param) {
      const paramName = param.name;
      const paramType = param.type ? generateTypeStr(param.type) : 'any';
      const valueType = indexSignatureType ? generateTypeStr(indexSignatureType) : 'any';
      return `{ [${paramName}: ${paramType}]: ${valueType} }`;
    }

    return '';
  }
  if (isReferenceType(type)) {
    let text = type.name;
    if (type.typeArguments) {
      text += `<`;
      text += type.typeArguments.map((arg) => generateTypeStr(arg)).join(', ');
      text += `>`;
    }
    return text;
  }
  if (isIndexedAccessType(type)) {
    return `${generateTypeStr(type.objectType)}[${generateTypeStr(type.indexType)}]`;
  }
  if (isTypeOperatorType(type)) {
    return `${type.operator} ${generateTypeStr(type.target)}`;
  }

  return '';
}

export function generateSignatureStr(
  signature: TypeDoc.SignatureReflection,
  needsParenthesis = false,
) {
  let text = needsParenthesis ? '(' : '';
  if (signature.typeParameters?.length) {
    // Handle function generic parameters
    text += '<';
    text += signature.typeParameters
      .map((generic) => {
        let genericLine = generic.name;
        if (generic.type) {
          genericLine += ` extends ${generateTypeStr(generic.type)}`;
        }
        if (generic.default) {
          genericLine += ` = ${generateTypeStr(generic.default)}`;
        }
        return genericLine;
      })
      .join(', ');
    text += '>';
  }
  text += '(';
  text += signature
    .parameters!.map((param) => {
      let paramText = param.flags.isRest ? `...${param.name}` : param.name;
      if (param.flags.isOptional) {
        paramText += '?';
      }
      if (param.defaultValue) {
        paramText += '?';
      }
      if (param.type) {
        paramText += `: ${generateTypeStr(param.type)}`;
      } else {
        paramText += ': any';
      }

      return paramText;
    })
    .join(', ');
  text += ')';
  if (signature.type) {
    text += ` => ${generateTypeStr(signature.type)}`;
  }
  return needsParenthesis ? `${text})` : text;
}
