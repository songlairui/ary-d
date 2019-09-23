import { Command, flags } from '@oclif/command'
import inquirer = require('inquirer')

import config from '../../config'

export default class DirsLs extends Command {
  static description = 'show config dirs and deselect to remove'

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' })
  }

  static args = [{ name: 'file' }]

  async run() {
    this.log('Coding Dirs:')

    const dirs: string[] = config.get('dirs') || []
    const answer = await inquirer.prompt([
      {
        type: 'checkbox',
        message: 'Manage Config dirs, 取消选中删除',
        name: 'dirs',
        choices: dirs.map((dir: string) => ({
          name: dir,
          checked: true
        }))
      }
    ])
    if (answer.dirs.length !== dirs.length) {
      config.set('dirs', answer.dirs)
      this.log('[config] `dirs` updated!')
    }
  }
}
