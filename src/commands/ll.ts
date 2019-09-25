import { Command, flags } from '@oclif/command'
import fs from 'fs-extra'
import { resolve } from 'path'
import SimpleGit from 'simple-git/promise'
import { RemoteWithRefs } from 'simple-git/typings/response'

import config from '../config'
import { DIR_WORKING } from '../constant'
import { ConfGuard } from '../decorator/conf.guard'
import { isGitRoot } from '../utils/fs.util'

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
    const workingDir: string = config.get(DIR_WORKING)
    this.log(workingDir, 'workingDir')
    const dirs = await Promise.all(
      (await fs.readdirSync(workingDir))
        // .slice(100, 101)
        .map(async (fileName: string, idx: number) => {
          const filePath = resolve(workingDir, fileName)
          const stat = await fs.stat(filePath)
          const isDirectory = stat.isDirectory()

          let isGit = false
          let remotes: RemoteWithRefs[] = []
          let revCount = ''
          let currentBranch = ''

          if (isDirectory) {
            isGit = await isGitRoot(filePath)
            if (isGit) {
              const git = SimpleGit(filePath)

              remotes = await git.getRemotes(true)
              if (remotes.length) {
                currentBranch = await git.revparse(['--abbrev-ref', 'HEAD'])
                if (currentBranch !== 'HEAD') {
                  const upstreamBranch = await git
                    .revparse(['--symbolic-full-name', '--abbrev-ref', '@{u}'])
                    .catch((e: Error) => {
                      return e.message
                    })
                  if (!upstreamBranch.startsWith('fatal:')) {
                    revCount = await git.raw([
                      'rev-list',
                      '--left-right',
                      '--count',
                      `${upstreamBranch}...${currentBranch}`
                    ])
                  }
                }
              }
            }
          }
          const remote0 = remotes[0] || { refs: {} }
          return `${idx}  ${
            isDirectory ? '[]' : '--'
          } ${fileName}\t\t${currentBranch || '-'}\t${revCount ||
            '-'}\t${remote0.name || '-'}\t${remote0.refs.fetch || '-'}`
        })
    )
    this.log(dirs.join('\n'))
  }
}
