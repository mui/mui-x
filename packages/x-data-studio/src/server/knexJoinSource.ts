import type { GridColDef } from '@mui/x-data-grid';
import type { Knex } from 'knex';
import type { DataStudioGetRowsParams, DataStudioJoinDefinition } from '../models';
import { DataStudioServerError } from './errors';
import { getKnexClientName, getKnexDataStudioRows } from './knexDataSourceRows';
import { DATA_STUDIO_SYNTHETIC_ID_FIELD } from './synthesis';

/** Alias of the JOIN subquery that the rows engine treats as a flat table. */
const JOINT_SUBQUERY_ALIAS = 'data_studio_joint';

/** Output aliases starting with this prefix are reserved for engine internals. */
const RESERVED_ALIAS_PREFIX = '__dataStudio';

/** Supported join types. `full` is `FULL OUTER JOIN`. */
const JOIN_TYPES = new Set(['inner', 'left', 'right', 'full']);

/**
 * Everything the base (fact) source needs to self-handle a `params.join`: its own
 * knex connection (which must also contain the joined tables), its id/table, the
 * rowIdField used to seed the synthetic composite id, and a resolver mapping a
 * referenced sourceId to a physical table on the same connection.
 */
export interface KnexJoinContext {
  knex: Knex;
  baseSourceId: string;
  baseTable: string;
  baseRowIdField?: string;
  resolveTable: (sourceId: string) => string;
}

interface ResolvedParticipant {
  sourceId: string;
  table: string;
  fields: Set<string>;
}

/** `"table"."field"`, dialect-correctly quoted via knex. */
function qualified(knex: Knex, table: string, field: string): string {
  return knex.raw('??.??', [table, field]).toString();
}

/** `"field"`, dialect-correctly quoted via knex. */
function quoteIdentifier(knex: Knex, field: string): string {
  return knex.raw('??', [field]).toString();
}

async function introspectFields(
  knex: Knex,
  table: string,
  sourceId: string,
): Promise<Set<string>> {
  let info: Record<string, unknown> = {};
  try {
    info = await knex(table).columnInfo();
  } catch {
    info = {};
  }
  const fields = Object.keys(info);
  if (fields.length === 0) {
    throw new DataStudioServerError(
      `MUI X Data Studio: The joined data source "${sourceId}" does not resolve to a readable table on the base source's connection.
This prevents the server from building the JOIN, because joined sources must live on the same backend as the base source.
Only join data sources that share the base source's database connection.`,
      400,
    );
  }
  return new Set(fields);
}

function assertField(
  participant: ResolvedParticipant,
  field: string,
  role: 'left key' | 'right key' | 'column',
) {
  if (!participant.fields.has(field)) {
    throw new DataStudioServerError(
      `MUI X Data Studio: The join ${role} "${field}" is not a column of data source "${participant.sourceId}".
This prevents the server from building a valid JOIN and guards against referencing unknown columns.
Only reference fields returned by the data source's schema.`,
      400,
    );
  }
}

/**
 * Synthetic composite id = base rowId + every join key on the dimension side.
 * For the many-to-one (fact → dimensions) joins this targets, that tuple is
 * unique per flattened row. Each part is cast to text and coalesced so an
 * unmatched left-join key (`NULL`) still yields a stable, distinct id.
 */
function buildSyntheticIdSql(
  knex: Knex,
  participants: Map<string, ResolvedParticipant>,
  def: DataStudioJoinDefinition,
  baseRowIdField: string,
): string {
  const base = participants.get(def.base)!;
  const parts = [qualified(knex, base.table, baseRowIdField)];
  def.joins.forEach((clause) => {
    const joined = participants.get(clause.sourceId)!;
    clause.on.forEach((pair) => {
      parts.push(qualified(knex, joined.table, pair.rightField));
    });
  });

  const isMysql = getKnexClientName(knex).includes('mysql');
  const castType = isMysql ? 'char' : 'text';
  const safeParts = parts.map((part) => `coalesce(cast(${part} as ${castType}), '')`);

  return isMysql ? `concat_ws('|', ${safeParts.join(', ')})` : safeParts.join(" || '|' || ");
}

/**
 * Builds the JOIN as a derived table with flat, aliased output columns. Returned
 * as a factory (a fresh builder per call) because the rows engine clones+mutates
 * the base query repeatedly. Every identifier is quoted via knex (`??`); table
 * names come from the server-resolved participant map — never the raw request.
 */
function buildJoinQueryFactory(
  knex: Knex,
  participants: Map<string, ResolvedParticipant>,
  def: DataStudioJoinDefinition,
  baseRowIdField: string,
): () => Knex.QueryBuilder {
  return () => {
    const base = participants.get(def.base)!;
    let inner = knex(base.table);

    def.joins.forEach((clause) => {
      const joined = participants.get(clause.sourceId)!;
      const onClause = function applyOn(this: Knex.JoinClause) {
        clause.on.forEach((pair, index) => {
          const left = `${base.table}.${pair.leftField}`;
          const right = `${joined.table}.${pair.rightField}`;
          if (index === 0) {
            this.on(left, '=', right);
          } else {
            this.andOn(left, '=', right);
          }
        });
      };
      switch (clause.type) {
        case 'left':
          inner = inner.leftJoin(joined.table, onClause);
          break;
        case 'right':
          inner = inner.rightJoin(joined.table, onClause);
          break;
        case 'full':
          inner = inner.fullOuterJoin(joined.table, onClause);
          break;
        default:
          inner = inner.innerJoin(joined.table, onClause);
      }
    });

    const selectMap: Record<string, string> = {};
    def.columns.forEach((column) => {
      const participant = participants.get(column.sourceId)!;
      selectMap[column.as] = `${participant.table}.${column.field}`;
    });
    inner = inner.select(selectMap);
    inner = inner.select(
      knex.raw(
        `${buildSyntheticIdSql(knex, participants, def, baseRowIdField)} as ${quoteIdentifier(
          knex,
          DATA_STUDIO_SYNTHETIC_ID_FIELD,
        )}`,
      ),
    );

    return knex.queryBuilder().from(inner.as(JOINT_SUBQUERY_ALIAS));
  };
}

/**
 * Resolves and executes a joint-source rows request. The base source self-handles
 * `params.join`: it validates the (untrusted) client definition against the
 * tables reachable on its own connection, builds a derived-table JOIN, and feeds
 * it through the standard rows engine so all filtering/grouping/aggregation/
 * binning/pivoting work unchanged over the joined result. Read-only.
 */
export async function getKnexJoinRows(
  context: KnexJoinContext,
  params: DataStudioGetRowsParams,
) {
  const def = params.join;
  if (!def) {
    throw /* minify-error-disabled */ new Error('MUI X: getKnexJoinRows requires params.join.');
  }

  if (def.base !== context.baseSourceId) {
    throw new DataStudioServerError(
      `MUI X Data Studio: The join base "${def.base}" does not match the data source "${context.baseSourceId}" the rows request was sent to.
This prevents the server from joining against the wrong table.
Send the joint-source rows request to its base data source.`,
      400,
    );
  }
  if (!context.baseRowIdField) {
    throw new DataStudioServerError(
      `MUI X Data Studio: The join base "${context.baseSourceId}" has no rowIdField.
This prevents the server from giving each joined row a stable identifier, so the grid cannot track joined rows.
Configure a rowIdField on the base data source before joining it.`,
      400,
    );
  }

  // Resolve every participant (base + joined) to a table on the base connection.
  const participants = new Map<string, ResolvedParticipant>();
  const registerParticipant = async (sourceId: string) => {
    if (participants.has(sourceId)) {
      return;
    }
    const table =
      sourceId === context.baseSourceId ? context.baseTable : context.resolveTable(sourceId);
    participants.set(sourceId, {
      sourceId,
      table,
      fields: await introspectFields(context.knex, table, sourceId),
    });
  };

  await registerParticipant(context.baseSourceId);
  for (const clause of def.joins) {
    if (!JOIN_TYPES.has(clause.type)) {
      throw new DataStudioServerError(
        `MUI X Data Studio: Unsupported join type "${clause.type}" for data source "${clause.sourceId}".
This prevents the server from running an undefined join.
Use "inner", "left", "right", or "full".`,
        400,
      );
    }
    if (!clause.on || clause.on.length === 0) {
      throw new DataStudioServerError(
        `MUI X Data Studio: The join onto data source "${clause.sourceId}" has no key pairs.
This prevents the server from building the JOIN condition, which would cross-join every row.
Provide at least one { leftField, rightField } key pair.`,
        400,
      );
    }
    // eslint-disable-next-line no-await-in-loop
    await registerParticipant(clause.sourceId);
  }

  // Validate the join keys against the resolved schemas.
  const base = participants.get(context.baseSourceId)!;
  def.joins.forEach((clause) => {
    const joined = participants.get(clause.sourceId)!;
    clause.on.forEach((pair) => {
      assertField(base, pair.leftField, 'left key');
      assertField(joined, pair.rightField, 'right key');
    });
  });

  // Validate the output columns + aliases.
  if (def.columns.length === 0) {
    throw new DataStudioServerError(
      `MUI X Data Studio: The joint source for base "${context.baseSourceId}" selects no columns.
This prevents the server from projecting any output for the joined rows.
Select at least one output column.`,
      400,
    );
  }
  const seenAliases = new Set<string>();
  def.columns.forEach((column) => {
    const participant = participants.get(column.sourceId);
    if (!participant) {
      throw new DataStudioServerError(
        `MUI X Data Studio: The output column "${column.field}" references data source "${column.sourceId}", which is not part of the join.
This prevents the server from resolving the column.
Only select columns from the base source or a joined source.`,
        400,
      );
    }
    assertField(participant, column.field, 'column');
    if (column.as.startsWith(RESERVED_ALIAS_PREFIX)) {
      throw new DataStudioServerError(
        `MUI X Data Studio: The output alias "${column.as}" is reserved.
This prevents collisions with the engine's internal group/aggregate/id fields.
Choose an alias that does not start with "${RESERVED_ALIAS_PREFIX}".`,
        400,
      );
    }
    if (seenAliases.has(column.as)) {
      throw new DataStudioServerError(
        `MUI X Data Studio: Duplicate output alias "${column.as}" in the joint source.
This prevents the server from producing a flat, unambiguous column set.
Give every output column a unique "as" alias.`,
        400,
      );
    }
    seenAliases.add(column.as);
  });

  const joinColumns: GridColDef[] = def.columns.map((column) => ({ field: column.as }));
  const from = buildJoinQueryFactory(context.knex, participants, def, context.baseRowIdField);

  return getKnexDataStudioRows(
    { knex: context.knex, from },
    params,
    joinColumns,
    DATA_STUDIO_SYNTHETIC_ID_FIELD,
  );
}
