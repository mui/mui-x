import * as React from 'react';
import { Box, styled } from '@mui/system';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import GridPivotModelEditor from '../hooks/features/pivoting/GridPivotModelEditor';

const GridPivotPanelContainerStyled = styled('div')({
  width: 250,
  overflow: 'hidden',
  position: 'relative',
  paddingLeft: 16,
  paddingRight: 16,
});

const ResizeHandle = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: 6,
  cursor: 'ew-resize',
  borderLeft: '1px solid #eee',
  transition: 'border-left 0.2s',
  '&:hover': {
    borderLeft: '2px solid #aaa',
  },
});

const useResize = <TElement extends HTMLElement>(options: {
  getInitialWidth: (handleElement: TElement) => number;
  onWidthChange: (newWidth: number, handleElement: TElement) => void;
}) => {
  const resizeHandleRef = React.useRef<TElement>(null);
  const optionsRef = React.useRef(options);
  React.useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  React.useEffect(() => {
    const handle = resizeHandleRef.current;
    if (!handle) {
      return undefined;
    }

    const { onWidthChange, getInitialWidth } = optionsRef.current;

    let startX: null | number = null;
    let startWidth: null | number = null;

    const handleMouseMove = (event: MouseEvent) => {
      if (startX === null || startWidth === null) {
        return;
      }
      const newWidth = startWidth + (startX - event.clientX);
      onWidthChange(newWidth, handle);
    };

    const handleMouseUp = () => {
      startX = null;
      startWidth = null;

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDown = (event: MouseEvent) => {
      event.preventDefault();
      startX = event.clientX;
      startWidth = getInitialWidth(handle);

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    handle.addEventListener('mousedown', handleMouseDown);

    return () => {
      handle.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return {
    ref: resizeHandleRef,
  };
};

export function GridPivotPanelContainer({ children }: { children: React.ReactNode }) {
  const { ref } = useResize({
    getInitialWidth: (handle) => {
      return handle.parentElement!.offsetWidth;
    },
    onWidthChange: (newWidth, handle) => {
      handle.parentElement!.style.width = `${newWidth}px`;
    },
  });

  return (
    <GridPivotPanelContainerStyled>
      <ResizeHandle ref={ref as any} />
      {children}
    </GridPivotPanelContainerStyled>
  );
}

export function GridPivotPanel({
  pivotModel,
  initialColumns,
  onPivotModelChange,
  pivotMode,
  onPivotModeChange,
}: {
  pivotModel: any;
}) {
  return (
    <React.Fragment>
      <FormControlLabel
        control={
          <Switch checked={pivotMode} onChange={(e) => onPivotModeChange(e.target.checked)} />
        }
        label="Pivot"
      />
      {pivotMode && (
        <GridPivotModelEditor
          pivotModel={pivotModel}
          columns={initialColumns}
          onPivotModelChange={onPivotModelChange}
        />
      )}
    </React.Fragment>
  );
}
