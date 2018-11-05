import util from 'util'
import { isArray, isString } from 'lodash'
import { asList, sspList } from '../../../components/Utils'

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
  if (!isArray(body.as) || !isArray(body.ssp) || !isString(body.date)) {
    throw new Error('fetch-data-invalid-input')
  }
  for (let p of body.as) {
    if (!asList.includes(p)) {
      throw new Error('fetch-data-invalid-input')
    }
  }
  for (let p of body.ssp) {
    if (!sspList.includes(p)) {
      throw new Error('fetch-data-invalid-input')
    }
  }
  if (!body.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
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
