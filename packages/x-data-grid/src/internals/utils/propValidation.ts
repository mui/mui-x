import { errorOnce } from '@mui/x-internals/warning';
import { isNumber } from '../../utils/utils';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { GridSignature } from '../../constants/signature';

export type PropValidator<TProps> = (props: TProps) => string | undefined;

// Hyphenated props that the Data Grid supports. TypeScript doesn't type-check other hyphenated props.
const SUPPORTED_ATTRIBUTE_PROPS = new Set(['aria-label', 'aria-labelledby']);

// Only common test selectors, because build tools (Sentry, FullStory) inject other `data-*` props.
const WARNED_DATA_ATTRIBUTE_PROPS = new Set(['data-testid', 'data-cy', 'data-test', 'data-qa']);

export const propValidatorsDataGrid: PropValidator<DataGridProcessedProps>[] = [
  (props) => {
    const ignoredProps = Object.keys(props).filter(
      (key) =>
        (key.startsWith('aria-') && !SUPPORTED_ATTRIBUTE_PROPS.has(key)) ||
        WARNED_DATA_ATTRIBUTE_PROPS.has(key),
    );
    if (ignoredProps.length === 0) {
      return undefined;
    }
    return [
      `MUI X Data Grid: The ${ignoredProps.map((key) => `\`${key}\``).join(', ')} prop(s) are not forwarded to the DOM.`,
      'The Data Grid does not spread unknown props on its root element, so these attributes are ignored.',
      'Pass them with `slotProps.root` for the root element, or `slotProps.main` for the `.MuiDataGrid-main` element.',
      'For more details, see https://mui.com/x/react-data-grid/components/#root-and-main-elements',
    ].join('\n');
  },
  (props) =>
    (props.autoPageSize &&
      props.autoHeight &&
      [
        'MUI X: `<DataGrid autoPageSize={true} autoHeight={true} />` are not valid props.',
        'You cannot use both the `autoPageSize` and `autoHeight` props at the same time because `autoHeight` scales the height of the Data Grid according to the `pageSize`.',
        '',
        'Please remove one of these two props.',
      ].join('\n')) ||
    undefined,
  (props) =>
    (props.height != null &&
      props.autoHeight &&
      [
        'MUI X: `<DataGrid height={...} autoHeight={true} />` are not valid props.',
        'You cannot use both the `height` and `autoHeight` props at the same time because `autoHeight` scales the height of the Data Grid according to its content.',
        '',
        'Please remove one of these two props.',
      ].join('\n')) ||
    undefined,
  (props) =>
    (props.paginationMode === 'client' &&
      props.paginationMeta != null &&
      [
        'MUI X: Usage of the `paginationMeta` prop with client-side pagination (`paginationMode="client"`) has no effect.',
        '`paginationMeta` is only meant to be used with `paginationMode="server"`.',
      ].join('\n')) ||
    undefined,
  (props) =>
    (props.signature === GridSignature.DataGrid &&
      props.paginationMode === 'client' &&
      isNumber(props.rowCount) &&
      [
        'MUI X: Usage of the `rowCount` prop with client side pagination (`paginationMode="client"`) has no effect.',
        '`rowCount` is only meant to be used with `paginationMode="server"`.',
      ].join('\n')) ||
    undefined,
  (props) =>
    (props.paginationMode === 'server' &&
      props.rowCount == null &&
      !props.dataSource &&
      !props.paginationMeta &&
      [
        "MUI X: The `rowCount` prop must be passed using `paginationMode='server'`",
        'For more detail, see http://mui.com/components/data-grid/pagination/#index-based-pagination',
      ].join('\n')) ||
    undefined,
];

export function validateProps<TProps>(props: TProps, validators: PropValidator<TProps>[]) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  validators.forEach((validator) => {
    const message = validator(props);
    if (message) {
      errorOnce(message);
    }
  });
}
