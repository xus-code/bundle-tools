import { HookTypes } from '../enums'

// hooks
export interface IHook<
  T extends (...args: any[]) => any = (...args: any[]) => any
> {
  // hooks name only key
  name: string
  // register from which plugin
  pluginName: string
  fn: T
  // for call order based on tapable
  stage?: number
  before?: string
}
export interface IHookApplyOps {
  name: string
  type: HookTypes
  initialValue?: any
  args?: any
}

export type IRegisterMethodArgs<
  T extends (...args: any[]) => any = (...args: any[]) => any
> = Omit<IHook<T>, 'name' | 'pluginName'> | T

export type IFastHookRegister<
  T extends (...args: any[]) => any = (...args: any[]) => any
> = (ops: IRegisterMethodArgs<T>) => void
