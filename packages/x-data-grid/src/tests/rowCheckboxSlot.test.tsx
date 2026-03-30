import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { DataGrid } from '@mui/x-data-grid';

describe('<DataGrid /> - rowCheckbox slot', () => {
  const { render } = createRenderer();

  const columns = [{ field: 'name', width: 150 }];
  const rows = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
  ];

  it('should allow to override the rowCheckbox slot', () => {
    function CustomRowCheckbox(props: any) {
      return <div data-testid="custom-row-checkbox">{props.rowId}</div>;
    }

    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          slots={{
            rowCheckbox: CustomRowCheckbox,
          }}
        />
      </div>,
    );

    const customCheckboxes = screen.getAllByTestId('custom-row-checkbox');
    expect(customCheckboxes).to.have.length(2);
    expect(customCheckboxes[0].textContent).to.equal('1');
    expect(customCheckboxes[1].textContent).to.equal('2');
  });

  it('should pass other props correctly to the rowCheckbox slot', () => {
    let passedProps: any;
    function CustomRowCheckbox(props: any) {
      passedProps = props;
      return <div data-testid="custom-row-checkbox" />;
    }

    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGrid
          rows={[{ id: 1, name: 'John' }]}
          columns={columns}
          checkboxSelection
          slots={{
            rowCheckbox: CustomRowCheckbox,
          }}
          slotProps={{
            rowCheckbox: {
              'data-foo': 'bar',
            } as any,
          }}
        />
      </div>,
    );

    expect(passedProps).to.have.property('data-foo', 'bar');
    expect(passedProps).to.have.property('checked');
    expect(passedProps).to.have.property('onChange');
  });

  it('should pass material props correctly to the rowCheckbox slot', () => {
    let passedProps: any;
    function CustomRowCheckbox(props: any) {
      passedProps = props;
      return <div data-testid="custom-row-checkbox" />;
    }

    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGrid
          rows={[{ id: 1, name: 'John' }]}
          columns={[{ field: 'name' }]}
          checkboxSelection
          slots={{
            rowCheckbox: CustomRowCheckbox,
          }}
          slotProps={{
            rowCheckbox: {
              material: { color: 'primary' },
            } as any,
          }}
        />
      </div>,
    );

    expect(passedProps.material).to.have.property('color', 'primary');
  });

  it('should pass material props down to the baseCheckbox through the default rowCheckbox', () => {
    let passedProps: any;
    function CustomBaseCheckbox(props: any) {
      passedProps = props;
      return <div data-testid="custom-base-checkbox" />;
    }

    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGrid
          rows={[{ id: 1, name: 'John' }]}
          columns={[{ field: 'name' }]}
          checkboxSelection
          slots={{
            baseCheckbox: CustomBaseCheckbox,
          }}
          slotProps={{
            rowCheckbox: {
              material: { color: 'primary' },
            } as any,
          }}
        />
      </div>,
    );

    expect(passedProps.material).to.have.property('color', 'primary');
    expect(passedProps.material).to.have.property('disableRipple');
  });
});
