import { SOURCE_CODE_REPO, SOURCE_GITHUB_BRANCH } from 'docs/constants';
import {
  agentSource,
  basicSource,
  captionsSource,
  copilotSource,
  messengerSource,
  widgetSource,
} from './generatedCodeSources';
import type { ChatView } from './ViewToggleGroup';

type OverviewDemoTab = {
  tab: string;
  code: string;
  language: string;
};

type OverviewDemoConfig = {
  title: string;
  githubSourcePath: string;
  tabs: OverviewDemoTab[];
};

function createSourceUrl(sourcePath: string) {
  return `${SOURCE_CODE_REPO}/blob/${SOURCE_GITHUB_BRANCH}/${sourcePath}`;
}

function createCodeDemo(title: string, githubSourcePath: string, code: string): OverviewDemoConfig {
  return {
    title,
    githubSourcePath,
    tabs: [{ tab: 'App.tsx', code, language: 'tsx' }],
  };
}

export const chatOverviewDemos: Record<ChatView, OverviewDemoConfig> = {
  basic: createCodeDemo(
    'Drop-in ChatBox',
    'docs/src/modules/components/overview/chat/mainDemo/code/basic/App.tsx',
    basicSource,
  ),
  messenger: createCodeDemo(
    'Multi-conversation inbox',
    'docs/data/chat/material/examples/multi-conversation/MultiConversation.tsx',
    messengerSource,
  ),
  agent: createCodeDemo(
    'Agentic code assistant',
    'docs/data/chat/material/examples/agentic-code/AgenticCode.tsx',
    agentSource,
  ),
  widget: createCodeDemo(
    'Intercom-style widget',
    'docs/data/chat/headless/examples/intercom-style/IntercomStyleChat.tsx',
    widgetSource,
  ),
  captions: createCodeDemo(
    'Grouped message timeline',
    'docs/data/chat/headless/examples/grouped-message-timeline/GroupedMessageTimeline.tsx',
    captionsSource,
  ),
  copilot: createCodeDemo(
    'Copilot side panel with Data Grid',
    'docs/src/modules/components/overview/chat/mainDemo/code/copilot/App.tsx',
    copilotSource,
  ),
};

export function getChatOverviewDemoSourceUrl(view: ChatView) {
  return createSourceUrl(chatOverviewDemos[view].githubSourcePath);
}
