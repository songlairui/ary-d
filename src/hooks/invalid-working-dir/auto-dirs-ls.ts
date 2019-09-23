import { Hook } from '@oclif/config'

import DirsLs from '../../commands/dirs/ls'

const hook: Hook<'invalid-working-dir'> = async function(opts: any) {
  this.log('配置 `working-dir` 无效')
  await DirsLs.run()
  this.log('配置完成, 请重试', `... ${opts && opts.id}`)
}

export default hook
