import exec from '../controllers/Exec/'

export default async req => {
  try {
    const res = await exec(req.params.script, req.body)
    return {
      success: true,
      ...res
    }
  } catch (e) {
    throw e
  }
}
