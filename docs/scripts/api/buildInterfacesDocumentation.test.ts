import * as ts from 'typescript';
import { describe, expect, it } from 'vitest';
import type { XTypeScriptProject } from '../createXTypeScriptProjects';
import {
  getAvailability,
  getDocumentedType,
  stringifyProperty,
} from './buildInterfacesDocumentation';

function createProject(source: string) {
  const fileName = '/test.ts';
  const options: ts.CompilerOptions = { strict: true, noLib: true };
  const host = ts.createCompilerHost(options);
  host.getSourceFile = (name, languageVersion) =>
    name === fileName ? ts.createSourceFile(name, source, languageVersion, true) : undefined;
  const program = ts.createProgram([fileName], options, host);
  const checker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(fileName);
  const moduleSymbol = sourceFile && checker.getSymbolAtLocation(sourceFile);
  const exports = moduleSymbol ? checker.getExportsOfModule(moduleSymbol) : [];
  const project = { checker } as XTypeScriptProject;

  const getSymbol = (name: string) => {
    const symbol = exports.find((exported) => exported.name === name);
    if (!symbol) {
      throw new Error(`Missing export ${name}`);
    }
    return symbol;
  };

  return {
    project,
    getSymbol,
    getType: (name: string) => getDocumentedType(getSymbol(name), project),
  };
}

describe('buildInterfacesDocumentation', () => {
  describe('existing behavior', () => {
    it('documents an interface as declared', () => {
      const { getType } = createProject(`
        export interface Props { label: string; size?: number }
      `);
      const type = getType('Props');

      expect(type.isUnion()).to.equal(false);
      expect(type.getProperties().map((property) => property.name)).to.deep.equal([
        'label',
        'size',
      ]);
    });

    it('keeps the source text of a property with a single declaration', async () => {
      const { project, getType } = createProject(`
        export interface Props {
          size?: 'small' | 'medium';
          format?: (value: number) => string;
        }
      `);
      const type = getType('Props');
      const stringify = (name: string) => {
        const property = type.getProperty(name);
        return property ? stringifyProperty([property], project) : undefined;
      };

      expect(await stringify('size')).to.equal("'small' | 'medium'");
      expect(await stringify('format')).to.equal('(value: number) => string');
    });

    it('does not expand type parameters without a union constraint', () => {
      const { getType } = createProject(`
        export type Box<T extends string> = { value: T };
      `);

      expect(getType('Box').isUnion()).to.equal(false);
    });

    it('does not describe availability for a property shared by every member', () => {
      const { project, getType } = createProject(`
        export type Shared = { kind: 'a'; label: string } | { kind: 'b'; label: string };
      `);

      expect(getAvailability('label', getType('Shared'), project)).to.equal('');
    });
  });

  it('keeps null and boolean when merging property declarations', async () => {
    const { project, getType } = createProject(`
      interface A { flag?: boolean | null; size?: 'auto' | null }
      interface B { flag?: boolean | null; size?: 'auto' | null }
      export type Union = A | B;
    `);
    const type = getType('Union');
    const stringify = (name: string) => {
      const property = type.getProperty(name);
      return property ? stringifyProperty([property], project) : undefined;
    };

    expect(await stringify('flag')).to.equal('boolean | null');
    expect(await stringify('size')).to.equal("'auto' | null");
  });

  it('expands union type parameters and describes member-specific properties', () => {
    const { project, getType } = createProject(`
      export type Config<K extends 'a' | 'b' = 'a' | 'b'> = { kind: K } & (K extends 'a' ? { onlyA?: number } : {});
    `);

    expect(getAvailability('onlyA', getType('Config'), project)).to.equal(
      "Only applies to `kind: 'a'`.",
    );
  });

  it('only describes availability when it is exact', () => {
    const { project, getType } = createProject(`
      export type Exact =
        | { kind: 'a'; side: 'x'; only?: number }
        | { kind: 'a'; side: 'y' }
        | { kind: 'b'; side: 'x' }
        | { kind: 'b'; side: 'y' };
      export type Mixed =
        | { kind: 'a'; side: 'x'; only?: number }
        | { kind: 'a'; side: 'y' }
        | { kind: 'b'; side: 'x' }
        | { kind: 'b'; side: 'y'; only?: number }
        | { kind: 'c'; side: 'x' };
    `);

    expect(getAvailability('only', getType('Exact'), project)).to.equal(
      "Only applies to `kind: 'a'` and `side: 'x'`.",
    );
    expect(getAvailability('only', getType('Mixed'), project)).to.equal('');
  });

  it('throws when the expansion is too large', () => {
    const letters = 'abcdefghijk'.split('');
    const union = (prefix: string) => letters.map((letter) => `'${prefix}${letter}'`).join(' | ');
    const { getType } = createProject(`
      export type Big<A extends ${union('a')}, B extends ${union('b')}> = { a: A; b: B };
    `);

    expect(() => getType('Big')).to.throw('gives 121 members, above the limit of 100');
  });
});
