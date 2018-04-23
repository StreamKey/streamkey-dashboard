import '../../../env'

import DB from '../../DB/'
import User from '../../api/controllers/User/'

const getUserArgs = () => {
  const user = {
    name: null,
    email: null,
    password: null
  }
  for (let i in process.argv) {
    const next = Number(i) + 1
    if (process.argv[i] === '--name' && process.argv[next]) {
      user.name = process.argv[next]
    }
    if (process.argv[i] === '--email' && process.argv[next]) {
      user.email = process.argv[next]
    }
    if (process.argv[i] === '--password' && process.argv[next]) {
      user.password = process.argv[next]
    }
  }
  return user
}

const main = async () => {
  await DB.init()
  const {
    name,
    email,
    password
  } = getUserArgs()
  if (!name || !email || !password) {
    console.error('Missing arguments. Use --name --email and --password')
    process.exit()
  }
  await User.createUser(name, email, password)
  await DB.close()
}

main()
