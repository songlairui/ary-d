import { pathExists } from 'fs-extra'
import { join } from 'path'

/**
 * 目录是否 git 目录
 * @param dir 目录
 */
export async function isGitRoot(dir: string) {
  return pathExists(join(dir, '.git/config'))
}
