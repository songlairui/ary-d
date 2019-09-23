import { Hook } from '@oclif/config'
import inquirer from 'inquirer'
import InquirerSelectDirectory from 'inquirer-select-directory'

import config from '../../config'
import { DIR_WORKING, DIRS } from '../../constant'

const hook: Hook<'init'> = async function() {
  inquirer.registerPrompt('directory', InquirerSelectDirectory)

  const dirs = config.get(DIRS)
  if (!Array.isArray(dirs)) {
    config.set(DIRS, [])
  }

  const workingDir = config.get(DIR_WORKING)
  if (!workingDir) {
    this.warn('DIR_WORKING not set')
  } else {
    this.log(`working dir: [${workingDir}]`)
  }
}

export default hook
