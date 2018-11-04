import util from 'util'

const exec = util.promisify(require('child_process').exec)

const { RAZZLE_ROOT_PATH } = process.env

const rootDir = RAZZLE_ROOT_PATH

const validateInput = body => {
  if (!body.as) {
    throw new Error('fetch-data-missing-as')
  }
  if (!body.ssp) {
    throw new Error('fetch-data-missing-ssp')
  }
  if (!body.date) {
    throw new Error('fetch-data-missing-date')
  }
  for (let p in body.as) {
    if (p.match(/\W/)) {
      throw new Error('fetch-data-invalid-input')
    }
  }
  for (let p in body.ssp) {
    if (p.match(/\W/)) {
      throw new Error('fetch-data-invalid-input')
    }
  }
  if (body.date.match(/[^\d-]/)) {
    throw new Error('fetch-data-invalid-input')
  }
}

export default async body => {
  validateInput(body)
  let command = 'yarn workers:fetchData'
  if (body.as.length === 0) {
    command += ' --skipAs'
  } else {
    command += ' --asList ' + body.as.join(',')
  }
  if (body.ssp.length === 0) {
    command += ' --skipSsp'
  } else {
    command += ' --sspList ' + body.ssp.join(',')
  }
  command += ' --date ' + body.date
  const { stdout, stderr } = await exec(command, { cwd: rootDir })
  return {
    body,
    rootDir,
    stdout,
    stderr
  }
}
