import { Command, flags } from '@oclif/command'
import inquirer = require('inquirer')
import { homedir } from 'os'

import config from '../../config'

export default class DirsAdd extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' })
  }

  static args = [{ name: 'file' }]

  async run() {
    const { args, flags } = this.parse(DirsAdd)

    const name = flags.name || 'world'
    this.log(
      `hello ${name} from /Users/songlairui/a-code/ary-d/src/commands/dirs/add.ts`
    )
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
    const answers = await inquirer.prompt([
      {
        type: 'directory',
        name: 'codingDir',
        message: '选择工作目录(经常存放代码的那些)',
        basePath: homedir()
      }
    ])
    const { codingDir } = answers
    const dirs = config.get('dirs')
    dirs.push(codingDir)
    config.set('dirs', dirs)
  }
}
