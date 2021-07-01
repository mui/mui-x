import {GridApiRef, GridColumns, useGridApiRef, XGrid} from '@material-ui/x-grid';
import { expect } from 'chai';
import * as React from 'react';
import { createClientRenderStrictMode } from 'test/utils';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<XGrid /> - Export', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  const baselineProps = {
    autoHeight: isJSDOM,
  };

  let apiRef: GridApiRef;

  const columns: GridColumns = [{ field: 'id' }, { field: 'brand', headerName: 'Brand' }];

  describe('getDataAsCsv', () => {
      it('should work with basic strings', () => {
          const TestCaseCSVExport = () => {
              apiRef = useGridApiRef();
              return (
                  <div style={{ width: 300, height: 300 }}>
                      <XGrid
                          {...baselineProps}
                          apiRef={apiRef}
                          columns={columns}
                          rows={[
                              {
                                  id: 0,
                                  brand: 'Nike',
                              },
                              {
                                  id: 1,
                                  brand: 'Adidas',
                              },
                              {
                                  id: 2,
                                  brand: 'Puma',
                              },
                          ]}
                      />
                  </div>
              );
          };

          render(<TestCaseCSVExport />);
          expect(apiRef.current.getDataAsCsv()).to.equal(
              ['id,Brand', '0,Nike', '1,Adidas', '2,Puma'].join('\r\n'),
          );
          apiRef.current.updateRows([
              {
                  id: 1,
                  brand: 'Adidas,Reebok',
              },
          ]);
          expect(apiRef.current.getDataAsCsv()).to.equal(
              ['id,Brand', '0,Nike', '1,"Adidas,Reebok"', '2,Puma'].join('\r\n'),
          );
      });

      it('should work with comma', () => {
          const TestCaseCSVExport = () => {
              apiRef = useGridApiRef();
              return (
                  <div style={{ width: 300, height: 300 }}>
                      <XGrid
                          {...baselineProps}
                          apiRef={apiRef}
                          columns={columns}
                          rows={[
                              {
                                  id: 0,
                                  brand: 'Nike',
                              },
                              {
                                  id: 1,
                                  brand: 'Adidas,Puma',
                              },
                          ]}
                      />
                  </div>
              );
          };

          render(<TestCaseCSVExport />);
          expect(apiRef.current.getDataAsCsv()).to.equal(
              ['id,Brand', '0,Nike', '1,"Adidas,Puma"'].join('\r\n'),
          );
      });

      it('should apply valueFormatter correctly', () => {
          const TestCaseCSVExport = () => {
              apiRef = useGridApiRef();
              return (
                  <div style={{ width: 300, height: 300 }}>
                      <XGrid
                          {...baselineProps}
                          apiRef={apiRef}
                          columns={[
                              { field: 'id' },
                              {
                                  field: 'brand',
                                  headerName: 'Brand',
                                  valueFormatter: (params) => (params.value === 'Nike' ? 'Jordan' : params.value),
                              },
                          ]}
                          rows={[
                              {
                                  id: 0,
                                  brand: 'Nike',
                              },
                              {
                                  id: 1,
                                  brand: 'Adidas',
                              },
                          ]}
                      />
                  </div>
              );
          };

          render(<TestCaseCSVExport />);
          expect(apiRef.current.getDataAsCsv()).to.equal(
              ['id,Brand', '0,Jordan', '1,Adidas'].join('\r\n'),
          );
      });

      it('should work with double quotes', () => {
          const TestCaseCSVExport = () => {
              apiRef = useGridApiRef();
              return (
                  <div style={{ width: 300, height: 300 }}>
                      <XGrid
                          {...baselineProps}
                          apiRef={apiRef}
                          columns={columns}
                          rows={[
                              {
                                  id: 0,
                                  brand: 'Nike',
                              },
                              {
                                  id: 1,
                                  brand: 'Samsung 24" (inches)',
                              },
                          ]}
                      />
                  </div>
              );
          };

          render(<TestCaseCSVExport />);
          expect(apiRef.current.getDataAsCsv()).to.equal(
              ['id,Brand', '0,Nike', '1,Samsung 24"" (inches)'].join('\r\n'),
          );
      });

      it('should allow to change the delimiter', () => {
          const TestCaseCSVExport = () => {
              apiRef = useGridApiRef();
              return (
                  <div style={{ width: 300, height: 300 }}>
                      <XGrid
                          {...baselineProps}
                          apiRef={apiRef}
                          columns={columns}
                          rows={[
                              {
                                  id: 0,
                                  brand: 'Nike',
                              },
                              {
                                  id: 1,
                                  brand: 'Adidas',
                              },
                          ]}
                      />
                  </div>
              );
          };

          render(<TestCaseCSVExport />);
          expect(
              apiRef.current.getDataAsCsv({
                  delimiter: ';',
              }),
          ).to.equal(['id;Brand', '0;Nike', '1;Adidas'].join('\r\n'));
      });

      it('should not export hidden column', () => {
          const TestCaseCSVExport = () => {
              apiRef = useGridApiRef();
              return (
                  <div style={{ width: 300, height: 300 }}>
                      <XGrid
                          {...baselineProps}
                          apiRef={apiRef}
                          columns={[{ field: 'id' }, { field: 'brand', headerName: 'Brand', hide: true }]}
                          rows={[
                              {
                                  id: 0,
                                  brand: 'Nike',
                              },
                              {
                                  id: 1,
                                  brand: 'Adidas',
                              },
                          ]}
                      />
                  </div>
              );
          };

          render(<TestCaseCSVExport />);
          expect(apiRef.current.getDataAsCsv()).to.equal(
              ['id', '0', '1'].join('\r\n'),
          );
      })

      it('should export hidden column if params.allColumns = true', () => {
          const TestCaseCSVExport = () => {
              apiRef = useGridApiRef();
              return (
                  <div style={{ width: 300, height: 300 }}>
                      <XGrid
                          {...baselineProps}
                          apiRef={apiRef}
                          columns={[{ field: 'id' }, { field: 'brand', headerName: 'Brand', hide: true }]}
                          rows={[
                              {
                                  id: 0,
                                  brand: 'Nike',
                              },
                              {
                                  id: 1,
                                  brand: 'Adidas',
                              },
                          ]}
                      />
                  </div>
              );
          };

          render(<TestCaseCSVExport />);
          expect(
              apiRef.current.getDataAsCsv({
                  allColumns: true,
              }),
          ).to.equal(['id,Brand', '0,Nike', '1,Adidas'].join('\r\n'));
      })

      it('should only export columns in params.columnKeys if defined', () => {
          const TestCaseCSVExport = () => {
              apiRef = useGridApiRef();
              return (
                  <div style={{ width: 300, height: 300 }}>
                      <XGrid
                          {...baselineProps}
                          apiRef={apiRef}
                          columns={[{ field: 'id' }, { field: 'brand', headerName: 'Brand', hide: true }]}
                          rows={[
                              {
                                  id: 0,
                                  brand: 'Nike',
                              },
                              {
                                  id: 1,
                                  brand: 'Adidas',
                              },
                          ]}
                      />
                  </div>
              );
          };

          render(<TestCaseCSVExport />);
          expect(
              apiRef.current.getDataAsCsv({
                  columnKeys: ['brand'],
              }),
          ).to.equal(['Brand', 'Nike', 'Adidas'].join('\r\n'));
      })
  })
});
