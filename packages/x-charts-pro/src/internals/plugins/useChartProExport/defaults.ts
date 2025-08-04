import { chartsToolbarClasses } from '@mui/x-charts/Toolbar';

export function defaultOnBeforeExport(iframe: HTMLIFrameElement): void {
  const document = iframe.contentDocument!;
  const chartsToolbarEl = document.querySelector(`.${chartsToolbarClasses.root}`);
  chartsToolbarEl?.remove();
}
