/**
 * Data Grid component implementing [[GridComponentProps]].
 * @returns JSX.Element
 */
import * as React from 'react';
import { GridRoot } from './components/containers/GridRoot';
import { GridContextProvider } from './context/GridContextProvider';
import { ErrorHandler } from './ErrorHandler';
import { GridBody } from './GridBody';
import { GridComponentProps } from './GridComponentProps';
import { GridFooterPlaceholder } from './GridFooterPlaceholder';
import { GridHeaderPlaceholder } from './GridHeaderPlaceholder';
import { useGridApiRef } from './hooks/features/useGridApiRef';
import { useGridComponent } from './useGridComponent';

// TODO recompose the api type
//      register new api method
export const GridComponent = React.forwardRef<HTMLDivElement, GridComponentProps>(
  function GridComponent(props, ref) {
    const apiRef = useGridApiRef(props.apiRef);

    useGridComponent(apiRef, props);

    return (
      <GridContextProvider apiRef={apiRef} props={props}>
        <GridRoot ref={ref}>
          <ErrorHandler>
            <GridHeaderPlaceholder />
            <GridBody />
            <GridFooterPlaceholder />
          </ErrorHandler>
        </GridRoot>
      </GridContextProvider>
    );
  },
);
