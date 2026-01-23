'use client';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { GridRenderEditCellParams, useGridApiContext, useGridRootProps } from '@mui/x-data-grid-premium';
import { useRowEditHandlers } from '../hooks/useRowEditHandlers';

function EditBoolean(props: GridRenderEditCellParams<any, boolean>) {
  const { id, value, field, hasFocus } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { handleTabKeyDown } = useRowEditHandlers({ id, field });

  const handleChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      await apiRef.current.setEditCellValue({ id, field, value: event.target.checked }, event);
    },
    [apiRef, field, id],
  );

  useEnhancedEffect(() => {
    if (hasFocus) {
      inputRef.current?.focus();
    }
  }, [hasFocus]);

  return (
    <div
      onKeyDownCapture={handleTabKeyDown}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <rootProps.slots.baseCheckbox
        inputRef={inputRef}
        checked={Boolean(value)}
        onChange={handleChange}
        size="small"
        {...rootProps.slotProps?.baseCheckbox}
      />
    </div>
  );
}

export function renderEditBoolean(params: GridRenderEditCellParams<any, boolean>) {
  return <EditBoolean {...params} />;
}
