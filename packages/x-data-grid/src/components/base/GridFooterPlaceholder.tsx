import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export function GridFooterPlaceholder() {
  const { hideFooter, slots, slotProps } = useGridRootProps();

  if (hideFooter) {
    return null;
  }

  return <slots.footer {...(slotProps?.footer as any) /* FIXME: typing error */} />;
}
