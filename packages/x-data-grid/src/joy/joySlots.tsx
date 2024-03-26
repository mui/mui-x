import * as React from 'react';
import { SxProps } from '@mui/system';
import { ColorPaletteProp, Theme, VariantProp } from '@mui/joy/styles';
import JoyCheckbox from '@mui/joy/Checkbox';
import JoyInput from '@mui/joy/Input';
import JoyFormControl from '@mui/joy/FormControl';
import JoyFormLabel from '@mui/joy/FormLabel';
import JoyButton from '@mui/joy/Button';
import JoyIconButton from '@mui/joy/IconButton';
import JoySelect, { SelectProps as JoySelectProps } from '@mui/joy/Select';
import JoyOption, { OptionProps as JoyOptionProps } from '@mui/joy/Option';
import JoyBox from '@mui/joy/Box';
import JoyTypography from '@mui/joy/Typography';
import JoyCircularProgress from '@mui/joy/CircularProgress';
import JoyTooltip from '@mui/joy/Tooltip';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import joyIconSlots, { GridKeyboardArrowRight, GridKeyboardArrowLeft } from './icons';
import type { GridSlotProps, GridSlotsComponent, GridSlotsComponentsProps } from '../models';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { gridFilteredTopLevelRowCountSelector, gridPaginationModelSelector } from '../hooks';
import { GridOverlay } from '../components/containers/GridOverlay';

function convertColor<
  T extends
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning'
    | 'inherit'
    | 'default',
>(color: T | undefined) {
  if (color === 'secondary') {
    return 'primary';
  }
  if (color === 'error') {
    return 'danger';
  }
  if (color === 'default' || color === 'inherit') {
    return 'neutral';
  }
  return color as ColorPaletteProp;
}

function convertSize<T extends 'small' | 'medium' | 'large'>(size: T | undefined) {
  return (size ? { small: 'sm', medium: 'md', large: 'lg' }[size] : size) as
    | 'sm'
    | 'md'
    | 'lg'
    | undefined;
}

function convertVariant<T extends 'outlined' | 'contained' | 'text' | 'standard' | 'filled'>(
  variant: T | undefined,
  defaultVariant: VariantProp = 'plain',
) {
  if (!variant) {
    return defaultVariant;
  }

  return ({
    standard: 'outlined',
    outlined: 'outlined',
    contained: 'solid',
    text: 'plain',
    filled: 'soft',
  }[variant] || defaultVariant) as VariantProp;
}

const Checkbox = React.forwardRef<
  HTMLElement,
  NonNullable<GridSlotsComponentsProps['baseCheckbox']>
>(
  (
    { touchRippleRef, inputProps, onChange, color, size, checked, sx, value, inputRef, ...props },
    ref,
  ) => {
    return (
      <JoyCheckbox
        {...props}
        slotProps={{ input: { ...(inputProps as any), ref: inputRef } }}
        ref={ref}
        checked={checked}
        onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
      />
    );
  },
);

const TextField = React.forwardRef<
  HTMLDivElement,
  NonNullable<GridSlotsComponentsProps['baseTextField']>
>(({ onChange, label, placeholder, value, inputRef, type, size, variant, ...props }, ref) => {
  const rootRef = useForkRef(ref, props.InputProps?.ref);
  const inputForkRef = useForkRef(inputRef, props?.inputProps?.ref);
  const { startAdornment, endAdornment } = props.InputProps || {};

  return (
    <JoyFormControl ref={rootRef}>
      <JoyFormLabel>{label}</JoyFormLabel>
      <JoyInput
        type={type}
        value={value as any}
        onChange={onChange}
        placeholder={placeholder}
        variant={convertVariant(variant, 'outlined')}
        size={convertSize(size)}
        slotProps={{ input: { ...props?.inputProps, ref: inputForkRef } }}
        startDecorator={startAdornment}
        endDecorator={endAdornment}
      />
    </JoyFormControl>
  );
});

const Button = React.forwardRef<HTMLButtonElement, GridSlotProps['baseButton']>(function Button(
  { startIcon, color, endIcon, size, sx, variant, ...props },
  ref,
) {
  return (
    <JoyButton
      {...props}
      size={convertSize(size)}
      color={convertColor(color)}
      variant={convertVariant(variant)}
      ref={ref}
      startDecorator={startIcon}
      endDecorator={endIcon}
      sx={sx as SxProps<Theme>}
    />
  );
});

const IconButton = React.forwardRef<
  HTMLButtonElement,
  NonNullable<GridSlotsComponentsProps['baseIconButton']>
>(function IconButton({ color, size, sx, touchRippleRef, ...props }, ref) {
  return (
    <JoyIconButton
      {...props}
      size={convertSize(size)}
      color={convertColor(color) ?? 'neutral'}
      variant="plain"
      ref={ref}
      sx={sx as SxProps<Theme>}
    />
  );
});

const Select = React.forwardRef<any, GridSlotProps['baseSelect']>(
  (
    {
      open,
      onOpen,
      value,
      onChange,
      size,
      color,
      variant,
      inputProps,
      MenuProps,
      inputRef,
      error,
      native,
      fullWidth,
      labelId,
      ...props
    },
    ref,
  ) => {
    const handleChange: JoySelectProps<any, any>['onChange'] = (event, newValue) => {
      if (event && onChange) {
        // Same as in https://github.com/mui/material-ui/blob/e5558282a8f36856aef1299f3a36f3235e92e770/packages/mui-material/src/Select/SelectInput.js#L288-L300

        // Redefine target to allow name and value to be read.
        // This allows seamless integration with the most popular form libraries.
        // https://github.com/mui/material-ui/issues/13485#issuecomment-676048492
        // Clone the event to not override `target` of the original event.
        const nativeEvent = (event as React.SyntheticEvent).nativeEvent || event;
        // @ts-ignore The nativeEvent is function, not object
        const clonedEvent = new nativeEvent.constructor(nativeEvent.type, nativeEvent);

        Object.defineProperty(clonedEvent, 'target', {
          writable: true,
          value: { value: newValue, name: props.name },
        });
        onChange(clonedEvent, null);
      }
    };

    return (
      <JoySelect
        {...(props as JoySelectProps<any, any>)}
        listboxOpen={open}
        onListboxOpenChange={(isOpen) => {
          if (isOpen) {
            onOpen?.({} as React.SyntheticEvent);
          } else {
            MenuProps?.onClose?.({} as React.KeyboardEvent, undefined as any);
          }
        }}
        size={convertSize(size)}
        color={convertColor(color)}
        variant={convertVariant(variant, 'outlined')}
        ref={ref}
        value={value}
        onChange={handleChange}
        slotProps={{
          button: {
            'aria-labelledby': labelId,
            ref: inputRef,
          },
          listbox: {
            disablePortal: false,
            sx: {
              zIndex: 1350,
            },
          },
        }}
      />
    );
  },
);

const Option = React.forwardRef<
  HTMLLIElement,
  NonNullable<GridSlotsComponentsProps['baseSelectOption']>
>(({ native, ...props }, ref) => {
  return <JoyOption {...(props as JoyOptionProps)} ref={ref} />;
});

const InputLabel = React.forwardRef<
  HTMLLabelElement,
  NonNullable<GridSlotsComponentsProps['baseInputLabel']>
>(({ shrink, variant, sx, ...props }, ref) => {
  return <JoyFormLabel {...props} ref={ref} sx={sx as SxProps<Theme>} />;
});

function labelDisplayedRows({ from, to, count }: { from: number; to: number; count: number }) {
  return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
}
const getLabelDisplayedRowsTo = ({
  page,
  pageSize,
  rowCount,
}: {
  page: number;
  pageSize: number;
  rowCount: number;
}) => {
  if (rowCount === -1) {
    return (page + 1) * pageSize;
  }
  return pageSize === -1 ? rowCount : Math.min(rowCount, (page + 1) * pageSize);
};

const Pagination = React.forwardRef<any, GridSlotProps['pagination']>((props, ref) => {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const paginationModel = gridPaginationModelSelector(apiRef);
  const visibleTopLevelRowCount = gridFilteredTopLevelRowCountSelector(apiRef);

  const rowCount = React.useMemo(
    () => rootProps.rowCount ?? visibleTopLevelRowCount ?? 0,
    [rootProps.rowCount, visibleTopLevelRowCount],
  );

  const lastPage = React.useMemo(
    () => Math.floor(rowCount / (paginationModel.pageSize || 1)),
    [rowCount, paginationModel.pageSize],
  );

  const handlePageChange = React.useCallback(
    (page: number) => {
      apiRef.current.setPage(page);
    },
    [apiRef],
  );

  const page = paginationModel.page <= lastPage ? paginationModel.page : lastPage;
  const pageSize = paginationModel.pageSize;

  const isPageSizeIncludedInPageSizeOptions = () => {
    for (let i = 0; i < rootProps.pageSizeOptions.length; i += 1) {
      const option = rootProps.pageSizeOptions[i];
      if (typeof option === 'number') {
        if (option === pageSize) {
          return true;
        }
      } else if (option.value === pageSize) {
        return true;
      }
    }
    return false;
  };

  const pageSizeOptions = isPageSizeIncludedInPageSizeOptions() ? rootProps.pageSizeOptions : [];

  const handleChangeRowsPerPage: JoySelectProps<number, false>['onChange'] = (event, newValue) => {
    const newPageSize = Number(newValue);
    apiRef.current.setPageSize(newPageSize);
  };
  return (
    <JoyBox
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        justifyContent: 'flex-end',
        px: 2,
      }}
      ref={ref}
    >
      <JoyFormControl orientation="horizontal" size="sm">
        <JoyFormLabel>Rows per page:</JoyFormLabel>
        <JoySelect<number> onChange={handleChangeRowsPerPage} value={pageSize}>
          {pageSizeOptions.map((option: number | { label: string; value: number }) => {
            return (
              <Option
                value={typeof option !== 'number' && option.value ? option.value : option}
                key={typeof option !== 'number' && option.label ? option.label : `${option}`}
              >
                {typeof option !== 'number' && option.label ? option.label : `${option}`}
              </Option>
            );
          })}
        </JoySelect>
      </JoyFormControl>
      <JoyTypography textAlign="center" fontSize="xs" fontWeight="md">
        {labelDisplayedRows({
          from: rowCount === 0 ? 0 : page * pageSize + 1,
          to: getLabelDisplayedRowsTo({ page, pageSize, rowCount }),
          count: rowCount === -1 ? -1 : rowCount,
        })}
      </JoyTypography>
      <JoyBox sx={{ display: 'flex', gap: 0.5 }}>
        <JoyIconButton
          size="sm"
          color="neutral"
          variant="outlined"
          disabled={page === 0}
          onClick={() => handlePageChange(page - 1)}
          sx={{ bgcolor: 'background.surface' }}
        >
          <GridKeyboardArrowLeft />
        </JoyIconButton>
        <JoyIconButton
          size="sm"
          color="neutral"
          variant="outlined"
          disabled={rowCount !== -1 ? page >= Math.ceil(rowCount / pageSize) - 1 : false}
          onClick={() => handlePageChange(page + 1)}
          sx={{ bgcolor: 'background.surface' }}
        >
          <GridKeyboardArrowRight />
        </JoyIconButton>
      </JoyBox>
    </JoyBox>
  );
});

const LoadingOverlay = React.forwardRef<
  HTMLDivElement,
  NonNullable<GridSlotsComponentsProps['loadingOverlay']>
>((props, ref) => {
  return (
    <GridOverlay {...props} ref={ref}>
      <JoyCircularProgress />
    </GridOverlay>
  );
});

const joySlots: Partial<GridSlotsComponent> = {
  ...joyIconSlots,
  baseCheckbox: Checkbox,
  baseTextField: TextField,
  baseButton: Button,
  baseIconButton: IconButton,
  baseSelect: Select,
  baseSelectOption: Option,
  baseInputLabel: InputLabel,
  baseFormControl: JoyFormControl as any /* FIXME: typing error */,
  baseTooltip: JoyTooltip as any /* FIXME: typing error */,
  pagination: Pagination,
  loadingOverlay: LoadingOverlay,
};

export default joySlots;
