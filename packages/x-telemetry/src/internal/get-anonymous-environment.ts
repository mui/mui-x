import isDockerFunction from 'is-docker';
import * as ciEnvironment from './ci-info';

type AnonymousMeta = {
  isDocker: boolean;
  isCI: boolean;
  ciName: string | undefined;
  nodeVersion: string;
};

let traits: AnonymousMeta | undefined;

function getAnonymousEnvironment(): AnonymousMeta {
  if (traits) {
    return traits;
  }

  traits = {
    isDocker: isDockerFunction(),
    isCI: ciEnvironment.isCI,
    ciName: (ciEnvironment.isCI && ciEnvironment.name) || undefined,
    nodeVersion: process.version,
  };

  return traits;
}

export default getAnonymousEnvironment;
