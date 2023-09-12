import { ponyfillGlobal } from '@mui/utils';

export const getReleaseInfo = () => {
  const releaseInfo = '__RELEASE_INFO__';
  if (process.env.NODE_ENV !== 'production') {
    // A simple hack to set the value in the test environment (has no build step).
    // eslint-disable-next-line no-useless-concat
    if (releaseInfo === '__RELEASE' + '_INFO__') {
      // eslint-disable-next-line no-underscore-dangle
      return ponyfillGlobal.__MUI_RELEASE_INFO__;
    }
  }

  return releaseInfo;
};
