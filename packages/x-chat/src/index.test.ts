import * as chat from '@mui/x-chat';
import * as headlessBridge from '@mui/x-chat/headless';
import * as headlessDirect from '@mui/x-chat-headless';
import * as unstyledBridge from '@mui/x-chat/unstyled';
import * as unstyledDirect from '@mui/x-chat-unstyled';

describe('x-chat package scaffold', () => {
  it('resolves the root and bridge entry points', () => {
    expect(chat).toBeDefined();
    expect(headlessBridge).toBeDefined();
    expect(unstyledBridge).toBeDefined();
    expect(Object.keys(headlessBridge)).toEqual(Object.keys(headlessDirect));
    expect(Object.keys(unstyledBridge)).toEqual(Object.keys(unstyledDirect));
  });
});
