import * as React from 'react';
import { renderHook } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { ChatAdapter } from '../adapters';
import { ChatProvider, type ChatProviderProps } from '../ChatProvider';
import type { ChatPartRendererMap } from '../renderers';
import { useChatPartRenderer } from './useChatPartRenderer';

declare module '@mui/x-chat-headless/types' {
  interface ChatCustomMessagePartMap {
    poll: {
      type: 'poll';
      question: string;
      options: string[];
    };
  }
}

function createAdapter(): ChatAdapter {
  return {
    async sendMessage() {
      return new ReadableStream({
        start(controller) {
          controller.close();
        },
      });
    },
  };
}

function createProviderWrapper(initialProps: Omit<ChatProviderProps, 'children'>) {
  let currentProps = initialProps;

  function Wrapper({ children }: React.PropsWithChildren) {
    return <ChatProvider {...currentProps}>{children}</ChatProvider>;
  }

  return {
    Wrapper,
    setProps(nextProps: Omit<ChatProviderProps, 'children'>) {
      currentProps = nextProps;
    },
  };
}

describe('useChatPartRenderer', () => {
  it('throws outside the provider', () => {
    expect(() => renderHook(() => useChatPartRenderer('text'))).toThrow(
      'MUI X Chat: useChatRuntimeContext must be used within a <ChatProvider> component',
    );
  });

  it('returns null for default built-in and unknown part types', () => {
    const { Wrapper } = createProviderWrapper({
      adapter: createAdapter(),
    });
    // eslint-disable-next-line testing-library/render-result-naming-convention
    const textHook = renderHook(() => useChatPartRenderer('text'), { wrapper: Wrapper });
    // eslint-disable-next-line testing-library/render-result-naming-convention
    const pollHook = renderHook(() => useChatPartRenderer('poll'), { wrapper: Wrapper });

    expect(textHook.result.current).toBeNull();
    expect(pollHook.result.current).toBeNull();
  });

  it('returns the registered custom renderer for a part type', () => {
    const partRenderers: ChatPartRendererMap = {
      poll: ({ part }) => part.question,
    };
    const { Wrapper } = createProviderWrapper({
      adapter: createAdapter(),
      partRenderers,
    });
    const { result } = renderHook(() => useChatPartRenderer('poll'), { wrapper: Wrapper });

    expect(result.current).toBe(partRenderers.poll);
  });
});
