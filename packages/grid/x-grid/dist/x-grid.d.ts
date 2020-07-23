import { GridComponentProps } from '@material-ui/x-grid-modules';
export * from '@material-ui/x-grid-modules';
export * from '@material-ui/x-license';
import { FC } from 'react';

declare type XGridProps = Omit<GridComponentProps, 'licenseStatus'>;
declare const XGrid: FC<XGridProps>;

export { XGrid, XGridProps };
