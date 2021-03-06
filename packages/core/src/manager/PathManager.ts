import { join, relative } from 'path'
import { statSync, readdirSync } from 'fs'
import { isLernaPkg, lookUpFile } from '@xus/cli-shared'
import { CONFIG_FILES } from '../constants'

export class PathManager {
  private configPath!: string | undefined
  get cwd(): string {
    return process.cwd()
  }

  get cwdPkg() {
    return this.getPathBasedOnCtx('package.json')
  }

  get userConfigPath() {
    if (!this.configPath) {
      this.configPath = lookUpFile(this.cwd, CONFIG_FILES, true) || undefined
    }
    return this.configPath
  }

  // for plugins
  getPathBasedOnCtx(basedOnRoot: string): string {
    return join(this.cwd, basedOnRoot)
  }

  getLernaPkgs({ root = this.cwd, isRelativeCwd = false } = {}): string[] {
    const pkgRoot = join(root, 'packages')
    if (isLernaPkg(root) && statSync(pkgRoot).isDirectory()) {
      return (readdirSync(pkgRoot) || []).reduce<string[]>(
        (memo, pkgDirName) => {
          const pkg = join(pkgRoot, pkgDirName)
          if (statSync(pkg).isDirectory()) {
            // support sub scope
            if (pkgDirName.startsWith('@')) {
              ;(readdirSync(pkg) || []).forEach((subPkgDirName) => {
                const subPkg = join(pkg, subPkgDirName)
                if (statSync(subPkg).isDirectory()) {
                  memo = [
                    ...memo,
                    isRelativeCwd ? relative(this.cwd, subPkg) : subPkg
                  ]
                }
              })
              return memo
            } else {
              return [...memo, isRelativeCwd ? relative(this.cwd, pkg) : pkg]
            }
          }
          return memo
        },
        []
      )
    }
    return []
  }
}

export type IPathManager = InstanceType<typeof PathManager>
