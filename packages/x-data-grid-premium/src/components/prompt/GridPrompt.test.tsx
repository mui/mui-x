import { createRenderer, screen } from '@mui/internal-test-utils';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { deDE, frFR } from '@mui/x-data-grid-premium/locales';
import { describe, expect, it } from 'vitest';
import { GridPrompt } from './GridPrompt';

function PromptToolbar() {
  return (
    <ul>
      <GridPrompt
        value="Filter countries"
        createdAt={new Date('2026-01-01')}
        onRerun={() => {}}
        response={{
          conversationId: 'conversation',
          select: -1,
          filters: [{ column: 'country', operator: 'isAnyOf', value: ['France', 'Germany'] }],
          aggregation: {},
          sorting: [],
          grouping: [],
          pivoting: {},
          chart: null,
        }}
      />
    </ul>
  );
}

describe('<GridPrompt />', () => {
  const { render } = createRenderer();

  it.each([
    {
      name: 'the default English operator label',
      localeText: {},
      label: 'Country is any of: France, Germany',
      description: 'Filter where Country is any of: France, Germany',
    },
    {
      name: 'an overridden operator label',
      localeText: { filterOperatorIsAnyOf: 'matches one of' },
      label: 'Country matches one of: France, Germany',
      description: 'Filter where Country matches one of: France, Germany',
    },
    {
      name: 'a translated operator label with the default prompt callbacks',
      localeText: frFR.components.MuiDataGrid.defaultProps.localeText,
      label: 'Country fait partie de: France, Germany',
      description: 'Filter where Country fait partie de: France, Germany',
    },
    {
      name: 'translated prompt callbacks',
      localeText: deDE.components.MuiDataGrid.defaultProps.localeText,
      label: 'Country entspricht einem der Werte: France, Germany',
      description: 'Filtern, bei dem Country einem der folgenden Werte entspricht: France, Germany',
    },
  ])('should render $name in filter changes', async ({ localeText, label, description }) => {
    const { user } = render(
      <div style={{ width: 500, height: 300 }}>
        <DataGridPremium
          rows={[{ id: 1, country: 'France' }]}
          columns={[
            {
              field: 'country',
              headerName: 'Country',
              type: 'singleSelect',
              valueOptions: ['France', 'Germany'],
            },
          ]}
          localeText={localeText}
          showToolbar
          slots={{ toolbar: PromptToolbar }}
        />
      </div>,
    );

    await user.click(
      screen.getByRole('button', { name: localeText.promptAppliedChanges ?? 'Applied changes' }),
    );

    expect(screen.getByLabelText(description)).to.have.text(label);
  });
});
