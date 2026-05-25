import { describe, expect, it } from 'vitest';
import { nestedToFlat } from '@json-render/core';
import { normalizeSpec, diagnoseSpec } from './CopilotPdfReportCard';
import type { PdfReportSpec } from './spec';

describe('normalizeSpec', () => {
  it('adds missing `props: {}` so json-render does not throw on Object.entries(undefined)', () => {
    const spec = {
      root: 'page',
      elements: {
        page: { type: 'Page', children: [] },
      },
    } as unknown as PdfReportSpec;

    const { spec: normalized, migrations } = normalizeSpec(spec);

    expect(normalized.elements.page.props).to.deep.equal({});
    expect(migrations).to.have.lengthOf(1);
    expect(migrations[0]).to.match(/element "page" \(Page\): added missing `props: \{\}`/);
  });

  it('migrates Text.content → Text.text (legacy AI mistake)', () => {
    const spec: PdfReportSpec = {
      root: 'doc',
      elements: {
        doc: { type: 'Text', props: { content: 'Hello' }, children: [] },
      },
    };

    const { spec: normalized, migrations } = normalizeSpec(spec);

    expect(normalized.elements.doc.props).to.deep.equal({ text: 'Hello' });
    expect(migrations[0]).to.match(/migrated `content` → `text`/);
  });

  it('migrates Heading.content → Heading.text', () => {
    const spec: PdfReportSpec = {
      root: 'h',
      elements: {
        h: { type: 'Heading', props: { content: 'Title', level: 'h1' }, children: [] },
      },
    };

    const { spec: normalized } = normalizeSpec(spec);

    expect(normalized.elements.h.props).to.deep.equal({ text: 'Title', level: 'h1' });
  });

  it('drops Text.content silently when both content and text are set (text wins)', () => {
    const spec: PdfReportSpec = {
      root: 'doc',
      elements: {
        doc: { type: 'Text', props: { content: 'Old', text: 'New' }, children: [] },
      },
    };

    const { spec: normalized, migrations } = normalizeSpec(spec);

    expect(normalized.elements.doc.props).to.deep.equal({ text: 'New' });
    expect(migrations).to.have.lengthOf(0);
  });

  it('preserves $template expressions when migrating', () => {
    const spec: PdfReportSpec = {
      root: 'doc',
      elements: {
        doc: {
          type: 'Text',
          props: { content: { $template: 'Total: ${/queries/qg/aggregations/0/value}' } },
          children: [],
        },
      },
    };

    const { spec: normalized } = normalizeSpec(spec);

    expect(normalized.elements.doc.props).to.deep.equal({
      text: { $template: 'Total: ${/queries/qg/aggregations/0/value}' },
    });
  });

  it('leaves non-Text/non-Heading elements alone', () => {
    const spec: PdfReportSpec = {
      root: 'list',
      elements: {
        list: { type: 'List', props: { items: ['a', 'b'] }, children: [] },
      },
    };

    const { spec: normalized, migrations } = normalizeSpec(spec);

    expect(normalized.elements.list.props).to.deep.equal({ items: ['a', 'b'] });
    expect(migrations).to.have.lengthOf(0);
  });
});

describe('diagnoseSpec after normalizeSpec', () => {
  it('does not flag a normalized Text element that had `content`', () => {
    const original: PdfReportSpec = {
      root: 'doc',
      elements: {
        doc: { type: 'Document', props: {}, children: ['t'] },
        t: { type: 'Text', props: { content: 'Hi' }, children: [] },
      },
    };
    const { spec: normalized } = normalizeSpec(original);
    expect(diagnoseSpec(normalized)).to.deep.equal([]);
  });
});

describe('nestedToFlat → normalizeSpec pipeline', () => {
  it('flattens a nested Document/Page/Heading tree and passes diagnoseSpec', () => {
    const nested = {
      type: 'Document',
      props: { title: 'Salary report' },
      children: [
        {
          type: 'Page',
          props: { size: 'A4' },
          children: [
            { type: 'Heading', props: { text: 'Salary report', level: 'h1' } },
            { type: 'Text', props: { text: 'Body' } },
          ],
        },
      ],
    };

    const flat = nestedToFlat(nested as Parameters<typeof nestedToFlat>[0]) as unknown as PdfReportSpec;
    const { spec: normalized, migrations } = normalizeSpec(flat);

    expect(normalized.root).to.be.a('string');
    expect(normalized.elements[normalized.root].type).to.equal('Document');
    const pageKey = normalized.elements[normalized.root].children![0];
    expect(normalized.elements[pageKey].type).to.equal('Page');
    const headingKey = normalized.elements[pageKey].children![0];
    expect(normalized.elements[headingKey].type).to.equal('Heading');
    expect(normalized.elements[headingKey].props).to.deep.equal({ text: 'Salary report', level: 'h1' });
    expect(migrations).to.have.lengthOf(0);
    expect(diagnoseSpec(normalized)).to.deep.equal([]);
  });

  it('preserves `repeat` + `$item` references when flattening a View parent', () => {
    const nested = {
      type: 'Document',
      props: { title: 'Top employees' },
      children: [
        {
          type: 'Page',
          props: { size: 'A4' },
          children: [
            {
              type: 'View',
              repeat: { statePath: '/queries/qg_001/rows' },
              children: [
                { type: 'Text', props: { text: { $item: 'name' } } },
              ],
            },
          ],
        },
      ],
    };

    const flat = nestedToFlat(nested as Parameters<typeof nestedToFlat>[0]) as unknown as PdfReportSpec;
    const { spec: normalized } = normalizeSpec(flat);

    // Walk to the View element and confirm `repeat` survived.
    const pageKey = normalized.elements[normalized.root].children![0];
    const viewKey = normalized.elements[pageKey].children![0];
    const viewEl = normalized.elements[viewKey];
    expect(viewEl.type).to.equal('View');
    expect(viewEl.repeat).to.deep.equal({ statePath: '/queries/qg_001/rows' });
    const textKey = viewEl.children![0];
    expect(normalized.elements[textKey].type).to.equal('Text');
    expect((normalized.elements[textKey].props as any).text).to.deep.equal({ $item: 'name' });
    expect(diagnoseSpec(normalized)).to.deep.equal([]);
  });
});
