/* eslint-disable no-bitwise */
/**
 * Type formatting logic: converts TypeScript types to PropType-style format.
 */
import * as ts from 'typescript';
import type { PropTypeInfo, PropSignature, JsDocInfo } from './types';
import { MAX_DEPTH, MAX_OBJECT_PROPERTIES } from './config';

const UNION_SEP = '<br>&#124;&nbsp;';

// Track visited types to prevent infinite recursion
const visitedTypes = new Set<number>();

function withVisited<T>(type: ts.Type, fn: () => T, fallback: T): T {
  const id = (type as any).id as number | undefined;
  if (id !== undefined) {
    if (visitedTypes.has(id)) {
      return fallback;
    }
    visitedTypes.add(id);
    try {
      return fn();
    } finally {
      visitedTypes.delete(id);
    }
  }
  return fn();
}

// ---------------------------------------------------------------------------
// Core type formatting
// ---------------------------------------------------------------------------

function stripUndefinedNull(type: ts.Type, checker: ts.TypeChecker): ts.Type {
  if (!type.isUnion()) {
    return type;
  }
  const filtered = type.types.filter(
    (t) => !(t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)),
  );
  if (filtered.length === 0) {
    return type;
  }
  if (filtered.length === 1) {
    return filtered[0];
  }
  // Reconstruct union without undefined/null using the internal API
  return (checker as unknown as { getUnionType(types: ts.Type[]): ts.Type }).getUnionType(filtered);
}

function isBooleanUnion(type: ts.Type): boolean {
  if (!type.isUnion()) {
    return false;
  }
  const nonNull = type.types.filter(
    (t) => !(t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)),
  );
  return nonNull.length === 2 && nonNull.every((m) => !!(m.flags & ts.TypeFlags.BooleanLiteral));
}

function isArrayType(type: ts.Type, checker: ts.TypeChecker): boolean {
  if (checker.isArrayType(type)) {
    return true;
  }
  const sym = type.getSymbol();
  if (sym?.name === 'ReadonlyArray' || sym?.name === 'Array') {
    return true;
  }
  const ref = type as ts.TypeReference;
  if (ref.target) {
    const targetName = ref.target.getSymbol()?.name;
    if (targetName === 'Array' || targetName === 'ReadonlyArray') {
      return true;
    }
  }
  return false;
}

/**
 * Main entry point: TypeScript type → PropType-style { name, description? }.
 */
export function formatPropType(
  type: ts.Type,
  checker: ts.TypeChecker,
  depth: number = 0,
): PropTypeInfo {
  return withVisited(type, () => formatPropTypeInner(type, checker, depth), { name: 'object' });
}

function formatPropTypeInner(type: ts.Type, checker: ts.TypeChecker, depth: number): PropTypeInfo {
  // Bail early on deep nesting
  if (depth > 3) {
    return { name: 'object' };
  }

  // Check type string BEFORE stripping undefined/null (detects ReactNode, Ref<>, etc.)
  const rawTypeStr = checker.typeToString(type);
  if (rawTypeStr === 'ReactNode' || rawTypeStr === 'React.ReactNode') {
    return { name: 'node' };
  }
  if (rawTypeStr.startsWith('ReactElement') || rawTypeStr.startsWith('React.ReactElement')) {
    return { name: 'element' };
  }
  // Only detect React.Ref<T> as custom ref, not MutableRefObject (which should expand as shape)
  if (/(?:^|\W)Ref</.test(rawTypeStr) && !rawTypeStr.includes('MutableRefObject')) {
    return { name: 'custom', description: 'ref' };
  }
  if (rawTypeStr.includes('SxProps')) {
    return {
      name: 'union',
      description: `Array&lt;func${UNION_SEP}object${UNION_SEP}bool&gt;${UNION_SEP}func${UNION_SEP}object`,
    };
  }

  type = stripUndefinedNull(type, checker);

  // Primitives
  if (type.flags & ts.TypeFlags.BooleanLiteral || type.flags & ts.TypeFlags.Boolean) {
    return { name: 'bool' };
  }
  if (type.flags & ts.TypeFlags.String) {
    return { name: 'string' };
  }
  if (type.flags & ts.TypeFlags.Number) {
    return { name: 'number' };
  }
  if (
    type.flags &
    (ts.TypeFlags.Any | ts.TypeFlags.Unknown | ts.TypeFlags.Void | ts.TypeFlags.Never)
  ) {
    return { name: 'any' };
  }

  // Literals
  if (type.isStringLiteral()) {
    return { name: 'enum', description: `'${type.value}'` };
  }
  if (type.isNumberLiteral()) {
    return { name: 'enum', description: String(type.value) };
  }

  // Also check after stripping (catches cases where e.g. ReactNode | undefined was stripped)
  const strippedStr = checker.typeToString(type);
  if (strippedStr === 'ReactNode' || strippedStr === 'React.ReactNode') {
    return { name: 'node' };
  }
  if (strippedStr.startsWith('ReactElement') || strippedStr.startsWith('React.ReactElement')) {
    return { name: 'element' };
  }
  if (/(?:^|\W)Ref</.test(strippedStr) && !strippedStr.includes('MutableRefObject')) {
    return { name: 'custom', description: 'ref' };
  }
  if (strippedStr.includes('SxProps')) {
    return {
      name: 'union',
      description: `Array&lt;func${UNION_SEP}object${UNION_SEP}bool&gt;${UNION_SEP}func${UNION_SEP}object`,
    };
  }

  // Boolean union (true | false)
  if (isBooleanUnion(type)) {
    return { name: 'bool' };
  }

  // Union types
  if (type.isUnion()) {
    return formatUnionType(type, checker, depth);
  }

  // Array
  if (isArrayType(type, checker)) {
    return formatArrayType(type, checker, depth);
  }

  // Function
  if (type.getCallSignatures().length > 0) {
    return { name: 'func' };
  }

  // Object / shape
  if (type.flags & ts.TypeFlags.Object || type.isIntersection()) {
    return formatObjectType(type, checker, depth);
  }

  return { name: 'any' };
}

// ---------------------------------------------------------------------------
// Union
// ---------------------------------------------------------------------------

function formatUnionType(type: ts.UnionType, checker: ts.TypeChecker, depth: number): PropTypeInfo {
  const members = type.types.filter(
    (t) => !(t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)),
  );

  if (members.length === 0) {
    return { name: 'any' };
  }
  if (members.length === 1) {
    return formatPropType(members[0], checker, depth);
  }

  // All string/number literals → enum
  const allLiterals = members.every((m) => m.isStringLiteral() || m.isNumberLiteral());
  if (allLiterals) {
    const parts = members.map((m) => {
      if (m.isStringLiteral()) {
        return `'${m.value}'`;
      }
      return String((m as ts.NumberLiteralType).value);
    });
    return { name: 'enum', description: parts.sort().join(UNION_SEP) };
  }

  // Mixed union
  const parts = members.map((m) => toShort(m, checker, depth + 1));
  return { name: 'union', description: parts.sort().join(UNION_SEP) };
}

// ---------------------------------------------------------------------------
// Array
// ---------------------------------------------------------------------------

function formatArrayType(type: ts.Type, checker: ts.TypeChecker, depth: number): PropTypeInfo {
  const typeArgs = (type as ts.TypeReference).typeArguments;
  if (typeArgs && typeArgs.length > 0) {
    const elemStr = toShort(typeArgs[0], checker, depth + 1);
    return { name: 'arrayOf', description: `Array&lt;${elemStr}&gt;` };
  }
  return { name: 'arrayOf', description: 'Array&lt;any&gt;' };
}

// ---------------------------------------------------------------------------
// Object / shape
// ---------------------------------------------------------------------------

function formatObjectType(type: ts.Type, checker: ts.TypeChecker, depth: number): PropTypeInfo {
  if (type.getCallSignatures().length > 0) {
    return { name: 'func' };
  }

  const properties = type.getProperties().slice().sort((a, b) => a.name.localeCompare(b.name));

  // No properties, too deep, or too many properties → just "object"
  if (properties.length === 0 || depth >= MAX_DEPTH || properties.length > MAX_OBJECT_PROPERTIES) {
    return { name: 'object' };
  }

  return withVisited(
    type,
    () => {
      const parts: string[] = [];
      for (const prop of properties) {
        if (prop.name.startsWith('_') || prop.name.startsWith('$')) {
          continue;
        }
        const propType = checker.getTypeOfSymbol(prop);
        const optional = prop.flags & ts.SymbolFlags.Optional ? '?' : '';
        const propStr = toShort(propType, checker, depth + 1);
        parts.push(`${prop.name}${optional}: ${propStr}`);
      }
      if (parts.length === 0) {
        return { name: 'object' };
      }
      return { name: 'shape', description: `{ ${parts.join(', ')} }` };
    },
    { name: 'object' },
  );
}

// ---------------------------------------------------------------------------
// Short string representation (used inside descriptions)
// ---------------------------------------------------------------------------

function toShort(type: ts.Type, checker: ts.TypeChecker, depth: number): string {
  if (depth > 4) {
    return 'any';
  }

  return withVisited(type, () => toShortInner(type, checker, depth), 'object');
}

function toShortInner(type: ts.Type, checker: ts.TypeChecker, depth: number): string {
  type = stripUndefinedNull(type, checker);

  // Boolean
  if (type.flags & ts.TypeFlags.Boolean || isBooleanUnion(type)) {
    return 'bool';
  }
  if (type.flags & ts.TypeFlags.BooleanLiteral) {
    return 'bool';
  }
  if (type.flags & ts.TypeFlags.String) {
    return 'string';
  }
  if (type.flags & ts.TypeFlags.Number) {
    return 'number';
  }
  if (type.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) {
    return 'any';
  }
  if (type.flags & ts.TypeFlags.Void) {
    return 'void';
  }

  if (type.isStringLiteral()) {
    return `'${type.value}'`;
  }
  if (type.isNumberLiteral()) {
    return String(type.value);
  }

  // React types (via fast string check)
  const str = checker.typeToString(type);
  if (str === 'ReactNode' || str === 'React.ReactNode') {
    return 'node';
  }
  if (str.startsWith('ReactElement')) {
    return 'element';
  }
  if (/(?:^|\W)Ref</.test(str) && !str.includes('MutableRefObject')) {
    return 'ref';
  }
  if (str.includes('SxProps')) {
    return 'object';
  }

  // Union
  if (type.isUnion()) {
    const members = type.types.filter(
      (t) => !(t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)),
    );
    if (members.length === 1) {
      return toShort(members[0], checker, depth);
    }
    return members.map((m) => toShort(m, checker, depth + 1)).sort().join(UNION_SEP);
  }

  // Array
  if (isArrayType(type, checker)) {
    const typeArgs = (type as ts.TypeReference).typeArguments;
    if (typeArgs && typeArgs.length > 0) {
      return `Array&lt;${toShort(typeArgs[0], checker, depth + 1)}&gt;`;
    }
    return 'array';
  }

  // Function
  if (type.getCallSignatures().length > 0) {
    return 'func';
  }

  // Object/shape
  if (type.flags & ts.TypeFlags.Object || type.isIntersection()) {
    const properties = type.getProperties().slice().sort((a, b) => a.name.localeCompare(b.name));
    if (properties.length === 0 || depth >= MAX_DEPTH || properties.length > MAX_OBJECT_PROPERTIES) {
      return 'object';
    }

    const parts: string[] = [];
    for (const prop of properties) {
      if (prop.name.startsWith('_') || prop.name.startsWith('$')) {
        continue;
      }
      const propType = checker.getTypeOfSymbol(prop);
      const optional = prop.flags & ts.SymbolFlags.Optional ? '?' : '';
      parts.push(`${prop.name}${optional}: ${toShort(propType, checker, depth + 1)}`);
    }
    if (parts.length === 0) {
      return 'object';
    }
    return `{ ${parts.join(', ')} }`;
  }

  return 'any';
}

// ---------------------------------------------------------------------------
// Normalize T[] to Array<T>
// ---------------------------------------------------------------------------

function normalizeArraySyntax(typeStr: string): string {
  // Convert simple T[] → Array<T> and (T | U)[] → Array<T | U>
  // Handle nested cases by repeating
  let result = typeStr;
  // Simple: T[] → Array<T>
  let prev = '';
  while (prev !== result) {
    prev = result;
    // Match word[] or generic[] (e.g., TreeViewItemId[] or string[])
    result = result.replace(/(\w+)\[\]/g, 'Array<$1>');
    // Match parenthesized union[] (e.g., (A | B)[])
    result = result.replace(/\(([^)]+)\)\[\]/g, 'Array<$1>');
    // Match generic with params[] (e.g., Array<T>[])
    result = result.replace(/(Array<[^>]+>)\[\]/g, 'Array<$1>');
  }
  return result;
}

// ---------------------------------------------------------------------------
// Function signature extraction
// ---------------------------------------------------------------------------

export function extractFunctionSignature(
  type: ts.Type,
  checker: ts.TypeChecker,
  jsDoc: JsDocInfo,
): PropSignature | undefined {
  const stripped = stripUndefinedNull(type, checker);
  const callSigs = stripped.getCallSignatures();
  if (callSigs.length === 0) {
    return undefined;
  }

  const sig = callSigs[0];
  const params = sig.parameters.map((p) => {
    // Prefer JSDoc type annotation if available (preserves original type names)
    const jsDocType = jsDoc.paramTypes.get(p.name);
    if (jsDocType) {
      return `${p.name}: ${jsDocType}`;
    }
    const paramType = checker.getTypeOfSymbol(p);
    const typeString = checker.typeToString(paramType, undefined, ts.TypeFormatFlags.NoTruncation);
    return `${p.name}: ${typeString}`;
  });

  const returnType = checker.getReturnTypeOfSignature(sig);
  const returnStr = checker.typeToString(returnType, undefined, ts.TypeFormatFlags.NoTruncation);

  const describedArgs = sig.parameters.filter((p) => jsDoc.params.has(p.name)).map((p) => p.name);

  // Convert T[] to Array<T> for consistency with old output
  const sigStr = `function(${params.join(', ')}) => ${returnStr}`;
  const normalizedSig = normalizeArraySyntax(sigStr);

  const result: PropSignature = {
    type: normalizedSig,
    describedArgs,
  };

  const normalizedReturn = normalizeArraySyntax(returnStr);
  if (normalizedReturn !== 'void' && (jsDoc.returnDescription || describedArgs.length > 0)) {
    result.returned = normalizedReturn;
  }

  return result;
}
