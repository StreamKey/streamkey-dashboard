import bcrypt from 'bcrypt'
import _ from 'lodash'

import findUser from './findUser'

export default async({ email, password }) => {
  try {
    const user = await findUser({ email })
    const isPassCorrect = await bcrypt.compare(password, user.dataValues.passwordHash)
    if (!isPassCorrect) {
      throw new Error('invalid-credentials')
    }
    return _.pick(user.dataValues, ['id', 'name', 'email'])
  } catch (e) {
    throw e
  }
}
