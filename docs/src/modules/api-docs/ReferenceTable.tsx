/**
 * Minimal API reference table used by the new `@mui/internal-docs-infra` types pipeline.
 *
 * This is a POC implementation. It consumes the enhanced type metadata emitted by the
 * loader (`loadPrecomputedTypes`) and renders a simple `<table>` of props.
 *
 * Real version should reuse the existing ApiPage styling / section layout, but for the
 * spike we only need the prop table to render.
 */
import * as React from 'react';
import type { TypesTableProps } from '@mui/internal-docs-infra/useTypes';

export function ReferenceTable(props: TypesTableProps<{}>) {
  const { type, additionalTypes } = props;

  if (!type) {
    if (additionalTypes && additionalTypes.length > 0) {
      return (
        <div>
          {additionalTypes.map((meta, i) => (
            <AdditionalTypeBlock key={(meta as any).name ?? i} meta={meta} />
          ))}
        </div>
      );
    }
    return null;
  }

  // type is a wrapper of shape { type, name, data, slug }. The real metadata lives
  // in `type.data` (shape depends on `type.type` — 'component', 'hook', 'function', ...).
  const componentMeta = (type as any).data ?? (type as any);
  const propsMap: Record<string, any> = componentMeta.props ?? {};
  const propNames = Object.keys(propsMap).sort();

  return (
    <div>
      {componentMeta.description ? <div className="MuiApiPage-description">{componentMeta.description}</div> : null}
      {propNames.length > 0 ? (
        <table className="MuiApiPage-propsTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {propNames.map((name) => {
              const p = propsMap[name];
              return (
                <tr key={name}>
                  <td><code>{name}{p.optional === false ? '*' : ''}</code></td>
                  <td>{p.shortType ?? p.type}</td>
                  <td>{p.default ?? '-'}</td>
                  <td>{p.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p><em>No props detected.</em></p>
      )}
      {additionalTypes && additionalTypes.length > 0 ? (
        <div>
          <h3>Additional types</h3>
          {additionalTypes.map((meta, i) => (
            <AdditionalTypeBlock key={(meta as any).name ?? i} meta={meta} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function AdditionalTypeBlock({ meta }: { meta: any }) {
  return (
    <div className="MuiApiPage-additionalType">
      <h4>{meta.name}</h4>
      {meta.type ? <pre>{meta.type}</pre> : null}
      {meta.description ? <div>{meta.description}</div> : null}
    </div>
  );
}
