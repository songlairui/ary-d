import { Command, flags } from '@oclif/command'
import inquirer = require('inquirer')

import config from '../../config'
import { DIR_WORKING, DIRS } from '../../constant'

const tmpWorkingDir = config.get(DIR_WORKING)

export default class DirsLs extends Command {
  static description = `show config dirs and select active [ ${tmpWorkingDir} ]`

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' })
  }

  static args = [{ name: 'file' }]

  async run() {
    this.log('Coding Dirs, Select to active:')
    const workingDir = config.get(DIR_WORKING) || '----'
    const dirs: string[] = config.get(DIRS) || []
    const answer = await inquirer.prompt([
      {
        type: 'list',
        message: 'Manage Config dirs, 选中设置为当前工作目录',
        name: 'workingDir',
        choices: ['----', ...dirs],
        default: workingDir
      }
    ])
    if (answer.workingDir && answer.workingDir !== '----') {
      config.set(DIR_WORKING, answer.workingDir)
      this.log('[config] `dir:working` <-', answer.workingDir)
    }
  }
}
