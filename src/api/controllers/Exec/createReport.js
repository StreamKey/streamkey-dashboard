import util from 'util'

const exec = util.promisify(require('child_process').exec)

const { RAZZLE_ROOT_PATH } = process.env

const rootDir = RAZZLE_ROOT_PATH

export default async body => {
  const { stdout, stderr } = await exec('yarn workers:createReport', { cwd: rootDir })
  return {
    body,
    rootDir,
    stdout,
    stderr
  }
}
