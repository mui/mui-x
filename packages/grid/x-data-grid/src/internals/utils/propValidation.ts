import { DataGridProcessedProps } from '../../models/props/DataGridProps';

export type PropValidator<TProps> = (props: TProps) => string | undefined;

export const propValidatorsDataGrid: PropValidator<DataGridProcessedProps>[] = [
  (props) =>
    (props.autoPageSize &&
      props.autoHeight &&
      [
        'MUI X: `<DataGrid autoPageSize={true} autoHeight={true} />` are not valid props.',
        'You can not use both the `autoPageSize` and `autoHeight` props at the same time because `autoHeight` scales the height of the Data Grid according to the `pageSize`.',
        '',
        'Please remove one of these two props.',
      ].join('\n')) ||
    undefined,
];

const warnedOnceMap = new Set();
const warnOnce = (message: string) => {
  if (!warnedOnceMap.has(message)) {
    console.error(message);
    warnedOnceMap.add(message);
  }
};

export const validateProps = <TProps>(props: TProps, validators: PropValidator<TProps>[]) => {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  validators.forEach((validator) => {
    const warning = validator(props);
    if (warning) {
      warnOnce(warning);
    }
  });
};
