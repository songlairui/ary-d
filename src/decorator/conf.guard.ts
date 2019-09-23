import Command from '@oclif/command'

import config from '../config'
import { DIR_WORKING } from '../constant'

// config value should exist

export function ConfGuard(key: string, retVal?: any) {
  return function(
    _target: object,
    _propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    const canActive = !!config.get(key)
    const originFn = descriptor.value

    const execHook = function(this: Command) {
      return this.config.runHook('invalid-working-dir', {
        id: this.id
      })
    }

    descriptor.value = function(this: Command, ...args: any[]) {
      if (canActive) {
        return originFn.apply(this, args)
      }
      switch (key) {
        case DIR_WORKING:
          return execHook.apply(this)
        default:
          return retVal
      }
    }
    return descriptor
  }
}
