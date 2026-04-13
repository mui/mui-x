/**
 * Factory wrappers around `@mui/internal-docs-infra/abstractCreateTypes` — bind mui-x's
 * own reference-table UI to the shared docs-infra pipeline.
 *
 * Consumers (per-component `types.ts` files colocated with doc pages) call
 * `createMultipleTypes(import.meta.url, { Component })`. At build time the webpack loader
 * `@mui/internal-docs-infra/pipeline/loadPrecomputedTypes` rewrites that call with a
 * precomputed `meta` argument describing the component's resolved types.
 */
import * as React from 'react';
import {
  createTypesFactory,
  createMultipleTypesFactory,
} from '@mui/internal-docs-infra/abstractCreateTypes';
import { ReferenceTable } from './ReferenceTable';

function TypePre(props: { children: React.ReactNode }) {
  return <pre className="MuiApiPage-typePre">{props.children}</pre>;
}

function InlineCode(props: { children?: React.ReactNode; className?: string }) {
  return <code className={props.className}>{props.children}</code>;
}

const factoryOptions = {
  TypesTable: ReferenceTable,
  TypePre,
  ShortTypeCode: InlineCode,
  DefaultCode: InlineCode,
};

export const createTypes = createTypesFactory(factoryOptions);
export const createMultipleTypes = createMultipleTypesFactory(factoryOptions);
