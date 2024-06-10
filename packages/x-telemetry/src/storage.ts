/* eslint-disable */
import { ponyfillGlobal } from '@mui/utils';
import type { BinaryLike } from 'crypto'
import Conf from './compiled/conf'
import { createHash, randomBytes } from 'crypto'
import isDockerFunction from './compiled/is-docker'
import { machineId } from './compiled/node-machine-id'
import path from 'path'

import { getAnonymousMeta } from './anonymous-meta'
import * as ciEnvironment from './ci-info'
// import { _postPayload } from './post-payload'
import { getRawProjectId } from './project-id'
// import { AbortController } from 'next/dist/compiled/@edge-runtime/ponyfill'
import fs from 'fs'
import { getMuiXTelemetryEnv } from "./env";

// This is the key that stores whether or not telemetry is enabled or disabled.
const TELEMETRY_KEY_ENABLED = 'telemetry.enabled'

// This is the key that specifies when the user was informed about anonymous
// telemetry collection.
const TELEMETRY_KEY_NOTIFY_DATE = 'telemetry.notifiedAt'

// This is a quasi-persistent identifier used to dedupe recurring events. It's
// generated from random data and completely anonymous.
const TELEMETRY_KEY_ID = `telemetry.anonymousId`

type RecordObject = {
    isFulfilled: boolean
    isRejected: boolean
    value?: any
    reason?: any
}

function getStorageDirectory(distDir: string): string | undefined {
    const isLikelyEphemeral = ciEnvironment.isCI || isDockerFunction()

    if (isLikelyEphemeral) {
        return path.join(distDir, 'cache')
    }

    return undefined
}

export class TelemetryStorage {
    private conf: Conf<any> | null
    private distDir: string
    private loadProjectId: undefined | string | Promise<string>

    private queue: Set<Promise<RecordObject>>

    constructor({ distDir }: { distDir: string }) {
        this.distDir = distDir
        const storageDirectory = getStorageDirectory(distDir)

        try {
            // `conf` incorrectly throws a permission error during initialization
            // instead of waiting for first use. We need to handle it, otherwise the
            // process may crash.
            this.conf = new Conf({ projectName: 'mui-x', cwd: storageDirectory })
        } catch (_) {
            this.conf = null
            console.log('[telemetry] failed to initialize telemetry storage', _)
        }
        this.queue = new Set()

        this.notify()
    }

    private notify = () => {
        if (this.isDisabled || !this.conf) {
            return
        }

        // The end-user has already been notified about our telemetry integration. We
        // don't need to constantly annoy them about it.
        // We will re-inform users about the telemetry if significant changes are
        // ever made.
        if (this.conf.get(TELEMETRY_KEY_NOTIFY_DATE, '')) {
            return
        }
        this.conf.set(TELEMETRY_KEY_NOTIFY_DATE, Date.now().toString())

        console.log(`[Attention]: MUI X now collects completely anonymous telemetry regarding usage.`)
        console.log(`This information is used to shape MUI' roadmap and prioritize features.`)
        console.log(`You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:`)
        console.log('https://mui.com/telemetry')
        console.log()
    }

    get anonymousId(): string {
        const val = this.conf && this.conf.get(TELEMETRY_KEY_ID)
        if (val) {
            return val
        }

        const generated = randomBytes(32).toString('hex')
        this.conf && this.conf.set(TELEMETRY_KEY_ID, generated)
        return generated
    }

    public get isDisabled(): boolean {
        if (!!getMuiXTelemetryEnv().DISABLED || !this.conf) {
            return true
        }
        return this.conf.get(TELEMETRY_KEY_ENABLED, true) === false
    }

    public setEnabled = (_enabled: boolean) => {
        const enabled = !!_enabled
        this.conf?.set(TELEMETRY_KEY_ENABLED, enabled)

        // Rerun the postinstall script to update the context file
        require('./scripts/postinstall')

        return this.conf && this.conf.path
    }

    public get isEnabled(): boolean {
        return (
            !getMuiXTelemetryEnv().DISABLED &&
            !!this.conf &&
            this.conf.get(TELEMETRY_KEY_ENABLED, true) !== false
        )
    }

    public async getProjectId(): Promise<string> {
        const machineId = await this.getMachineId()
        this.loadProjectId = this.loadProjectId || getRawProjectId(machineId)
        return createHash('sha256').update(await this.loadProjectId).digest('hex')
    }

    public async getMachineId(): Promise<string | null> {
        try {
            return await machineId()
        } catch (_) {
            return null
        }
    }
}
