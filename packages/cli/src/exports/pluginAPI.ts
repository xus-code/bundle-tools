import type {
  IPluginAPI as IPluginAPIBase,
  IPathManager,
  IConfigManager,
  IEnvManager,
  IPluginManager,
  IArgs,
  IRawArgs
} from '@xus/core'
import type { IBabelRegister } from '@xus/cli-shared'
import { IBuildLibMethods } from '@xus/preset-built-in'
import type { IConfig } from './create'

type noopFn = () => any

export interface IPluginAPI extends IPluginAPIBase {
  // service api
  BabelRegister: IBabelRegister
  // service lifycycle
  onPluginReady: noopFn
  onRunCmd: noopFn
  getCmdArgs: () => { args: IArgs; rawArgs: IRawArgs }

  // path manager
  cwd: IPathManager['cwd']
  cwdPkg: IPathManager['cwdPkg']
  userConfigPath: IPathManager['userConfigPath']
  getPathBasedOnCtx: IPathManager['getPathBasedOnCtx']
  getLernaPkgs: IPathManager['getLernaPkgs']

  // env manager
  mode: IEnvManager['mode']
  babelEnv: IEnvManager['babelEnv']
  getEnv: IEnvManager['getEnv']
  setEnv: IEnvManager['setEnv']
  getCliEnv: IEnvManager['getCliEnv']
  setCliEnv: IEnvManager['setCliEnv']

  // config manager
  projectConfig: IConfig
  cwdPkgJson: IConfigManager['cwdPkgJson']
  loadConfig: IConfigManager['loadConfig']

  // plugin manager
  skipPlugin: IPluginManager['skipPlugin']

  // build lib plugin
  modifyLibBundler: IBuildLibMethods['modifyLibBundler']
  modifyRollupConfig: IBuildLibMethods['modifyRollupConfig']
  getRollupChainConfig: IBuildLibMethods['getRollupChainConfig']
  onLibBuildFailed: IBuildLibMethods['onLibBuildFailed']
  onLibBuildSucceed: IBuildLibMethods['onLibBuildSucceed']
  runLibBuild: IBuildLibMethods['runLibBuild']
}
