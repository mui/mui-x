import isDockerFunction from './compiled/is-docker'

import * as ciEnvironment from './ci-info'

type AnonymousMeta = {
    // Environment information
    isDocker: boolean
    isCI: boolean
    ciName: string | undefined
    nodeVersion: string
}

let traits: AnonymousMeta | undefined

export function getAnonymousMeta(): AnonymousMeta {
    if (traits) {
        return traits
    }

    traits = {
        // Environment information
        isDocker: isDockerFunction(),
        isCI: ciEnvironment.isCI,
        ciName: (ciEnvironment.isCI && ciEnvironment.name) || undefined,
        nodeVersion: process.version,
    }

    return traits
}
