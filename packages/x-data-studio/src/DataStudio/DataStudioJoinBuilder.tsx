'use client';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import type { GridColDef } from '@mui/x-data-grid';
import type {
  DataStudioJoinColumn,
  DataStudioJoinDefinition,
  DataStudioJoinType,
} from '../models';
import type { DataStudioDataSource, DataStudioJointSourceConfig } from './DataStudio.types';

export interface DataStudioJoinBuilderSubmit {
  /** Present when editing an existing joint source. */
  id?: string;
  label: string;
  definition: DataStudioJoinDefinition;
}

export interface DataStudioJoinBuilderProps {
  open: boolean;
  onClose: () => void;
  dataSources: DataStudioDataSource[];
  /** When set, the dialog edits this joint source instead of creating a new one. */
  initialConfig?: DataStudioJointSourceConfig | null;
  onSubmit: (input: DataStudioJoinBuilderSubmit) => void;
}

interface DraftJoin {
  sourceId: string;
  type: DataStudioJoinType;
  leftField: string;
  rightField: string;
}

const COLUMN_KEY_SEPARATOR = ':::';
const columnKey = (sourceId: string, field: string) => `${sourceId}${COLUMN_KEY_SEPARATOR}${field}`;

function getFieldNames(source: DataStudioDataSource | undefined): string[] {
  return (source?.columns ?? []).map((column: GridColDef) => column.field);
}

/** Whether a joined key is likely unique (a key/PK), so the join stays many-to-one. */
function isKeyLikeField(source: DataStudioDataSource | undefined, field: string): boolean {
  return field === source?.rowIdField || field === 'id' || /_(key|id)$/i.test(field);
}

/** Suggests a { leftField, rightField } key pair for a base ⋈ partner join. */
function suggestKeys(
  base: DataStudioDataSource | undefined,
  partner: DataStudioDataSource | undefined,
): { leftField: string; rightField: string } {
  const baseFields = getFieldNames(base);
  const partnerFields = getFieldNames(partner);
  const partnerKey = partner?.rowIdField ?? (partnerFields.includes('id') ? 'id' : partnerFields[0]);

  const shared = baseFields.find((field) => partnerFields.includes(field) && field !== 'id');
  if (shared) {
    return { leftField: shared, rightField: shared };
  }
  const partnerId = partner?.id ?? '';
  const named = baseFields.find((field) =>
    [`${partnerId}_key`, `${partnerId}_id`, `${partnerId}id`, `${partnerId}Id`].includes(field),
  );
  if (named && partnerKey) {
    return { leftField: named, rightField: partnerKey };
  }
  return { leftField: baseFields[0] ?? '', rightField: partnerKey ?? partnerFields[0] ?? '' };
}

/**
 * Builds the output columns from the participants minus the user's deselections,
 * aliasing a field to its bare name when unique across the selection, else
 * prefixing with the source id.
 */
function buildColumns(
  sourcesById: Map<string, DataStudioDataSource>,
  participantIds: string[],
  deselected: Set<string>,
): DataStudioJoinColumn[] {
  const chosen: { sourceId: string; field: string }[] = [];
  participantIds.forEach((sourceId) => {
    getFieldNames(sourcesById.get(sourceId)).forEach((field) => {
      if (!deselected.has(columnKey(sourceId, field))) {
        chosen.push({ sourceId, field });
      }
    });
  });

  const counts = new Map<string, number>();
  chosen.forEach(({ field }) => counts.set(field, (counts.get(field) ?? 0) + 1));

  return chosen.map(({ sourceId, field }) => ({
    sourceId,
    field,
    as: (counts.get(field) ?? 0) > 1 ? `${sourceId}_${field}` : field,
  }));
}

/**
 * Visual builder for a joint source. The user picks a base (fact) source, adds
 * joins to other sources in the same join group (keys auto-suggested), and picks
 * which columns the joint source exposes. Produces a declarative
 * `DataStudioJoinDefinition`. Also edits an existing joint source via
 * `initialConfig`. No joint source is ever defined in code.
 * @param {DataStudioJoinBuilderProps} props The builder props.
 * @returns {React.JSX.Element} The dialog.
 */
export function DataStudioJoinBuilder(props: DataStudioJoinBuilderProps): React.JSX.Element {
  const { open, onClose, dataSources, initialConfig, onSubmit } = props;

  const sourcesById = React.useMemo(
    () => new Map(dataSources.map((source) => [source.id, source])),
    [dataSources],
  );
  const joinableSources = React.useMemo(
    () => dataSources.filter((source) => Boolean(source.connector)),
    [dataSources],
  );

  const [name, setName] = React.useState('');
  const [baseId, setBaseId] = React.useState('');
  const [joins, setJoins] = React.useState<DraftJoin[]>([]);
  // Track columns the user turned OFF; everything else (including newly added
  // participants) is included by default.
  const [deselected, setDeselected] = React.useState<Set<string>>(new Set());

  // Initialise the form when the dialog opens (new or edit).
  React.useEffect(() => {
    if (!open) {
      return;
    }
    if (initialConfig) {
      const { definition } = initialConfig;
      setName(initialConfig.label);
      setBaseId(definition.base);
      setJoins(
        definition.joins.map((join) => ({
          sourceId: join.sourceId,
          type: join.type,
          leftField: join.on[0]?.leftField ?? '',
          rightField: join.on[0]?.rightField ?? '',
        })),
      );
      const included = new Set(definition.columns.map((column) => columnKey(column.sourceId, column.field)));
      const participantIds = [definition.base, ...definition.joins.map((join) => join.sourceId)];
      const off = new Set<string>();
      participantIds.forEach((sourceId) => {
        getFieldNames(sourcesById.get(sourceId)).forEach((field) => {
          const key = columnKey(sourceId, field);
          if (!included.has(key)) {
            off.add(key);
          }
        });
      });
      setDeselected(off);
      return;
    }
    setName('');
    setBaseId(joinableSources[0]?.id ?? '');
    setJoins([]);
    setDeselected(new Set());
  }, [open, initialConfig, joinableSources, sourcesById]);

  const base = sourcesById.get(baseId);
  const partnerOptions = React.useMemo(
    () =>
      joinableSources.filter(
        (source) =>
          source.id !== baseId &&
          (base?.joinGroup == null || source.joinGroup === base.joinGroup) &&
          !joins.some((join) => join.sourceId === source.id),
      ),
    [joinableSources, baseId, base, joins],
  );

  const participantIds = React.useMemo(
    () => [baseId, ...joins.map((join) => join.sourceId)].filter(Boolean),
    [baseId, joins],
  );

  const addJoin = React.useCallback(() => {
    const partner = joinableSources.find(
      (source) =>
        source.id !== baseId &&
        (base?.joinGroup == null || source.joinGroup === base.joinGroup) &&
        !joins.some((join) => join.sourceId === source.id),
    );
    if (!partner) {
      return;
    }
    setJoins((prev) => [...prev, { sourceId: partner.id, type: 'left', ...suggestKeys(base, partner) }]);
  }, [joinableSources, baseId, base, joins]);

  const updateJoin = React.useCallback((index: number, patch: Partial<DraftJoin>) => {
    setJoins((prev) => prev.map((join, i) => (i === index ? { ...join, ...patch } : join)));
  }, []);

  const removeJoin = React.useCallback((index: number) => {
    setJoins((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const toggleColumn = React.useCallback((sourceId: string, field: string) => {
    const key = columnKey(sourceId, field);
    setDeselected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const selectedColumnCount = participantIds.reduce(
    (total, sourceId) =>
      total +
      getFieldNames(sourcesById.get(sourceId)).filter(
        (field) => !deselected.has(columnKey(sourceId, field)),
      ).length,
    0,
  );

  const canSubmit =
    name.trim().length > 0 &&
    baseId.length > 0 &&
    joins.length > 0 &&
    joins.every((join) => join.sourceId && join.leftField && join.rightField) &&
    selectedColumnCount > 0;

  const handleSubmit = React.useCallback(() => {
    if (!canSubmit) {
      return;
    }
    const definition: DataStudioJoinDefinition = {
      base: baseId,
      joins: joins.map((join) => ({
        sourceId: join.sourceId,
        type: join.type,
        on: [{ leftField: join.leftField, rightField: join.rightField }],
      })),
      columns: buildColumns(sourcesById, participantIds, deselected),
    };
    onSubmit({ id: initialConfig?.id, label: name.trim(), definition });
    onClose();
  }, [canSubmit, baseId, joins, sourcesById, participantIds, deselected, name, initialConfig, onSubmit, onClose]);

  const baseFields = getFieldNames(base);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialConfig ? 'Edit joint source' : 'New joint source'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Sales enriched"
            fullWidth
            autoFocus
            size="small"
          />

          <TextField
            select
            label="Base source"
            value={baseId}
            onChange={(event) => {
              setBaseId(event.target.value);
              setJoins([]);
              setDeselected(new Set());
            }}
            fullWidth
            size="small"
            helperText="The fact table the others are joined onto."
          >
            {joinableSources.map((source) => (
              <MenuItem key={source.id} value={source.id}>
                {String(source.label ?? source.id)}
              </MenuItem>
            ))}
          </TextField>

          <div>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Joins
            </Typography>
            <Stack spacing={2}>
              {joins.map((join, index) => {
                const partner = sourcesById.get(join.sourceId);
                const partnerFields = getFieldNames(partner);
                const fanOutRisk = Boolean(join.rightField) && !isKeyLikeField(partner, join.rightField);
                return (
                  <Box
                    key={index}
                    sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1.5 }}
                  >
                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                      <TextField
                        select
                        label="Join"
                        value={join.sourceId}
                        onChange={(event) => {
                          const nextPartner = sourcesById.get(event.target.value);
                          updateJoin(index, {
                            sourceId: event.target.value,
                            ...suggestKeys(base, nextPartner),
                          });
                        }}
                        size="small"
                        sx={{ flex: 1 }}
                      >
                        {[partner, ...partnerOptions]
                          .filter((source): source is DataStudioDataSource => Boolean(source))
                          .map((source) => (
                            <MenuItem key={source.id} value={source.id}>
                              {String(source.label ?? source.id)}
                            </MenuItem>
                          ))}
                      </TextField>
                      <TextField
                        select
                        label="Type"
                        value={join.type}
                        onChange={(event) =>
                          updateJoin(index, { type: event.target.value as DataStudioJoinType })
                        }
                        size="small"
                        sx={{ width: 110 }}
                      >
                        <MenuItem value="left">Left</MenuItem>
                        <MenuItem value="inner">Inner</MenuItem>
                        <MenuItem value="right">Right</MenuItem>
                        <MenuItem value="full">Full</MenuItem>
                      </TextField>
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      <TextField
                        select
                        label="Base key"
                        value={join.leftField}
                        onChange={(event) => updateJoin(index, { leftField: event.target.value })}
                        size="small"
                        sx={{ flex: 1 }}
                      >
                        {baseFields.map((field) => (
                          <MenuItem key={field} value={field}>
                            {field}
                          </MenuItem>
                        ))}
                      </TextField>
                      <Typography variant="body2" color="text.secondary">
                        =
                      </Typography>
                      <TextField
                        select
                        label="Joined key"
                        value={join.rightField}
                        onChange={(event) => updateJoin(index, { rightField: event.target.value })}
                        size="small"
                        sx={{ flex: 1 }}
                      >
                        {partnerFields.map((field) => (
                          <MenuItem key={field} value={field}>
                            {field}
                          </MenuItem>
                        ))}
                      </TextField>
                      <Button size="small" color="inherit" onClick={() => removeJoin(index)}>
                        Remove
                      </Button>
                    </Stack>
                    {fanOutRisk ? (
                      <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'warning.main' }}>
                        Joining on a non-key column ({join.rightField}) may match multiple rows per base
                        row and inflate sum/count aggregations. Join on a unique key when possible.
                      </Typography>
                    ) : null}
                  </Box>
                );
              })}
              <Button
                size="small"
                variant="outlined"
                onClick={addJoin}
                disabled={partnerOptions.length === 0}
                sx={{ alignSelf: 'flex-start' }}
              >
                Add join
              </Button>
            </Stack>
          </div>

          {participantIds.length > 0 ? (
            <div>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Columns ({selectedColumnCount} selected)
              </Typography>
              <Box
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 1.5,
                  maxHeight: 220,
                  overflow: 'auto',
                }}
              >
                <Stack spacing={1.5}>
                  {participantIds.map((sourceId) => {
                    const source = sourcesById.get(sourceId);
                    const fields = getFieldNames(source);
                    if (fields.length === 0) {
                      return null;
                    }
                    return (
                      <div key={sourceId}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          {String(source?.label ?? sourceId)}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 1.5 }}>
                          {fields.map((field) => (
                            <FormControlLabel
                              key={field}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={!deselected.has(columnKey(sourceId, field))}
                                  onChange={() => toggleColumn(sourceId, field)}
                                />
                              }
                              label={<Typography variant="body2">{field}</Typography>}
                            />
                          ))}
                        </Box>
                      </div>
                    );
                  })}
                </Stack>
              </Box>
            </div>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!canSubmit}>
          {initialConfig ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
