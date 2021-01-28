// types
import { Commands, Args, RawArgs, Plugin, PluginApply } from './types'
import { error, loadModule } from './utils'
import ConfigManager, { IConfigManager } from './manager/ConfigManager'
import PathManager, { IPathManager } from './manager/PathManager'
import EnvManager, { IEnvManager } from './manager/EnvManager'
import PluginAPI from './PluginAPI'

class Cli {
  private initialized = false
  plugins: Plugin[] = []
  commands: Commands = {}
  // manager
  PathManager: IPathManager
  EnvManager: IEnvManager
  ConfigManager: IConfigManager

  constructor(context: string) {
    this.PathManager = new PathManager(context)
    this.EnvManager = new EnvManager(this.PathManager)
    this.ConfigManager = new ConfigManager(this.PathManager)
  }

  // 启动 cli
  async setupCli(): Promise<void> {
    if (this.initialized) return
    this.initialized = true
    // load plugin
    this.plugins = await this.resolvePlugins()
    // 1. load config
    await this.ConfigManager.loadUserConfig()
    // 2. apply plugins
    this.plugins.forEach(({ id, apply }) => {
      // some skip plugins ??
      apply(new PluginAPI(id, this), this.ConfigManager.projectConfig)
    })
  }

  async resolvePlugins(): Promise<Plugin[]> {
    async function toPlugin(pluginPkgName: string) {
      const [err, apply] = await loadModule<PluginApply>(pluginPkgName)
      const id = pluginPkgName.replace(/^@xus\/cli-plugin-/, 'built-in:')
      if (err) {
        error(`
          plugin [${id}] load error
        `)
        return null
      }
      return {
        id,
        apply
      }
    }
    const builtInPlugins = []
    const builtInMap = ['@xus/cli-plugin-command-help']
    for (const pkgName in builtInMap) {
      const plugin = await toPlugin(pkgName)
      if (plugin) {
        builtInPlugins.push(plugin)
      }
    }
    // TODO: user install plugin
    return builtInPlugins
  }

  async run(commandName: string, args: Args, rawArgs: RawArgs): Promise<any> {
    // 1. setup
    await this.setupCli()

    // 2. get command task run
    const command = this.commands[commandName] || null
    if (!command) {
      error(`
        unknown command ${commandName}
      `)
      process.exit(1)
    }

    // remove command
    args._.shift()
    rawArgs.shift()

    const { fn } = command
    return fn(args, rawArgs)
  }
}

export type CliInstance = InstanceType<typeof Cli>

export default Cli
