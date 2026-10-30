import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ToolApprovalAndRenderersHeadlessChat from './ToolApprovalAndRenderersHeadlessChat';
import ClientProvider from './client';

export default createDemo(import.meta.url, ToolApprovalAndRenderersHeadlessChat, {
  ClientProvider,
});
