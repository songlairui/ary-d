import { Hook } from '@oclif/config'
import inquirer from 'inquirer'
import InquirerSelectDirectory from 'inquirer-select-directory'

import config from '../../config'

const hook: Hook<'init'> = async function() {
  inquirer.registerPrompt('directory', InquirerSelectDirectory)

  const dirs = config.get('dirs')
  if (!Array.isArray(dirs)) {
    config.set('dirs', [])
  }
}

export default hook
