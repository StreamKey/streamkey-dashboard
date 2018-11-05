import util from 'util'

const exec = util.promisify(require('child_process').exec)

const { RAZZLE_ROOT_PATH } = process.env

const rootDir = RAZZLE_ROOT_PATH

const validateInput = body => {
  if (body.date && !body.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    throw new Error('create-report-invalid-date')
  }
}

export default async body => {
  validateInput(body)
  let command = 'yarn workers:createReport'
  if (body.date) {
    command += ' --date ' + body.date
  }
  const { stdout, stderr } = await exec(command, { cwd: rootDir })
  return {
    body,
    rootDir,
    stdout,
    stderr
  }
}
