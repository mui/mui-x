import { GridSlotProps } from '@mui/x-data-grid';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

type BaseIconButtonProps = GridSlotProps['baseIconButton'];

interface GridHeaderFilterClearIconProps extends BaseIconButtonProps {}

function GridHeaderFilterClearButton(props: GridHeaderFilterClearIconProps) {
  const { slots, slotProps } = useGridRootProps();
  return (
    <slots.baseIconButton
      tabIndex={-1}
      aria-label="Clear filter"
      size="small"
      {...slotProps?.baseIconButton}
      {...props}
    >
      <slots.columnMenuClearIcon fontSize="inherit" />
    </slots.baseIconButton>
  );
}

export { GridHeaderFilterClearButton };
