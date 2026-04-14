/**
 * Minimal API reference table used by the new `@mui/internal-docs-infra` types pipeline.
 *
 * The factory in `createTypes.tsx` pre-renders every HAST field on the metadata into
 * a React node — render directly, no HAST conversion here.
 */
import * as React from 'react';
import type { TypesTableProps } from '@mui/internal-docs-infra/useTypes';
import typesRegistry from './typesRegistry.json';
import { useAllowedProps } from './TypesPageShell';

const registry = typesRegistry as Record<string, string>;

export function ReferenceTable(props: TypesTableProps<{}>) {
  const { type, additionalTypes } = props;
  const allowedProps = useAllowedProps();

  const inlineAdditional: any[] = [];
  const linkedAdditional: Array<{ name: string; href: string }> = [];

  for (const meta of additionalTypes ?? []) {
    const anyMeta = meta as any;
    const href = registry[anyMeta.name];
    if (href) {
      linkedAdditional.push({ name: anyMeta.name, href });
    } else if (hasContent(anyMeta)) {
      inlineAdditional.push(anyMeta);
    }
  }

  return (
    <div>
      {type ? (
        <TypeBlock meta={type as any} headingLevel={2} allowedProps={allowedProps} />
      ) : null}

      {linkedAdditional.length > 0 ? (
        <p>
          <strong>Related:</strong>{' '}
          {linkedAdditional.map((item, i) => (
            <React.Fragment key={item.name}>
              {i > 0 ? ', ' : null}
              <a href={item.href}>
                <code>{item.name}</code>
              </a>
            </React.Fragment>
          ))}
        </p>
      ) : null}

      {inlineAdditional.length > 0 ? (
        <React.Fragment>
          <h2>Additional types</h2>
          {inlineAdditional.map((meta, i) => (
            <TypeBlock key={meta.name ?? i} meta={meta} headingLevel={3} />
          ))}
        </React.Fragment>
      ) : null}
    </div>
  );
}

function hasContent(meta: any): boolean {
  const kind = meta?.type;
  const data = meta?.data ?? {};
  if (kind === 'component') {
    return Object.keys(data.props ?? {}).length > 0;
  }
  if (kind === 'hook' || kind === 'function') {
    return (
      Object.keys(data.expandedProperties ?? {}).length > 0 ||
      (Array.isArray(data.parameters) && data.parameters.length > 0) ||
      !!data.returnValue
    );
  }
  if (kind === 'class') {
    return Object.keys(data.properties ?? {}).length > 0;
  }
  if (kind === 'raw') {
    return (
      Object.keys(data.properties ?? {}).length > 0 ||
      (Array.isArray(data.enumMembers) && data.enumMembers.length > 0)
    );
  }
  return false;
}

function TypeBlock({
  meta,
  headingLevel,
  allowedProps,
}: {
  meta: any;
  headingLevel: 2 | 3;
  allowedProps?: ReadonlySet<string> | null;
}) {
  const Heading = (headingLevel === 2 ? 'h2' : 'h3') as 'h2' | 'h3';
  const kind: string | undefined = meta?.type;
  const data = meta?.data ?? {};
  const name: string = meta?.name ?? data?.name ?? '';

  return (
    <section className="MuiApiPage-typeBlock">
      <Heading>{name}</Heading>
      {data.description ? (
        <div className="MuiApiPage-description">{data.description}</div>
      ) : null}

      {kind === 'component' ? (
        <PropsTable properties={data.props ?? {}} allowedProps={allowedProps} />
      ) : null}

      {kind === 'hook' || kind === 'function' ? (
        <React.Fragment>
          {data.expandedProperties ? (
            <PropsTable properties={data.expandedProperties} />
          ) : null}
          {Array.isArray(data.parameters) && data.parameters.length > 0 ? (
            <ParametersTable parameters={data.parameters} />
          ) : null}
          {data.returnValue ? <ReturnValueBlock value={data.returnValue} /> : null}
        </React.Fragment>
      ) : null}

      {kind === 'class' ? <PropsTable properties={data.properties ?? {}} /> : null}

      {kind === 'raw' ? (
        <React.Fragment>
          {data.properties ? <PropsTable properties={data.properties} /> : null}
          {Array.isArray(data.enumMembers) && data.enumMembers.length > 0 ? (
            <EnumTable members={data.enumMembers} />
          ) : null}
        </React.Fragment>
      ) : null}
    </section>
  );
}

function PropsTable({
  properties,
  allowedProps,
}: {
  properties: Record<string, any>;
  allowedProps?: ReadonlySet<string> | null;
}) {
  let names = Object.keys(properties ?? {}).sort();
  if (allowedProps) {
    names = names.filter((n) => allowedProps.has(n));
  }
  if (names.length === 0) {
    return null;
  }
  return (
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
        {names.map((propName) => {
          const p = properties[propName] ?? {};
          return (
            <tr key={propName}>
              <td>
                <code>
                  {propName}
                  {p.optional === false ? '*' : ''}
                </code>
              </td>
              <td>{p.shortType ?? p.type ?? null}</td>
              <td>{p.default ?? '-'}</td>
              <td>{p.description ?? null}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function ParametersTable({ parameters }: { parameters: any[] }) {
  return (
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
        {parameters.map((p, i) => (
          <tr key={p.name ?? i}>
            <td>
              <code>
                {p.name}
                {p.optional === false ? '*' : ''}
              </code>
            </td>
            <td>{p.shortType ?? p.type ?? null}</td>
            <td>{p.default ?? '-'}</td>
            <td>{p.description ?? null}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ReturnValueBlock({ value }: { value: any }) {
  if (!value) {
    return null;
  }
  if (value.kind === 'simple') {
    return (
      <div>
        <strong>Returns:</strong> {value.type}
        {value.description ? <React.Fragment> — {value.description}</React.Fragment> : null}
      </div>
    );
  }
  if (value.kind === 'object') {
    return <PropsTable properties={value.properties ?? {}} />;
  }
  return null;
}

function EnumTable({ members }: { members: any[] }) {
  return (
    <table className="MuiApiPage-propsTable">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {members.map((m, i) => (
          <tr key={m.name ?? i}>
            <td>
              <code>{m.name}</code>
            </td>
            <td>{m.type ?? null}</td>
            <td>{m.description ?? null}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
