import isDockerFunction from 'is-docker';
import ciEnvironment from 'ci-info';

type AnonymousMeta = {
  isDocker: boolean;
  isCI: boolean;
  ciName?: string;
};

let traits: AnonymousMeta | undefined;

function getAnonymousEnvironment(): AnonymousMeta {
  if (traits) {
    return traits;
  }

  const ciName = ciEnvironment.isCI && ciEnvironment.name;
  traits = {
    isDocker: isDockerFunction(),
    isCI: ciEnvironment.isCI,
    ...(ciName && { ciName }),
  };

  return traits;
}

export default getAnonymousEnvironment;
