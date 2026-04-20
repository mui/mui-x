import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import {
  DataGrid,
  type DataGridProps,
  type GridColDef,
  type GridFilterModel,
} from '@mui/x-data-grid';
import materialSlots from '../material';

describe('<DataGrid /> - Material Slots', () => {
  const { render } = createRenderer();

  const baselineProps: DataGridProps = {
    rows: [
      { id: 0, brand: 'Nike' },
      { id: 1, brand: 'Adidas' },
    ],
    columns: [{ field: 'brand' }] as GridColDef[],
  };

  function TestDataGrid(props: Partial<DataGridProps>) {
    return (
      <div style={{ width: 300, height: 500 }}>
        <DataGrid {...baselineProps} {...props} />
      </div>
    );
  }

  const filterModelEmpty: GridFilterModel = {
    items: [{ field: 'brand', operator: 'contains' }],
  };

  describe('BaseTextField', () => {
    it('should forward slotProps.htmlInput to the native input', () => {
      render(
        <TestDataGrid
          filterModel={filterModelEmpty}
          slotProps={{
            panel: { open: true },
            baseTextField: {
              slotProps: {
                htmlInput: { 'data-testid': 'html-input-from-slotProps' } as any,
              },
            },
          }}
        />,
      );
      expect(screen.getByTestId('html-input-from-slotProps')).not.to.equal(null);
    });

    it('should forward slotProps.input to the Input component', () => {
      render(
        <TestDataGrid
          filterModel={filterModelEmpty}
          slotProps={{
            panel: { open: true },
            baseTextField: {
              slotProps: {
                input: { className: 'custom-input-class' },
              },
            },
          }}
        />,
      );
      const input = document.querySelector('.custom-input-class');
      expect(input).not.to.equal(null);
    });

    it('should forward material prop to MUITextField', () => {
      render(
        <TestDataGrid
          filterModel={filterModelEmpty}
          slotProps={{
            panel: { open: true },
            baseTextField: {
              material: { 'data-testid': 'material-textfield' } as any,
            },
          }}
        />,
      );
      expect(screen.getByTestId('material-textfield')).not.to.equal(null);
    });

    it('material should not override slotProps', () => {
      render(
        <TestDataGrid
          filterModel={filterModelEmpty}
          slotProps={{
            panel: { open: true },
            baseTextField: {
              slotProps: { htmlInput: { 'data-testid': 'from-slotProps' } as any },
              material: {
                slotProps: { htmlInput: { 'data-testid': 'from-material' } },
              } as any,
            },
          }}
        />,
      );
      expect(screen.getByTestId('from-slotProps')).not.to.equal(null);
    });
  });

  describe('BaseCheckbox', () => {
    it('should forward slotProps.htmlInput to the checkbox input element', () => {
      render(
        <TestDataGrid
          checkboxSelection
          slotProps={{
            baseCheckbox: {
              slotProps: {
                htmlInput: { 'data-testid': 'checkbox-html-input' } as any,
              },
            },
          }}
        />,
      );
      expect(screen.getAllByTestId('checkbox-html-input').length).not.to.equal(0);
    });

    it('should forward material prop to MUI Checkbox', () => {
      render(
        <TestDataGrid
          checkboxSelection
          slotProps={{
            baseCheckbox: {
              material: { color: 'secondary' } as any,
            },
          }}
        />,
      );
      const checkbox = document.querySelector('.MuiCheckbox-colorSecondary');
      expect(checkbox).not.to.equal(null);
    });

    it('should merge material.slotProps.input with slotProps.htmlInput', () => {
      render(
        <TestDataGrid
          checkboxSelection
          slotProps={{
            baseCheckbox: {
              slotProps: {
                htmlInput: { 'data-testid': 'from-slotProps' } as any,
              },
              material: {
                slotProps: { input: { 'data-from-material': 'true' } },
              } as any,
            },
          }}
        />,
      );
      const input = screen.getAllByTestId('from-slotProps')[0];
      expect(input).not.to.equal(null);
      expect(input.getAttribute('data-from-material')).to.equal('true');
    });

    it('should combine inputRef, slotProps.htmlInput.ref, and material.slotProps.input.ref via useForkRef', () => {
      const BaseCheckbox = materialSlots.baseCheckbox;
      const inputRef = React.createRef<HTMLInputElement>();
      const htmlInputRef = React.createRef<HTMLInputElement>();
      const materialInputRef = React.createRef<HTMLInputElement>();

      render(
        <BaseCheckbox
          inputRef={inputRef}
          slotProps={{
            htmlInput: { ref: htmlInputRef } as any,
          }}
          material={
            {
              slotProps: { input: { ref: materialInputRef } },
            } as any
          }
        />,
      );

      expect(inputRef.current).not.to.equal(null);
      expect(inputRef.current!.tagName).to.equal('INPUT');
      expect(htmlInputRef.current).to.equal(inputRef.current);
      expect(materialInputRef.current).to.equal(inputRef.current);
    });
  });

  describe('BaseAutocomplete', () => {
    const multiSelectColumns: GridColDef[] = [
      {
        field: 'brand',
        type: 'singleSelect',
        valueOptions: ['Nike', 'Adidas', 'Puma'],
      },
    ];

    const multiSelectFilterModel: GridFilterModel = {
      items: [{ field: 'brand', operator: 'isAnyOf' }],
    };

    it('rootProps.slotProps.baseTextField should apply to Autocomplete inner TextField', () => {
      render(
        <TestDataGrid
          columns={multiSelectColumns}
          filterModel={multiSelectFilterModel}
          slotProps={{
            panel: { open: true },
            baseTextField: { 'data-testid': 'base-textfield-override' } as any,
          }}
        />,
      );
      expect(screen.getByTestId('base-textfield-override')).not.to.equal(null);
    });

    it('rootProps.slotProps.baseTextField.slotProps should apply to Autocomplete inner TextField', () => {
      render(
        <TestDataGrid
          columns={multiSelectColumns}
          filterModel={multiSelectFilterModel}
          slotProps={{
            panel: { open: true },
            baseTextField: {
              slotProps: {
                htmlInput: { 'data-testid': 'ac-html-input' } as any,
                input: { className: 'ac-custom-input' },
                inputLabel: { className: 'ac-custom-input-label' },
              },
            },
          }}
        />,
      );
      expect(screen.getByTestId('ac-html-input')).not.to.equal(null);
      expect(document.querySelector('.ac-custom-input')).not.to.equal(null);
      expect(document.querySelector('.ac-custom-input-label')).not.to.equal(null);
    });
  });
});
