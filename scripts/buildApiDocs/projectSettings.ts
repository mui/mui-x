import { ProjectSettings } from '@mui-internal/api-docs-builder';
import { projectChatSettings } from './chatSettings';
import { projectPickersSettings } from './pickersSettings';
import { projectChartsSettings } from './chartsSettings';
import { projectGridSettings } from './gridSettings';
import { projectTreeSettings } from './treeViewSettings';

export const projectSettings: ProjectSettings[] = [
  projectPickersSettings,
  projectChartsSettings,
  projectTreeSettings,
  projectGridSettings,
  projectChatSettings,
];
