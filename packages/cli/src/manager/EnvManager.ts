import { createEnvName } from '@xus/cli-shared-utils'
import { IPathManager } from './PathManager'

class EnvManager {
  private PathManager: IPathManager

  constructor(pathManager: IPathManager) {
    this.PathManager = pathManager
  }

  get mode(): string {
    return process.env.XUS_CLI_MODE || 'development'
  }

  // for plugin
  getEnv(envName: string): string | null {
    return process.env[envName] || null
  }

  setEnv(name: string, value: string): void {
    process.env[createEnvName(name)] = value
  }
}

export type IEnvManager = InstanceType<typeof EnvManager>

export default EnvManager
