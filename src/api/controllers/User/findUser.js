import DB from '../../../DB/'

export default async ({ email }) => {
  if (typeof email === 'undefined') {
    throw new Error('user-not-found')
  }
  const results = await DB.models.Users.findAll({
    where: {
      ...(typeof email === 'undefined' ? {} : { email }),
      deletedAt: null
    },
    limit: 1
  })
  if (results.length !== 1) {
    throw new Error('user-not-found')
  }
  return results[0]
}
