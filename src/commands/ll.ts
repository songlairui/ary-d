import { Command, flags } from '@oclif/command'

import config from '../config'
import { DIR_WORKING } from '../constant'
import { ConfGuard } from '../decorator/conf.guard'

export default class Ll extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' })
  }

  static args = [{ name: 'file' }]

  @ConfGuard(DIR_WORKING)
  async run() {
    const workingDir = config.get(DIR_WORKING)
    this.log(workingDir, 'workingDir')
  }
}
